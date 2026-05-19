# Notion Webhook Logger — Cloudflare Workers

A Cloudflare Worker that receives webhooks from any HTTP service (GitHub, Stripe, Linear, etc.) and logs each event as a row in a Notion database. Deploy once, get a permanent public URL, and every POST becomes a searchable Notion record.

## What gets logged

Each webhook creates a Notion database row with:

| Property | Value |
|---|---|
| **Name** | Auto-derived title (e.g. `github/push: opened on org/repo`) |
| **Source** | Service name inferred from request headers |
| **Received** | Timestamp of the incoming request |
| **Status** | `New` (update to `Reviewed` once actioned) |
| **Body** | Full JSON payload as a code block |

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier)
- A [Notion integration](https://www.notion.com/my-integrations) with a secret key
- A Notion database shared with your integration

## Notion database schema

Create a database with these properties (names must match exactly):

| Property name | Type |
|---|---|
| Name | Title |
| Source | Text |
| Received | Date |
| Status | Select (options: `New`, `Reviewed`) |

## Setup

```bash
npm install

# Add secrets
npx wrangler secret put NOTION_KEY          # your integration secret
npx wrangler secret put NOTION_DATABASE_ID  # ID of the database above
```

## Development

```bash
npm run dev
# → http://localhost:8787

# Test locally
curl -X POST http://localhost:8787/webhook \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: push" \
  -d '{"action":"opened","repository":{"full_name":"org/repo"}}'
```

## Deploy

```bash
npm run deploy
# → https://notion-webhook-logger.<your-subdomain>.workers.dev
```

Point your webhook source (GitHub, Stripe, etc.) at:
```
https://notion-webhook-logger.<your-subdomain>.workers.dev/webhook
```

## How source detection works

The Worker inspects incoming headers to label the source:

| Header | Source label |
|---|---|
| `X-GitHub-Event: push` | `github/push` |
| `Stripe-Signature` | `stripe` |
| `X-Webhook-Source: linear` | `linear` |
| (none) | `unknown` |
