# notion-comments

List and add comments on Notion pages using the [Notion Comments API](https://developers.notion.com/reference/retrieve-a-comment).

## Prerequisites

- A [Notion integration](https://www.notion.com/my-integrations) with **Read comments** and **Insert comments** capabilities
- The integration connected to the page you want to work with
- Node.js 20+

## Setup

1. Copy the environment file and fill in your values:

   ```bash
   cp example.env .env
   ```

2. Set the following variables in `.env`:

   | Variable         | Description                                            |
   | ---------------- | ------------------------------------------------------ |
   | `NOTION_API_KEY` | Your integration's secret token                        |
   | `NOTION_PAGE_ID` | ID of the Notion page to read/write comments on        |
   | `COMMENT_TEXT`   | Text for the comment added by `npm run add` (optional) |

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

**List all comments on the page:**

```bash
npm run list
```

**Add a new comment to the page:**

```bash
npm run add
```

## Finding your page ID

Open the page in Notion and copy the URL. The page ID is the 32-character string at the end:

```
https://www.notion.so/My-Page-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

Strip any hyphens if present.
