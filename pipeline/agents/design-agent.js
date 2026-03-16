// pipeline/agents/design-agent.js
// The Design Agent analyzes the current state of the Aurigen Directory and
// proposes concrete, actionable improvements. It does NOT write code — it
// produces a structured JSON improvement plan that the Code Agent consumes.

import { query } from "@anthropic-ai/claude-agent-sdk";
import { DESIGN_RULES, PIPELINE_CONFIG } from "../config.js";

const SYSTEM_PROMPT = `You are the Design Agent for the Aurigen County Resource Directory — a bilingual (EN/ES) tax lien and tax deed investor directory.

YOUR ROLE: Analyze the codebase and propose 1-${PIPELINE_CONFIG.maxImprovementsPerCycle} concrete, high-impact improvements.

DESIGN IDENTITY (must be maintained):
- Dark cinematic: near-black backgrounds (${DESIGN_RULES.backgrounds})
- Gold accent color
- Off-white text
- ${DESIGN_RULES.headlineFont} for headlines, ${DESIGN_RULES.bodyFont} for body
- Glass morphism cards, motion on load
- NEVER: ${DESIGN_RULES.forbidden.join(", ")}

ARCHITECTURE RULES (never violate):
- Every flex ancestor of a scroll container must have min-height:0
- Never use max-height on tab or list content
- Never use overflow:hidden on any ancestor of scrollable content
- Map must call invalidateSize() after layout changes
- localStorage always wrapped in null-safe try/catch

WHAT TO LOOK FOR:
1. UX improvements (navigation, readability, mobile responsiveness)
2. Performance optimizations (load time, rendering, asset efficiency)
3. Accessibility gaps (ARIA labels, contrast, keyboard navigation)
4. Data completeness (missing state info, broken links, schema compliance)
5. Conversion optimization (CTA placement, gate flow, Stripe upsell)

OUTPUT FORMAT: You MUST output valid JSON and nothing else. The JSON must be an array of improvement objects:
[
  {
    "id": "imp-001",
    "title": "Short title",
    "category": "ux|performance|accessibility|data|conversion",
    "priority": "high|medium|low",
    "description": "What to change and why",
    "files": ["index.html"],
    "implementation_notes": "Specific guidance for the code agent",
    "estimated_impact": "Brief description of expected user impact"
  }
]

CONSTRAINTS:
- Max ${PIPELINE_CONFIG.maxImprovementsPerCycle} improvements per cycle
- Never propose changes to: ${PIPELINE_CONFIG.protectedFiles.join(", ")}
- Each improvement must be implementable in a single focused change
- Prefer small, safe, reversible changes over large rewrites
- Focus on the highest-impact changes first`;

export async function runDesignAgent({ cwd, logger }) {
  logger.info("DESIGN", "Starting design analysis...");

  let result = null;

  for await (const message of query({
    prompt: `Analyze the Aurigen Directory codebase in the current directory. Read the key files (index.html, states-en.js, states-es.js) and propose improvements.

Focus on what would have the MOST impact for tax lien/deed investors using this tool. Consider both the English and Spanish experiences.

Return ONLY a JSON array of improvement proposals. No markdown, no explanation — just the JSON array.`,
    options: {
      cwd,
      allowedTools: ["Read", "Glob", "Grep"],
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
    logger.error("DESIGN", "No result returned from design agent");
    return [];
  }

  // Extract JSON from the result (handle markdown code fences if present)
  let jsonStr = result.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  try {
    const improvements = JSON.parse(jsonStr);
    if (!Array.isArray(improvements)) {
      throw new Error("Expected array of improvements");
    }
    logger.success("DESIGN", `Proposed ${improvements.length} improvements`);
    for (const imp of improvements) {
      logger.info("DESIGN", `  [${imp.priority}] ${imp.title}`, {
        category: imp.category,
        files: imp.files,
      });
    }
    return improvements;
  } catch (err) {
    logger.error("DESIGN", `Failed to parse improvements: ${err.message}`);
    logger.error("DESIGN", `Raw output (first 500 chars): ${result.slice(0, 500)}`);
    return [];
  }
}
