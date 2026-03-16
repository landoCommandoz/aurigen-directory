// pipeline/agents/code-agent.js
// The Code Agent takes an improvement plan from the Design Agent and
// implements the changes. It writes actual code modifications.

import { query } from "@anthropic-ai/claude-agent-sdk";
import { PIPELINE_CONFIG, ARCHITECTURE_RULES, DESIGN_RULES } from "../config.js";

const SYSTEM_PROMPT = `You are the Code Agent for the Aurigen County Resource Directory — a bilingual (EN/ES) tax lien and tax deed investor directory.

YOUR ROLE: Implement code changes based on improvement plans provided to you.

CRITICAL ARCHITECTURE RULES — NEVER VIOLATE:
${ARCHITECTURE_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n")}

DESIGN IDENTITY (maintain at all times):
- Dark cinematic: near-black backgrounds (${DESIGN_RULES.backgrounds})
- Gold accent, off-white text
- ${DESIGN_RULES.headlineFont} headlines, ${DESIGN_RULES.bodyFont} body
- Glass morphism cards, motion on load
- NEVER: ${DESIGN_RULES.forbidden.join(", ")}

PROTECTED FILES — NEVER MODIFY:
${PIPELINE_CONFIG.protectedFiles.map((f) => `- ${f}`).join("\n")}

IMPLEMENTATION RULES:
1. Read the file BEFORE making any edit
2. Make small, focused edits — one logical change at a time
3. Preserve existing functionality — do not break what works
4. Keep all CSS within the existing variable system
5. Maintain bilingual parity — if you change EN, note that ES needs the same
6. Use Edit tool for surgical changes, not Write for full file rewrites
7. After ALL edits, summarize exactly what you changed and in which files

OUTPUT: After implementing, output a JSON summary:
{
  "implemented": true,
  "changes": [
    {
      "file": "index.html",
      "description": "What was changed",
      "lines_affected": "approximate line range"
    }
  ],
  "notes": "Any caveats or follow-up needed"
}`;

export async function runCodeAgent({ cwd, improvement, logger }) {
  logger.info("CODE", `Implementing: ${improvement.title}`);
  logger.info("CODE", `  Category: ${improvement.category} | Priority: ${improvement.priority}`);
  logger.info("CODE", `  Files: ${improvement.files.join(", ")}`);

  let result = null;

  for await (const message of query({
    prompt: `Implement the following improvement to the Aurigen Directory:

IMPROVEMENT: ${improvement.title}
DESCRIPTION: ${improvement.description}
FILES TO MODIFY: ${improvement.files.join(", ")}
IMPLEMENTATION NOTES: ${improvement.implementation_notes}

Read the relevant files first, then make the changes. Be surgical — change only what's needed.

After implementing, output a JSON summary of what you changed. Format:
{
  "implemented": true,
  "changes": [{"file": "...", "description": "...", "lines_affected": "..."}],
  "notes": "..."
}`,
    options: {
      cwd,
      allowedTools: ["Read", "Edit", "Glob", "Grep"],
      maxTurns: PIPELINE_CONFIG.maxTurns,
      model: PIPELINE_CONFIG.model,
      systemPrompt: SYSTEM_PROMPT,
      permissionMode: "bypassPermissions",
      allowDangerouslySkipPermissions: true,
    },
  })) {
    if ("result" in message) {
      result = message.result;
    }
  }

  if (!result) {
    logger.error("CODE", "No result returned from code agent");
    return { implemented: false, changes: [], notes: "Agent returned no output" };
  }

  // Extract JSON summary
  let jsonStr = result.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  // Try to find JSON object in the output
  const jsonMatch = jsonStr.match(/\{[\s\S]*"implemented"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const summary = JSON.parse(jsonMatch[0]);
      logger.success("CODE", `Implementation complete: ${summary.changes?.length || 0} changes`);
      for (const change of summary.changes || []) {
        logger.info("CODE", `  ✓ ${change.file}: ${change.description}`);
      }
      return summary;
    } catch {
      // Fall through
    }
  }

  logger.warn("CODE", "Could not parse structured output — treating as success with notes");
  return {
    implemented: true,
    changes: [],
    notes: result.slice(0, 500),
  };
}
