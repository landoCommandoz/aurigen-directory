// pipeline/agents/qa-agent.js
// The QA Agent reviews changes made by the Code Agent. It checks for:
// - Architecture rule violations
// - Syntax errors (node --check)
// - Design identity drift
// - Broken functionality
// - Accessibility regressions

import { query } from "@anthropic-ai/claude-agent-sdk";
import { PIPELINE_CONFIG, ARCHITECTURE_RULES, DESIGN_RULES } from "../config.js";

const SYSTEM_PROMPT = `You are the QA Agent for the Aurigen County Resource Directory — a bilingual (EN/ES) tax lien and tax deed investor directory.

YOUR ROLE: Review code changes and determine if they are safe to ship.

CHECK THESE ARCHITECTURE RULES:
${ARCHITECTURE_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n")}

CHECK DESIGN IDENTITY:
- Must maintain: dark cinematic, near-black (#0d0d0d), gold accent, off-white text
- Must maintain: ${DESIGN_RULES.headlineFont} headlines, ${DESIGN_RULES.bodyFont} body
- Must maintain: glass morphism, motion
- Must NOT have: ${DESIGN_RULES.forbidden.join(", ")}

CHECKS TO PERFORM:
1. Run \`node --check index.html\` — must pass (checks embedded script syntax)
2. Run \`node --check states-en.js\` — must pass
3. Run \`node --check states-es.js\` — must pass
4. Read modified files and verify architecture rules are not violated
5. Verify no protected files were modified
6. Check for common issues: XSS, broken event listeners, CSS conflicts
7. Verify bilingual parity if applicable

OUTPUT FORMAT — valid JSON only:
{
  "approved": true|false,
  "checks": [
    {
      "check": "syntax-check",
      "passed": true|false,
      "details": "..."
    }
  ],
  "issues": [
    {
      "severity": "blocker|warning|info",
      "file": "index.html",
      "description": "What's wrong",
      "suggestion": "How to fix it"
    }
  ],
  "summary": "Overall assessment"
}

RULES:
- If ANY blocker issue exists, set approved: false
- Warnings alone should not block approval
- Be thorough but fair — don't block good changes for nitpicks
- Syntax check failures are ALWAYS blockers`;

export async function runQAAgent({ cwd, improvement, codeResult, logger }) {
  logger.info("QA", `Reviewing: ${improvement.title}`);

  const changedFiles = (codeResult.changes || []).map((c) => c.file).join(", ") || "unknown";
  logger.info("QA", `  Files changed: ${changedFiles}`);

  let result = null;

  for await (const message of query({
    prompt: `Review the following code changes to the Aurigen Directory:

IMPROVEMENT THAT WAS IMPLEMENTED: ${improvement.title}
DESCRIPTION: ${improvement.description}
FILES CHANGED: ${changedFiles}
CODE AGENT NOTES: ${codeResult.notes || "None"}

Perform a full QA review:
1. Run syntax checks: \`node --check index.html\`, \`node --check states-en.js\`, \`node --check states-es.js\`
2. Read the changed files and verify they follow all architecture rules
3. Check that no protected files (netlify.toml, package.json, netlify/functions/aurigen.js) were modified
4. Look for common issues (XSS, broken listeners, CSS conflicts, design identity drift)

Output ONLY a JSON review result. No markdown, no explanation — just the JSON.`,
    options: {
      cwd,
      allowedTools: ["Read", "Bash", "Glob", "Grep"],
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
    logger.error("QA", "No result returned from QA agent");
    return { approved: false, checks: [], issues: [{ severity: "blocker", description: "QA agent returned no output" }], summary: "QA failed to run" };
  }

  // Extract JSON
  let jsonStr = result.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  const jsonMatch = jsonStr.match(/\{[\s\S]*"approved"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const review = JSON.parse(jsonMatch[0]);
      const status = review.approved ? "APPROVED" : "REJECTED";
      const logFn = review.approved ? logger.success : logger.warn;
      logFn("QA", `Review: ${status} — ${review.summary}`);

      for (const issue of review.issues || []) {
        const fn = issue.severity === "blocker" ? logger.error : logger.warn;
        fn("QA", `  [${issue.severity}] ${issue.description}`);
      }

      return review;
    } catch {
      // Fall through
    }
  }

  logger.warn("QA", "Could not parse QA output — defaulting to rejected for safety");
  return {
    approved: false,
    checks: [],
    issues: [{ severity: "blocker", description: "Could not parse QA agent output" }],
    summary: "QA output was unparseable — rejecting for safety",
  };
}
