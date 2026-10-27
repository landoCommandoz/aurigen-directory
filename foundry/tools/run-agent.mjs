#!/usr/bin/env node
// Runs one Foundry task with the Claude Agent SDK instead of claude-code-action.
//
//   node foundry/tools/run-agent.mjs
//
// Environment (set by .github/workflows/foundry.yml):
//   ANTHROPIC_API_KEY        required
//   FOUNDRY_PROMPT_FILE      path of the prompt text file (the same prompt the action used)
//   FOUNDRY_MAX_TURNS        default 150
//   FOUNDRY_MAX_BUDGET_USD   optional hard cap for this run; the SDK stops the run when it is reached
//   FOUNDRY_MODEL            optional model id; empty means Claude Code's own default
//   FOUNDRY_TIMEOUT_MIN      default 73; the run is stopped cleanly a little before the 75 minute step limit
//   RUNNER_TEMP              where the result record is written
//
// Writes ${RUNNER_TEMP}/claude-execution-output.json in the shape the workflow's "Read how the Claude run
// ended" step already reads: a list whose last item with type "result" carries subtype, is_error, num_turns,
// total_cost_usd and result. The log shows progress and the final summary, never what the model wrote or any
// tool output, because the log of a public repository is public.
// Exit codes: 0 finished, 1 the result was an error or there was no result.
import fs from 'node:fs';
import path from 'node:path';
import { query } from '@anthropic-ai/claude-agent-sdk';

const TOOLS = ['Bash', 'Read', 'Edit', 'Write', 'Glob', 'Grep', 'WebFetch', 'WebSearch', 'TodoWrite'];
const redact = (s) => String(s ?? '').replace(/sk-ant-[A-Za-z0-9_-]+/g, '[key]').replace(/\s+/g, ' ').trim();

const promptFile = process.env.FOUNDRY_PROMPT_FILE;
const outDir = process.env.RUNNER_TEMP || process.cwd();
const outFile = path.join(outDir, 'claude-execution-output.json');
const maxTurns = Number(process.env.FOUNDRY_MAX_TURNS || 150);
const maxBudget = process.env.FOUNDRY_MAX_BUDGET_USD ? Number(process.env.FOUNDRY_MAX_BUDGET_USD) : undefined;
const timeoutMin = Number(process.env.FOUNDRY_TIMEOUT_MIN || 73);
const model = (process.env.FOUNDRY_MODEL || '').trim() || undefined;

if (!process.env.ANTHROPIC_API_KEY) { console.error('::error::ANTHROPIC_API_KEY is not set'); process.exit(1); }
if (!promptFile || !fs.existsSync(promptFile)) { console.error('::error::FOUNDRY_PROMPT_FILE is missing'); process.exit(1); }
if (!Number.isFinite(maxTurns) || maxTurns < 1) { console.error('::error::FOUNDRY_MAX_TURNS must be a positive number'); process.exit(1); }
const prompt = fs.readFileSync(promptFile, 'utf8');

const record = [];            // small: init, one line per model turn, and the result
let turns = 0;
let result = null;
let stderrLines = 0;
const ac = new AbortController();
const timer = setTimeout(() => ac.abort(), timeoutMin * 60_000);

function save() {
  try { fs.writeFileSync(outFile, JSON.stringify(record, null, 1)); } catch (e) { console.error('could not write the result record:', redact(e.message)); }
}

try {
  const q = query({
    prompt,
    options: {
      cwd: process.cwd(),
      maxTurns,
      ...(maxBudget ? { maxBudgetUsd: maxBudget } : {}),
      ...(model ? { model } : {}),
      allowedTools: TOOLS,
      systemPrompt: { type: 'preset', preset: 'claude_code' },
      settingSources: ['user', 'project', 'local'],
      abortController: ac,
      // Subprocess stderr can carry the API's error text; keep a few redacted lines.
      stderr: (d) => { if (stderrLines++ < 30) console.error('claude:', redact(d).slice(0, 300)); },
    },
  });
  for await (const msg of q) {
    if (msg.type === 'system' && msg.subtype === 'init') {
      record.push({ type: 'system', subtype: 'init', model: msg.model });
      console.log(`Claude Agent SDK started. Model: ${msg.model}. Turn limit: ${maxTurns}.${maxBudget ? ` Budget cap: $${maxBudget}.` : ''}`);
    } else if (msg.type === 'assistant') {
      turns++;
      const tools = (msg.message?.content ?? []).filter((b) => b.type === 'tool_use').map((b) => b.name);
      record.push({ type: 'assistant', turn: turns, tools });
      if (turns <= 3 || turns % 10 === 0) console.log(`turn ${turns}${tools.length ? ': ' + [...new Set(tools)].join(', ') : ''}`);
    } else if (msg.type === 'result') {
      result = msg;
      record.push({
        type: 'result', subtype: msg.subtype, is_error: msg.is_error === true, duration_ms: msg.duration_ms,
        num_turns: msg.num_turns, total_cost_usd: msg.total_cost_usd, api_error_status: msg.api_error_status ?? null,
        result: typeof msg.result === 'string' ? redact(msg.result).slice(0, 1000) : '',
        modelUsage: msg.modelUsage ?? {},
      });
    }
  }
} catch (e) {
  record.push({ type: 'exception', message: redact(e?.message ?? e).slice(0, 500), aborted: ac.signal.aborted });
  // After a result message the SDK also throws for an error result; that case is reported below.
  if (!result) console.error(`::error::The Agent SDK stopped with an exception${ac.signal.aborted ? ' (time limit)' : ''}: ${redact(e?.message ?? e).slice(0, 300)}`);
} finally {
  clearTimeout(timer);
  save();
}

if (!result) { console.error('::error::The Agent SDK finished without a result message.'); process.exit(1); }

const usage = Object.entries(result.modelUsage ?? {}).map(([m, u]) => `${m}: in ${u.inputTokens ?? '?'}, out ${u.outputTokens ?? '?'}, $${(u.costUSD ?? 0).toFixed(4)}`).join('; ') || 'none recorded';
const cost = typeof result.total_cost_usd === 'number' ? result.total_cost_usd : 0;
const summary = `SDK result: subtype=${result.subtype} is_error=${result.is_error === true} turns=${result.num_turns} cost=$${cost.toFixed(4)} http=${result.api_error_status ?? 'none'} duration=${Math.round((result.duration_ms ?? 0) / 1000)}s. Usage by model: ${usage}`;
console.log(summary);
console.log(`::notice title=Agent SDK result::${summary}`);
if (result.is_error === true) {
  console.error(`::error::Claude result is an error: ${redact(result.result).slice(0, 300)}`);
  process.exit(1);
}
