#!/usr/bin/env node
// pipeline/orchestrator.js
// Main orchestrator for the Aurigen agentic pipeline.
//
// Flow:
//   1. Design Agent analyzes codebase → proposes improvements
//   2. For each improvement (by priority):
//      a. Code Agent implements the change
//      b. QA Agent reviews the change
//      c. If QA approves → git commit
//      d. If QA rejects → git revert changes
//   3. Push all approved changes
//   4. Log full cycle report
//
// Usage:
//   node pipeline/orchestrator.js              # Run once
//   node pipeline/orchestrator.js --loop       # Run continuously
//   node pipeline/orchestrator.js --dry-run    # Design only (no code changes)

import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, writeFileSync, readFileSync } from "fs";

import { runDesignAgent } from "./agents/design-agent.js";
import { runCodeAgent } from "./agents/code-agent.js";
import { runQAAgent } from "./agents/qa-agent.js";
import { PIPELINE_CONFIG } from "./config.js";
import { createLogger } from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, PIPELINE_CONFIG.projectRoot);
const LOG_FILE = resolve(PROJECT_ROOT, PIPELINE_CONFIG.logFile);

const logger = createLogger(LOG_FILE);

// ─── Helpers ──────────────────────────────────────────────

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: PROJECT_ROOT, encoding: "utf-8" }).trim();
}

function hasUncommittedChanges() {
  const status = git("status --porcelain");
  return status.length > 0;
}

function revertUncommittedChanges() {
  git("checkout -- .");
  git("clean -fd");
}

function commitChanges(message) {
  git("add index.html states-en.js states-es.js");
  git(`commit -m "${message.replace(/"/g, '\\"')}"`);
}

function pushChanges() {
  const branch = PIPELINE_CONFIG.branch;
  try {
    git(`push -u origin ${branch}`);
    return true;
  } catch (err) {
    // Retry with exponential backoff
    const delays = [2000, 4000, 8000, 16000];
    for (const delay of delays) {
      logger.warn("ORCHESTRATOR", `Push failed, retrying in ${delay / 1000}s...`);
      execSync(`sleep ${delay / 1000}`);
      try {
        git(`push -u origin ${branch}`);
        return true;
      } catch {
        continue;
      }
    }
    return false;
  }
}

// ─── Main Pipeline Cycle ──────────────────────────────────

