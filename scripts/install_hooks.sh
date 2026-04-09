#!/bin/bash
set -e
HWD=$(pwd)
HOOKDIR="$HWD/.githooks"
GITHOOKS="$HWD/.git/hooks"
if [ ! -d "$GITHOOKS" ]; then
  echo ".git/hooks not found" >&2
  exit 1
fi
for hook in pre-commit pre-push; do
  if [ -f "$HOOKDIR/$hook" ]; then
    cp "$HOOKDIR/$hook" "$GITHOOKS/$hook"
    chmod +x "$GITHOOKS/$hook"
    echo "Installed $hook"
  fi
done
echo "Hooks installed."
