#!/usr/bin/env bash
#
# Stage all changes, commit, and push to origin/main.
#
# Usage:
#   bash ./tools/commit_push_main.sh "your commit message"

set -euo pipefail

help() {
  echo "Usage:"
  echo "  bash ./tools/commit_push_main.sh \"your commit message\""
  echo
  echo "Example:"
  echo "  bash ./tools/commit_push_main.sh \"content: update graph tag navigation\""
}

if [[ ${1:-} == "-h" || ${1:-} == "--help" ]]; then
  help
  exit 0
fi

COMMIT_MSG=${1:-}
if [[ -z "$COMMIT_MSG" ]]; then
  echo "Error: commit message is required."
  echo
  help
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: not inside a git repository."
  exit 1
fi

CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
  echo "Error: current branch is '$CURRENT_BRANCH'. Switch to 'main' first."
  echo "Hint: git checkout main"
  exit 1
fi

echo "[1/4] Staging changes..."
git add -A

if git diff --cached --quiet; then
  echo "No staged changes to commit."
  exit 0
fi

echo "[2/4] Committing..."
git commit -m "$COMMIT_MSG"

echo "[3/4] Pushing to origin/main..."
git push origin main

echo "[4/4] Done ✅"
echo "Committed and pushed to origin/main successfully."
