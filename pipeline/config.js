// pipeline/config.js — Shared configuration for the Aurigen agentic pipeline

export const PIPELINE_CONFIG = {
  // How often the pipeline runs (in ms). Default: every 6 hours.
  intervalMs: 6 * 60 * 60 * 1000,

  // Max improvements per cycle
  maxImprovementsPerCycle: 3,

  // Project root (relative to pipeline dir)
  projectRoot: "..",

  // Files the agents can read/modify
  targetFiles: ["index.html", "states-en.js", "states-es.js"],

  // Files agents must NEVER touch
  protectedFiles: ["netlify.toml", "package.json", "netlify/functions/aurigen.js"],

  // Model to use for all agents
  model: "claude-opus-4-6",

  // Max turns per agent invocation
  maxTurns: 30,

  // Budget cap per full pipeline cycle (USD)
  maxBudgetPerCycle: 2.0,

  // Git branch for pipeline changes
  branch: "claude/reorganize-repo-structure-wth2a",

  // Log file
  logFile: "pipeline/pipeline.log",
};

// Design identity constraints (from CLAUDE.md)
export const DESIGN_RULES = {
  backgrounds: "#0d0d0d near-black",
  accent: "gold",
  text: "off-white",
  headlineFont: "Bebas Neue",
  bodyFont: "DM Sans",
  style: "dark cinematic, glass morphism, motion on load",
  forbidden: ["white backgrounds", "flat design", "generic layouts"],
};

// Architecture rules the QA agent checks
export const ARCHITECTURE_RULES = [
  "Every flex ancestor of a scroll container must have min-height:0",
  "Never use max-height on tab or list content",
  "Never use overflow:hidden on any ancestor of scrollable content",
  "Map must call invalidateSize() after any layout change",
  "localStorage calls always wrapped in null-safe try/catch",
  "Language toggle persists via localStorage key: 'aurigen_lang'",
  "Z-index gate fix: .gate-glow must be position:absolute, z-index:0, pointer-events:none !important",
  "Never use window.self / window.top / btoa() unsafely in iframe contexts",
];

export const FREE_STATES = ["FL", "IL", "IA", "NJ", "GA", "AZ", "TX"];
