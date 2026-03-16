#!/usr/bin/env bash
# Test the Life Hub agent-bridge webhook on n8n.
# Usage:
#   export LIFE_HUB_BRIDGE_TOKEN='your-real-token'
#   bash scripts/test-webhook-bridge.sh

set -euo pipefail

: "${LIFE_HUB_BRIDGE_TOKEN:?Set LIFE_HUB_BRIDGE_TOKEN before running this script}"

WEBHOOK_URL="https://richardgentryn8n.app.n8n.cloud/webhook-test/life-hub/agent-bridge"

curl -i -X POST "$WEBHOOK_URL" \
  -H "Authorization: Bearer $LIFE_HUB_BRIDGE_TOKEN" \
  -H 'Content-Type: application/json' \
  -H "X-LifeHub-Timestamp: $(date -u +%FT%TZ)" \
  -H 'X-Request-Id: test-001' \
  -H 'X-Idempotency-Key: test-001' \
  -d '{
    "version": "2026-03-16",
    "source": { "agent": "codex", "channel": "manual-test", "user": "Richard" },
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
      "request_id": "test-001",
      "idempotency_key": "test-001",
      "correlation_id": "manual-test-001"
    }
  }'
