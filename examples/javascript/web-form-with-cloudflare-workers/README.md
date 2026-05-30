# Notion API demo — Cloudflare Workers

An interactive step-by-step demo of the Notion API running on [Cloudflare Workers](https://workers.cloudflare.com/). No servers to manage — deploy in under a minute and get a permanent public URL.

The same four-step flow as the Express example, but running at the edge:

1. Create a Notion database
2. Add a page to it
3. Append a content block
4. Leave a comment

IDs are automatically carried forward between steps so you never need to copy-paste.

## Prerequisites

- A [Notion integration](https://www.notion.com/my-integrations) with a secret key
- A Notion page shared with your integration (copy its ID from the URL)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is enough)
- Node.js ≥ 18

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Add your Notion credentials as Worker secrets
npx wrangler secret put NOTION_KEY       # paste your integration secret
npx wrangler secret put NOTION_PAGE_ID   # paste the parent page ID
```

## Development

```bash
npm run dev
# → http://localhost:8787
```

## Deploy

```bash
npm run deploy
# → https://notion-api-demo.<your-subdomain>.workers.dev
```

That's it — your demo is live at a permanent public URL.

## How it works

The worker uses [Hono](https://hono.dev/) for routing and calls the Notion REST API directly using the Worker's native `fetch`. No Node.js runtime is required; the entire app — HTML, CSS, JS, and API logic — ships as a single Worker script.

| Route        | Method | Description                         |
| ------------ | ------ | ----------------------------------- |
| `/`          | GET    | Serves the interactive HTML UI      |
| `/databases` | POST   | Creates a new Notion database       |
| `/pages`     | POST   | Adds a page to a database           |
| `/blocks`    | POST   | Appends a paragraph block to a page |
| `/comments`  | POST   | Adds a comment to a page            |

## Environment variables

Set these as [Worker secrets](https://developers.cloudflare.com/workers/configuration/secrets/), not plaintext vars:

| Name             | Description                                  |
| ---------------- | -------------------------------------------- |
| `NOTION_KEY`     | Notion integration secret (`secret_…`)       |
| `NOTION_PAGE_ID` | ID of the Notion page to create databases in |
