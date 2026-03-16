#!/usr/bin/env bash
# Aurigen Agentic Pipeline Runner
#
# Usage:
#   ./pipeline/run.sh              # Single cycle
#   ./pipeline/run.sh --loop       # Continuous (every 6 hours)
#   ./pipeline/run.sh --dry-run    # Design analysis only (no code changes)
#
# Requirements:
#   - Node.js 18+
#   - ANTHROPIC_API_KEY environment variable
#   - @anthropic-ai/claude-agent-sdk installed globally or locally

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Check for API key
if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
  echo "ERROR: ANTHROPIC_API_KEY environment variable is required"
  echo "  export ANTHROPIC_API_KEY=sk-ant-..."
  exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required (found v$(node -v))"
  exit 1
fi

echo "╔══════════════════════════════════════════════╗"
echo "║   AURIGEN AGENTIC PIPELINE                  ║"
echo "║   Design → Code → QA → Ship                 ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

cd "$PROJECT_ROOT"
exec node pipeline/orchestrator.js "$@"
