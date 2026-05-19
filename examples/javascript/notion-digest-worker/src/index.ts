export interface Env {
  NOTION_KEY: string
  SOURCE_DATABASE_ID: string
  DIGEST_PAGE_ID: string
  STATUS_PROPERTY?: string  // name of the status property (default: "Status")
  DONE_VALUE?: string       // value that means "complete" (default: "Done")
}

const NOTION_VERSION = "2022-06-28"
const NOTION_BASE = "https://api.notion.com/v1"

async function notionFetch(
  env: Env,
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<Record<string, unknown>> {
  const res = await fetch(`${NOTION_BASE}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Authorization: `Bearer ${env.NOTION_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Notion API error ${res.status}`)
  }
  return data as Record<string, unknown>
}

// ISO date string for N days ago
function daysAgo(n: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - n)
  return d.toISOString().slice(0, 10)
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

// Extract the plain-text title from a Notion page's properties
function pageTitle(page: Record<string, unknown>): string {
  const props = page.properties as Record<string, Record<string, unknown>> | undefined
  if (!props) return "Untitled"

  for (const key of ["Name", "Title", "Task", "title"]) {
    const prop = props[key]
    if (!prop) continue
    const items = prop.title as Array<{ plain_text: string }> | undefined
    if (items && items.length > 0) return items[0].plain_text
  }
  return "Untitled"
}

async function buildDigest(env: Env): Promise<string> {
  const statusProp = env.STATUS_PROPERTY ?? "Status"
  const doneValue = env.DONE_VALUE ?? "Done"
  const since = daysAgo(7)
  const today = todayISO()
  const weekLabel = `${since} → ${today}`

  // Query for items completed in the last 7 days
  const result = await notionFetch(env, `/databases/${env.SOURCE_DATABASE_ID}/query`, {
    method: "POST",
    body: {
      filter: {
        or: [
          { property: statusProp, status: { equals: doneValue } },
          { property: statusProp, select: { equals: doneValue } },
        ],
      },
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
      page_size: 100,
    },
  })

  const pages = (result.results as Array<Record<string, unknown>>) ?? []

  const bulletItems = pages.map((page) => ({
    bulleted_list_item: {
      rich_text: [{ text: { content: pageTitle(page) } }],
    },
  }))

  const children = [
    {
      heading_2: {
        rich_text: [{ text: { content: `✅  Completed this week (${pages.length})` } }],
      },
    },
    ...(bulletItems.length > 0
      ? bulletItems
      : [
          {
            paragraph: {
              rich_text: [{ text: { content: "Nothing marked as done this week." } }],
            },
          },
        ]),
    { divider: {} },
    {
      paragraph: {
        rich_text: [
          { text: { content: "Generated automatically by ", annotations: { color: "gray" } } },
          {
            text: { content: "notion-digest-worker", link: { url: "https://github.com/makenotion/notion-cookbook" } },
            annotations: { color: "gray" },
          },
        ],
      },
    },
  ]

  const digest = await notionFetch(env, "/pages", {
    method: "POST",
    body: {
      parent: { page_id: env.DIGEST_PAGE_ID },
      properties: {
        title: {
          title: [{ text: { content: `Weekly Digest — ${weekLabel}` } }],
        },
      },
      children,
    },
  })

  return (digest.url as string) ?? digest.id as string
}

export default {
  // Scheduled trigger — runs on the cron defined in wrangler.toml
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      buildDigest(env).then((url) => console.log("Digest created:", url))
    )
  },

  // HTTP trigger — POST /run to generate a digest on demand
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/run" && request.method === "POST") {
      try {
        const digestUrl = await buildDigest(env)
        return Response.json({ ok: true, url: digestUrl })
      } catch (err: unknown) {
        return Response.json({ ok: false, error: (err as Error).message }, { status: 500 })
      }
    }

    return new Response(
      "Notion Digest Worker\n\nPOST /run — generate a digest immediately\nScheduled — runs automatically per wrangler.toml cron",
      { status: 200 }
    )
  },
}
