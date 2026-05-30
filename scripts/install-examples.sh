#!/usr/bin/env bash
# Install dependencies for all JavaScript and workers examples

set -e

CYAN=$'\033[36m'
RESET=$'\033[0m'

for dir in examples/javascript/*/; do
  if [ -f "$dir/package.json" ]; then
    printf '%sInstalling %s...%s\n' "$CYAN" "$dir" "$RESET"
    (cd "$dir" && npm install)
  fi
done

for dir in examples/workers/tools/*/; do
  if [ -f "$dir/package.json" ]; then
    printf '%sInstalling %s...%s\n' "$CYAN" "$dir" "$RESET"
    (cd "$dir" && npm install)
  fi
done

