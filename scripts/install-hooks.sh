#!/usr/bin/env bash
# One-time setup so git picks up the committed hooks in .githooks/.
# Idempotent — safe to re-run.

set -euo pipefail

REPO_ROOT="$(git -C "$(dirname "$0")/.." rev-parse --show-toplevel)"

git -C "$REPO_ROOT" config --local core.hooksPath .githooks
chmod +x "$REPO_ROOT"/.githooks/*

echo "✅  Git hooks installed at $REPO_ROOT/.githooks"
echo "   → Lint will run automatically on every commit."
