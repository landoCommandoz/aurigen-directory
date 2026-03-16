// pipeline/logger.js — Simple structured logger for pipeline runs

import { appendFileSync, mkdirSync } from "fs";
import { dirname } from "path";

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

const AGENT_COLORS = {
  ORCHESTRATOR: COLORS.cyan,
  DESIGN: COLORS.magenta,
  CODE: COLORS.green,
  QA: COLORS.yellow,
  SYSTEM: COLORS.dim,
};

export function createLogger(logFile) {
  mkdirSync(dirname(logFile), { recursive: true });

  function log(agent, level, message, data) {
    const ts = new Date().toISOString();
    const color = AGENT_COLORS[agent] || COLORS.reset;
    const levelColor =
      level === "ERROR" ? COLORS.red : level === "WARN" ? COLORS.yellow : "";

    // Console output (colored)
    const prefix = `${COLORS.dim}[${ts}]${COLORS.reset} ${color}[${agent}]${COLORS.reset}`;
    const levelTag = levelColor ? `${levelColor}${level}${COLORS.reset} ` : "";
    console.log(`${prefix} ${levelTag}${message}`);
    if (data) console.log(`${COLORS.dim}  └─ ${JSON.stringify(data)}${COLORS.reset}`);

    // File output (plain text)
    const line = `[${ts}] [${agent}] ${level}: ${message}${data ? " | " + JSON.stringify(data) : ""}\n`;
    try {
      appendFileSync(logFile, line);
    } catch {
      // Non-critical — don't crash if log write fails
    }
  }

  return {
    info: (agent, msg, data) => log(agent, "INFO", msg, data),
    warn: (agent, msg, data) => log(agent, "WARN", msg, data),
    error: (agent, msg, data) => log(agent, "ERROR", msg, data),
    success: (agent, msg, data) => log(agent, "OK", msg, data),
    divider: () =>
      console.log(`${COLORS.dim}${"─".repeat(70)}${COLORS.reset}`),
  };
}