async function runCycle() {
  const cycleId = `cycle-${Date.now()}`;
  const startTime = Date.now();

  logger.divider();
  logger.info("ORCHESTRATOR", `Starting pipeline cycle: ${cycleId}`);
  logger.info("ORCHESTRATOR", `Project root: ${PROJECT_ROOT}`);

  // Ensure clean state
  if (hasUncommittedChanges()) {
    logger.warn("ORCHESTRATOR", "Found uncommitted changes — stashing before cycle");
    git("stash");
  }

  const report = {
    cycleId,
    startedAt: new Date().toISOString(),
    improvements: [],
    approved: 0,
    rejected: 0,
    errors: 0,
  };

  // ── Phase 1: Design Agent ──
  logger.divider();
  logger.info("ORCHESTRATOR", "Phase 1: Design Agent — analyzing codebase");

  let improvements;
  try {
    improvements = await runDesignAgent({ cwd: PROJECT_ROOT, logger });
  } catch (err) {
    logger.error("ORCHESTRATOR", `Design agent failed: ${err.message}`);
    report.errors++;
    writeCycleReport(report);
    return report;
  }

  if (!improvements.length) {
    logger.info("ORCHESTRATOR", "No improvements proposed — cycle complete");
    writeCycleReport(report);
    return report;
  }

  // Sort by priority: high > medium > low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  improvements.sort(
    (a, b) => (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
  );

  const isDryRun = process.argv.includes("--dry-run");
  if (isDryRun) {
    logger.info("ORCHESTRATOR", "DRY RUN — skipping implementation and QA");
    for (const imp of improvements) {
      report.improvements.push({
        id: imp.id,
        title: imp.title,
        status: "proposed",
        category: imp.category,
        priority: imp.priority,
      });
    }
    writeCycleReport(report);
    return report;
  }

  // ── Phase 2 & 3: Code + QA per improvement ──
  for (const imp of improvements) {
    logger.divider();
    logger.info("ORCHESTRATOR", `Phase 2: Code Agent — implementing "${imp.title}"`);

    let codeResult;
    try {
      codeResult = await runCodeAgent({ cwd: PROJECT_ROOT, improvement: imp, logger });
    } catch (err) {
      logger.error("ORCHESTRATOR", `Code agent failed for "${imp.title}": ${err.message}`);
      if (hasUncommittedChanges()) revertUncommittedChanges();
      report.errors++;
      report.improvements.push({ id: imp.id, title: imp.title, status: "error", error: err.message });
      continue;
    }

    if (!codeResult.implemented) {
      logger.warn("ORCHESTRATOR", `Code agent did not implement "${imp.title}"`);
      report.improvements.push({ id: imp.id, title: imp.title, status: "not_implemented" });
      continue;
    }

    // ── Phase 3: QA Agent ──
    logger.info("ORCHESTRATOR", `Phase 3: QA Agent — reviewing "${imp.title}"`);

    let qaResult;
    try {
      qaResult = await runQAAgent({ cwd: PROJECT_ROOT, improvement: imp, codeResult, logger });
    } catch (err) {
      logger.error("ORCHESTRATOR", `QA agent failed for "${imp.title}": ${err.message}`);
      if (hasUncommittedChanges()) revertUncommittedChanges();
      report.errors++;
      report.improvements.push({ id: imp.id, title: imp.title, status: "qa_error", error: err.message });
      continue;
    }

    if (qaResult.approved) {
      logger.success("ORCHESTRATOR", `QA APPROVED: "${imp.title}" — committing`);
      try {
        commitChanges(`[pipeline] ${imp.title}\n\nCategory: ${imp.category}\nPriority: ${imp.priority}\nAutomated by Aurigen Pipeline`);
        report.approved++;
        report.improvements.push({ id: imp.id, title: imp.title, status: "approved", changes: codeResult.changes });
      } catch (err) {
        logger.error("ORCHESTRATOR", `Commit failed: ${err.message}`);
        if (hasUncommittedChanges()) revertUncommittedChanges();
        report.errors++;
        report.improvements.push({ id: imp.id, title: imp.title, status: "commit_error", error: err.message });
      }
    } else {
      logger.warn("ORCHESTRATOR", `QA REJECTED: "${imp.title}" — reverting`);
      if (hasUncommittedChanges()) revertUncommittedChanges();
      report.rejected++;
      report.improvements.push({
        id: imp.id,
        title: imp.title,
        status: "rejected",
        issues: qaResult.issues,
      });
    }
  }

  // ── Phase 4: Push ──
  if (report.approved > 0) {
    logger.divider();
    logger.info("ORCHESTRATOR", `Phase 4: Pushing ${report.approved} approved changes`);
    const pushed = pushChanges();
    if (pushed) {
      logger.success("ORCHESTRATOR", "Push successful");
    } else {
      logger.error("ORCHESTRATOR", "Push failed after retries");
    }
  }

  // ── Report ──
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  report.completedAt = new Date().toISOString();
  report.elapsedSeconds = parseFloat(elapsed);

  logger.divider();
  logger.info("ORCHESTRATOR", `Cycle complete in ${elapsed}s`);
  logger.info("ORCHESTRATOR", `  Approved: ${report.approved} | Rejected: ${report.rejected} | Errors: ${report.errors}`);

  writeCycleReport(report);
  return report;
}

function writeCycleReport(report) {
  const reportPath = resolve(PROJECT_ROOT, `pipeline/reports/${report.cycleId}.json`);
  const reportsDir = dirname(reportPath);
  execSync(`mkdir -p ${reportsDir}`);
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  logger.info("ORCHESTRATOR", `Report saved: ${reportPath}`);
}

// ─── Entry Point ──────────────────────────────────────────

async function main() {
  const isLoop = process.argv.includes("--loop");

  logger.info("SYSTEM", "Aurigen Agentic Pipeline v1.0");
  logger.info("SYSTEM", `Mode: ${isLoop ? "continuous loop" : process.argv.includes("--dry-run") ? "dry run" : "single run"}`);
  logger.info("SYSTEM", `Model: ${PIPELINE_CONFIG.model}`);
  logger.info("SYSTEM", `Branch: ${PIPELINE_CONFIG.branch}`);

  if (isLoop) {
    while (true) {
      try {
        await runCycle();
      } catch (err) {
        logger.error("SYSTEM", `Unhandled cycle error: ${err.message}`);
      }
      const hours = PIPELINE_CONFIG.intervalMs / (60 * 60 * 1000);
      logger.info("SYSTEM", `Next cycle in ${hours} hours...`);
      await new Promise((r) => setTimeout(r, PIPELINE_CONFIG.intervalMs));
    }
  } else {
    const report = await runCycle();
    process.exit(report.errors > 0 ? 1 : 0);
  }
}

main().catch((err) => {
  logger.error("SYSTEM", `Fatal: ${err.message}`);
  process.exit(1);
});
