# JavaScript examples

Examples demonstrating how to use Notion's JavaScript SDK to build integrations.

## Prerequisites

- Node.js 18 or higher
- A [Notion integration](https://www.notion.com/my-integrations) with an API key
- A Notion page or database shared with your integration

## Available examples

### Getting started

**[intro-to-notion-api](intro-to-notion-api/)**: Start here if you're new to Notion's API. Includes basic and intermediate examples covering blocks, databases, pages, and file uploads.

### Integrations

- **[database-email-update](database-email-update/)**: Monitor a database for changes and send notifications
- **[generate-random-data](generate-random-data/)**: Populate databases with test data
- **[notion-github-sync](notion-github-sync/)**: Sync GitHub issues to Notion
- **[notion-task-github-pr-sync](notion-task-github-pr-sync/)**: Link Notion tasks with GitHub pull requests
- **[web-form-with-express](web-form-with-express/)**: Create a web form that writes to Notion
- **[web-form-with-cloudflare-workers](web-form-with-cloudflare-workers/)**: The same interactive demo deployed as a Cloudflare Worker — no servers, runs at the edge with a permanent public URL
- **[notion-webhook-logger-worker](notion-webhook-logger-worker/)**: Cloudflare Worker that receives webhooks from any HTTP service and logs each event as a Notion database row
- **[notion-digest-worker](notion-digest-worker/)**: Scheduled Cloudflare Worker that automatically creates weekly digest pages from a Notion task database

### Utilities

- **[parse-text-from-any-block-type](parse-text-from-any-block-type/)**: Extract text from various block types
- **[notion-comments](notion-comments/)**: List all comments on a page and add new ones using the Notion Comments API

## General setup

Most examples follow this pattern:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Configure environment**:
   Each example ships a template env file — copy it to `.env` and fill in your values.
   The exact filename varies by example (check the example's own README):

   ```bash
   cp example.env .env       # examples that use example.env
   cp .env.example .env      # examples that use .env.example
   ```

   Then edit `.env` to add your `NOTION_API_KEY` and any other required variables.

3. **Share your Notion page/database**:
   In Notion, click the `•••` menu on your page, select "Add connections", and choose your integration.

4. **Run the example**:
   ```bash
   npm start
   ```
   (or follow the specific instructions in the example's README)

## Resources

- [Notion API reference](https://developers.notion.com/reference)
- [JavaScript SDK documentation](https://github.com/makenotion/notion-sdk-js)
- [Getting started guide](https://developers.notion.com/docs/getting-started)
