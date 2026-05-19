# Notion Digest Worker — Cloudflare Workers

A scheduled Cloudflare Worker that automatically creates a weekly digest page in Notion by querying a task database for completed items. Runs on a cron schedule — no server required.

## What it does

Every Friday at 5 pm UTC (configurable), the Worker:

1. Queries your task database for items with `Status = Done`
2. Creates a new Notion page titled `Weekly Digest — YYYY-MM-DD → YYYY-MM-DD`
3. Lists all completed items as bullet points under a "✅ Completed this week" heading

You can also trigger it manually with `POST /run`.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier — cron triggers are free)
- A [Notion integration](https://www.notion.com/my-integrations) with access to your database and parent page
- A Notion task database with a `Status` property (select or status type)
- A Notion page where digest pages will be created

## Setup

```bash
npm install

npx wrangler secret put NOTION_KEY          # integration secret (secret_…)
npx wrangler secret put SOURCE_DATABASE_ID  # ID of your task database
npx wrangler secret put DIGEST_PAGE_ID      # ID of page to put digests under
```

### If your database uses different property names

Edit `wrangler.toml` and uncomment the `[vars]` section:

```toml
[vars]
STATUS_PROPERTY = "State"     # your status property name
DONE_VALUE      = "Complete"  # the value that means "done"
```

### Change the schedule

Edit the `crons` line in `wrangler.toml`:

```toml
[triggers]
crons = ["0 9 * * 1"]   # Every Monday at 9 am UTC
```

Use [crontab.guru](https://crontab.guru) to build cron expressions.

## Development

```bash
npm run dev
# Worker runs at http://localhost:8787

# Trigger a digest manually
curl -X POST http://localhost:8787/run
```

## Deploy

```bash
npm run deploy
```

After deployment, Cloudflare runs the Worker automatically on the configured schedule. You can also trigger it any time with:

```bash
curl -X POST https://notion-digest-worker.<your-subdomain>.workers.dev/run
```

## Digest page format

```
Weekly Digest — 2024-11-04 → 2024-11-11
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  Completed this week (5)
  • Ship webhook logger example
  • Fix TypeScript 6 deprecations
  • Write Python intro examples
  • Update examples README
  • Add skill evaluations
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated automatically by notion-digest-worker
```
