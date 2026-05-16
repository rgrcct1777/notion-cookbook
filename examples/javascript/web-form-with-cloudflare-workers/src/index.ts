import { Hono } from "hono"
import { buildHtml, css, js } from "./html"

export interface Env {
  NOTION_KEY: string
  NOTION_PAGE_ID: string
}

const NOTION_VERSION = "2022-06-28"
const NOTION_BASE = "https://api.notion.com/v1"

// Typed wrappers around the Notion REST API using the Worker's native fetch
async function notionFetch(
  env: Env,
  path: string,
  options: { method?: string; body?: unknown } = {}
) {
  const res = await fetch(`${NOTION_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${env.NOTION_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    ...(options.body !== undefined
      ? { body: JSON.stringify(options.body) }
      : {}),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Notion API error ${res.status}`)
  }
  return data as Record<string, unknown>
}

const app = new Hono<{ Bindings: Env }>()

// ── Serve HTML ──────────────────────────────────────────────────────────────

app.get("/", (c) => {
  return c.html(buildHtml(css, js))
})

// ── Create database ─────────────────────────────────────────────────────────

app.post("/databases", async (c) => {
  const { dbName } = await c.req.json<{ dbName?: string }>()

  if (!dbName?.trim()) {
    return c.json({ message: "error", error: { message: "Database name is required" } }, 400)
  }
  if (!c.env.NOTION_PAGE_ID) {
    return c.json({ message: "error", error: { message: "NOTION_PAGE_ID secret is not set" } }, 500)
  }

  try {
    const db = await notionFetch(c.env, "/databases", {
      method: "POST",
      body: {
        parent: { type: "page_id", page_id: c.env.NOTION_PAGE_ID },
        title: [{ type: "text", text: { content: dbName.trim() } }],
        initial_data_source: { properties: { Name: { title: {} } } },
      },
    })

    const dataSources = db.data_sources as Array<{ id: string }> | undefined
    const dataSourceId = dataSources?.[0]?.id ?? ""
    return c.json({ message: "success!", data: { ...db, dataSourceId } })
  } catch (err: unknown) {
    return c.json({ message: "error", error: { message: (err as Error).message } }, 500)
  }
})

// ── Create page ─────────────────────────────────────────────────────────────

app.post("/pages", async (c) => {
  const { dbID, pageName, header } = await c.req.json<{
    dbID?: string
    pageName?: string
    header?: string
  }>()

  if (!dbID?.trim() || !pageName?.trim()) {
    return c.json(
      { message: "error", error: { message: "Data Source ID and page name are required" } },
      400
    )
  }

  try {
    const page = await notionFetch(c.env, "/pages", {
      method: "POST",
      body: {
        parent: { type: "data_source_id", data_source_id: dbID.trim() },
        properties: {
          Name: { title: [{ text: { content: pageName.trim() } }] },
        },
        ...(header?.trim()
          ? {
              children: [
                {
                  object: "block",
                  heading_2: {
                    rich_text: [{ text: { content: header.trim() } }],
                  },
                },
              ],
            }
          : {}),
      },
    })
    return c.json({ message: "success!", data: page })
  } catch (err: unknown) {
    return c.json({ message: "error", error: { message: (err as Error).message } }, 500)
  }
})

// ── Append block ────────────────────────────────────────────────────────────

app.post("/blocks", async (c) => {
  const { pageID, content } = await c.req.json<{
    pageID?: string
    content?: string
  }>()

  if (!pageID?.trim() || !content?.trim()) {
    return c.json(
      { message: "error", error: { message: "Page ID and content are required" } },
      400
    )
  }

  try {
    const block = await notionFetch(c.env, `/blocks/${pageID.trim()}/children`, {
      method: "PATCH",
      body: {
        children: [
          {
            paragraph: {
              rich_text: [{ text: { content: content.trim() } }],
            },
          },
        ],
      },
    })
    return c.json({ message: "success!", data: block })
  } catch (err: unknown) {
    return c.json({ message: "error", error: { message: (err as Error).message } }, 500)
  }
})

// ── Create comment ──────────────────────────────────────────────────────────

app.post("/comments", async (c) => {
  const { pageID, comment } = await c.req.json<{
    pageID?: string
    comment?: string
  }>()

  if (!pageID?.trim() || !comment?.trim()) {
    return c.json(
      { message: "error", error: { message: "Page ID and comment are required" } },
      400
    )
  }

  try {
    const newComment = await notionFetch(c.env, "/comments", {
      method: "POST",
      body: {
        parent: { page_id: pageID.trim() },
        rich_text: [{ text: { content: comment.trim() } }],
      },
    })
    return c.json({ message: "success!", data: newComment })
  } catch (err: unknown) {
    return c.json({ message: "error", error: { message: (err as Error).message } }, 500)
  }
})

export default app
