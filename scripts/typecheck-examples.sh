#!/usr/bin/env bash
# Typecheck all JavaScript and workers examples

set -e

CYAN=$'\033[36m'
RESET=$'\033[0m'

for dir in examples/javascript/*/; do
  if [ -f "$dir/tsconfig.json" ]; then
    printf '%sTypechecking %s...%s\n' "$CYAN" "$dir" "$RESET"
    (cd "$dir" && npx tsc --noEmit) || exit 1
  fi
done

for dir in examples/workers/tools/*/; do
  if [ -f "$dir/tsconfig.json" ]; then
    printf '%sTypechecking %s...%s\n' "$CYAN" "$dir" "$RESET"
    (cd "$dir" && npx tsc --noEmit) || exit 1
  fi
done

