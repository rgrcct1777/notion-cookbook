#!/usr/bin/env bash
# Test the Life Hub agent-bridge webhook on n8n.
#
# Usage:
#   export LIFE_HUB_BRIDGE_TOKEN='your-real-token'
#   bash scripts/test-webhook-bridge.sh              # test mode (default)
#   bash scripts/test-webhook-bridge.sh --production # production webhook
#   bash scripts/test-webhook-bridge.sh --dry-run    # print request without sending

set -euo pipefail

CYAN=$'\033[36m'
GREEN=$'\033[32m'
RED=$'\033[31m'
YELLOW=$'\033[33m'
DIM=$'\033[2m'
RESET=$'\033[0m'

# --- Parse flags -----------------------------------------------------------
MODE="test"
DRY_RUN=false
for arg in "$@"; do
  case "$arg" in
    --production) MODE="production" ;;
    --dry-run)    DRY_RUN=true ;;
    -h|--help)
      sed -n '2,/^$/s/^# \?//p' "$0"
      exit 0
      ;;
    *)
      printf '%sUnknown flag: %s%s\n' "$RED" "$arg" "$RESET" >&2
      exit 1
      ;;
  esac
done

# --- Validate environment ---------------------------------------------------
: "${LIFE_HUB_BRIDGE_TOKEN:?Set LIFE_HUB_BRIDGE_TOKEN before running this script}"

# --- Webhook URL selection --------------------------------------------------
BASE_URL="https://richardgentryn8n.app.n8n.cloud"
if [ "$MODE" = "production" ]; then
  WEBHOOK_URL="${BASE_URL}/webhook/life-hub/agent-bridge"
else
  WEBHOOK_URL="${BASE_URL}/webhook-test/life-hub/agent-bridge"
fi

# --- Generate unique IDs per run --------------------------------------------
TIMESTAMP="$(date -u +%FT%TZ)"
REQUEST_ID="test-$(date +%s)-$$"
IDEMPOTENCY_KEY="$REQUEST_ID"

# --- Build JSON payload -----------------------------------------------------
PAYLOAD=$(cat <<JSON
{
  "version": "2026-03-16",
  "source": {
    "agent": "codex",
    "channel": "manual-test",
    "user": "Richard"
  },
  "action": "create_task",
  "target": {
    "database_id": "c2c398ce-b15b-4211-a4f2-33b778d1ada3",
    "data_source_id": "de206b02-c58f-49c3-9eb8-bf0a8c7413e7",
    "page_id": null
  },
  "task": {
    "title": "Test Life Hub bridge",
    "status": "Inbox",
    "priority": "P2",
    "assigned_agent": "Richard",
    "due_at": null,
    "properties": {}
  },
  "comment": { "body": null },
  "approval": {
    "approval_required": false,
    "approval_status": "not_required",
    "reason": null
  },
  "meta": {
    "request_id": "${REQUEST_ID}",
    "idempotency_key": "${IDEMPOTENCY_KEY}",
    "correlation_id": "manual-test-001"
  }
}
JSON
)

# --- Dry-run mode: print and exit -------------------------------------------
if [ "$DRY_RUN" = true ]; then
  printf '%s--- Dry run (no request sent) ---%s\n' "$YELLOW" "$RESET"
  printf '%sPOST %s%s\n' "$CYAN" "$WEBHOOK_URL" "$RESET"
  printf '%sX-LifeHub-Timestamp: %s%s\n' "$DIM" "$TIMESTAMP" "$RESET"
  printf '%sX-Request-Id:        %s%s\n' "$DIM" "$REQUEST_ID" "$RESET"
  printf '%sX-Idempotency-Key:   %s%s\n\n' "$DIM" "$IDEMPOTENCY_KEY" "$RESET"
  echo "$PAYLOAD"
  exit 0
fi

# --- Send request -----------------------------------------------------------
printf '%sPOST %s%s\n' "$CYAN" "$WEBHOOK_URL" "$RESET"
printf '%sRequest-Id: %s%s\n' "$DIM" "$REQUEST_ID" "$RESET"
printf '%sTimestamp:  %s%s\n\n' "$DIM" "$TIMESTAMP" "$RESET"

HTTP_RESPONSE=$(mktemp)
HTTP_CODE=$(curl -s -o "$HTTP_RESPONSE" -w '%{http_code}' \
  -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $LIFE_HUB_BRIDGE_TOKEN" \
  -H 'Content-Type: application/json' \
  -H "X-LifeHub-Timestamp: $TIMESTAMP" \
  -H "X-Request-Id: $REQUEST_ID" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d "$PAYLOAD") || true

BODY=$(cat "$HTTP_RESPONSE")
rm -f "$HTTP_RESPONSE"

# --- Evaluate response ------------------------------------------------------
printf 'HTTP %s ' "$HTTP_CODE"

if [ "$HTTP_CODE" -ge 200 ] 2>/dev/null && [ "$HTTP_CODE" -lt 300 ]; then
  printf '%s✔ Success%s\n' "$GREEN" "$RESET"
  if [ -n "$BODY" ]; then
    printf '\n%s\n' "$BODY"
  fi
  exit 0
elif [ "$HTTP_CODE" = "000" ]; then
  printf '%s✘ Connection failed%s\n' "$RED" "$RESET"
  printf 'Could not reach %s — check your network and that n8n is running.\n' "$WEBHOOK_URL" >&2
  exit 1
else
  printf '%s✘ Failed%s\n' "$RED" "$RESET"
  if [ -n "$BODY" ]; then
    printf '\n%s\n' "$BODY"
  fi
  exit 1
fi
