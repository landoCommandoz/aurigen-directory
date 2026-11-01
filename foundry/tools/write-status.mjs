#!/usr/bin/env node
// Writes STATUS.md (10 lines at most) from the files of the branch it runs on and a few environment values.
//   node foundry/tools/write-status.mjs > STATUS.md
// Reads: foundry/out/chain/<spec>.json, foundry/out/law-audit/PROGRESS.json, cloudflare/data/law/gaps.json.
// Environment (all optional): STATUS_SPEC, STATUS_RUN_URL, STATUS_RUN_NO, STATUS_TURNS, STATUS_COST, STATUS_SUBTYPE,
// STATUS_PUSHED, STATUS_MODEL, STATUS_REASON (why the chain stopped), STATUS_ERROR, STATUS_EVENT, STATUS_WHAT
// (free text for a change made by a person's session instead of a run). Prints no secret: errors are cut and redacted.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const env = (k, d = '') => process.env[k] ?? d;
const read = (p) => { try { return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8')); } catch { return null; } };
const clean = (s, n = 160) => String(s || '').replace(/sk-ant-[A-Za-z0-9_-]+/g, '[key]').replace(/[A-Za-z0-9_-]{40,}/g, '[x]').replace(/\s+/g, ' ').replace(/[—–]/g, '-').trim().slice(0, n);

const spec = env('STATUS_SPEC', 'aurigen-law-audit');
const chain = read(`foundry/out/chain/${spec}.json`);
const prog = read('foundry/out/law-audit/PROGRESS.json');
const gaps = read('cloudflare/data/law/gaps.json');
const now = new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC';
const money = (n) => '$' + Number(n || 0).toFixed(2);
const out = [];

const model = env('STATUS_MODEL') || 'default model';
const by = env('STATUS_RUN_URL') ? `Foundry run ${env('STATUS_RUN_NO', '?')}${env('STATUS_EVENT') === 'schedule' ? ' (nightly, 2 am Mountain)' : ''}` : 'a Claude Code session';
out.push(`Updated: ${now}. Written by ${by}. Public file: https://aurigen.landonbrewington12.workers.dev/status.json`);
if (env('STATUS_RUN_URL')) out.push(`Ran: ${spec}, run ${env('STATUS_RUN_NO', '?')}: ${env('STATUS_TURNS', '?')} turns, ${money(env('STATUS_COST'))}, Claude ended ${env('STATUS_SUBTYPE', 'unknown')}, work saved: ${env('STATUS_PUSHED', 'no')}.${env('STATUS_ERROR') ? ' Error: ' + clean(env('STATUS_ERROR')) : ''} ${clean(env('STATUS_RUN_URL'))}`);
else out.push(`Ran: nothing since the last update. ${clean(env('STATUS_WHAT', 'No run.'), 220)}`);

if (prog) {
  const st = Object.values(prog.states || {});
  const done = st.filter((s) => s.status === 'done').length;
  const blocked = st.filter((s) => s.status === 'blocked').length;
  const cs = (v) => st.filter((s) => s.checkStatus === v).length;
  const sum = (k) => st.reduce((a, s) => a + (s[k] || 0), 0);
  out.push(`Changed: ${done} of ${(prog.order || []).length} states audited (${cs('checked')} checked, ${cs('checked with gaps')} checked with gaps), ${blocked} could not be reached (blocked, retried each run). ${sum('corrected')} claims corrected, ${sum('flagged')} flagged, ${sum('unreachable')} unreachable.`);
}
if (chain) {
  const cap = chain.cap;
  out.push(`Money: ${env('STATUS_RUN_URL') ? 'this run ' + money(env('STATUS_COST')) : 'no API spend in this update'}; audit total ${money(chain.spent)}${cap ? ' of the ' + money(cap) + ' cap' : ''} over ${chain.runs ?? 0} runs. Model: ${model}. Nothing else was bought.`);
}
const held = [];
if (prog && read('cloudflare/data/law/ok.json')) {
  const n = (read('cloudflare/data/law/ok.json').claims || []).filter((c) => c.hold).length;
  if (n) held.push(`${n} Oklahoma claims held out of publishing until the statute is read`);
}
if (gaps) {
  const q = (gaps.queueOrder || []).filter((s) => gaps.states[s] && gaps.states[s].checkStatus === 'checked with gaps').length;
  if (q) held.push(`${q} states have a gap-closing item queued (Colorado 2025-26 laws and Arkansas official code first)`);
  const cr = Object.entries(gaps.states || {}).filter(([, v]) => v.checkStatus === "Couldn't reach source").map(([k]) => k);
  if (cr.length) held.push(`${cr.join(' and ')} stay "Couldn't reach source" until the certificate step works`);
}
out.push(`Held: ${held.length ? held.join('; ') : 'nothing'}. The live site stays on the under-review page.`);
const stop = env('STATUS_REASON');
out.push(`Schedule: every night at 2 am Mountain, $10 a run, stops at the cap or at 51 of 51 states.${stop ? ' Chain note: ' + clean(stop, 200) : ''}`);
const trouble = /refused|credit|spend limit|key/i.test(env('STATUS_ERROR') + ' ' + stop);
out.push(`Human: ${trouble ? 'check the Anthropic key, credit balance and spend limit (see the chain note above).' : 'nothing.'}`);
process.stdout.write(out.slice(0, 10).join('\n') + '\n');
