#!/usr/bin/env bash
# Aurigen Pipeline — One-time setup script
# Run this once to install dependencies and validate your environment.
#
# Usage: ./pipeline/setup.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
warn() { echo -e "  ${YELLOW}!${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   AURIGEN PIPELINE — SETUP                  ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

ERRORS=0

# ── Node.js ──
echo "Checking Node.js..."
if command -v node &>/dev/null; then
  NODE_V=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_V" -ge 18 ]; then
    ok "Node.js $(node -v)"
  else
    fail "Node.js $(node -v) — need 18+"
    ERRORS=$((ERRORS+1))
  fi
else
  fail "Node.js not found"
  ERRORS=$((ERRORS+1))
fi

# ── Git ──
echo "Checking git..."
if command -v git &>/dev/null; then
  ok "git $(git --version | awk '{print $3}')"
else
  fail "git not found"
  ERRORS=$((ERRORS+1))
fi

# ── API Key ──
echo "Checking environment..."
if [ -n "${ANTHROPIC_API_KEY:-}" ]; then
  ok "ANTHROPIC_API_KEY is set"
elif [ -f "$PROJECT_ROOT/.env" ]; then
  if grep -q "ANTHROPIC_API_KEY=sk-ant-" "$PROJECT_ROOT/.env"; then
    ok "ANTHROPIC_API_KEY found in .env"
  else
    warn ".env exists but ANTHROPIC_API_KEY not configured"
    warn "Edit .env and add your key"
  fi
else
  warn "ANTHROPIC_API_KEY not set and no .env file found"
  warn "Run: cp pipeline/.env.example .env && edit .env"
fi

# ── Install dependencies ──
echo "Installing dependencies..."
cd "$PROJECT_ROOT"

npm install 2>/dev/null && ok "npm dependencies installed" || { fail "npm install failed"; ERRORS=$((ERRORS+1)); }

# Install Agent SDK if not present
if node -e "require.resolve('@anthropic-ai/claude-agent-sdk')" 2>/dev/null; then
  ok "@anthropic-ai/claude-agent-sdk already installed"
else
  echo "  Installing @anthropic-ai/claude-agent-sdk..."
  npm install @anthropic-ai/claude-agent-sdk 2>/dev/null && \
    ok "@anthropic-ai/claude-agent-sdk installed" || \
    { fail "Failed to install agent SDK"; ERRORS=$((ERRORS+1)); }
fi

# ── Create directories ──
echo "Setting up directories..."
mkdir -p pipeline/reports pipeline/logs
ok "pipeline/reports/ and pipeline/logs/ created"

# ── Git config check ──
echo "Checking git config..."
if git config user.name &>/dev/null && git config user.email &>/dev/null; then
  ok "git user: $(git config user.name) <$(git config user.email)>"
else
  warn "No git user configured — pipeline commits need a git identity"
  warn "Run: git config user.name 'Your Name' && git config user.email 'you@example.com'"
fi

# ── Summary ──
echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo -e "${GREEN}Setup complete!${NC} You're ready to run the pipeline."
  echo ""
  echo "  Quick start:"
  echo "    ./pipeline/run.sh --dry-run    # Test design analysis only"
  echo "    ./pipeline/run.sh              # Run one full cycle"
  echo "    ./pipeline/run.sh --loop       # Run continuously (every 6h)"
  echo ""
  echo "  Deploy options:"
  echo "    pm2 start pipeline/ecosystem.config.cjs     # PM2 (recommended)"
  echo "    docker build -f pipeline/Dockerfile -t aurigen-pipeline .  # Docker"
  echo "    sudo cp pipeline/aurigen-pipeline.service /etc/systemd/system/  # systemd"
else
  echo -e "${RED}Setup found $ERRORS error(s).${NC} Fix them before running the pipeline."
fi
