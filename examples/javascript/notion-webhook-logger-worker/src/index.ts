import { Hono } from "hono"

export interface Env {
  NOTION_KEY: string
  NOTION_DATABASE_ID: string
  WEBHOOK_SECRET?: string
}

const NOTION_VERSION = "2022-06-28"
const NOTION_BASE = "https://api.notion.com/v1"

async function notionFetch(
  env: Env,
  path: string,
  body: unknown
): Promise<Record<string, unknown>> {
  const res = await fetch(`${NOTION_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.NOTION_KEY}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error((data as { message?: string }).message ?? `Notion error ${res.status}`)
  }
  return data as Record<string, unknown>
}

// Derive a short, human-readable title from the webhook payload
function deriveTitle(source: string, payload: unknown): string {
  if (typeof payload !== "object" || payload === null) return source
  const p = payload as Record<string, unknown>

  // GitHub events
  if (typeof p.action === "string") {
    const repo =
      typeof p.repository === "object" && p.repository !== null
        ? (p.repository as Record<string, unknown>).full_name
        : undefined
    return repo ? `${source}: ${p.action} on ${repo}` : `${source}: ${p.action}`
  }

  // Stripe events
  if (typeof p.type === "string") return `${source}: ${p.type}`

  return source
}

const app = new Hono<{ Bindings: Env }>()

app.get("/", (c) => c.text("Notion Webhook Logger is running. POST to /webhook to log events."))

// POST /webhook — log the incoming payload as a Notion database row
app.post("/webhook", async (c) => {
  // If WEBHOOK_SECRET is configured, require it in the X-Webhook-Secret header.
  if (c.env.WEBHOOK_SECRET) {
    const provided = c.req.header("X-Webhook-Secret")
    if (!provided || provided !== c.env.WEBHOOK_SECRET) {
      return c.json({ error: "Unauthorized" }, 401)
    }
  }

  // Infer the source from a common header pattern
  const source =
    c.req.header("X-GitHub-Event")
      ? `github/${c.req.header("X-GitHub-Event")}`
      : c.req.header("Stripe-Signature")
      ? "stripe"
      : c.req.header("X-Webhook-Source") ?? "unknown"

  const rawBody = await c.req.text()
  const receivedAt = new Date().toISOString()

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    payload = rawBody
  }

  const title = deriveTitle(source, payload)

  // Truncate to Notion's 2000-char limit. Use Array.from so the slice respects
  // Unicode code points (avoids splitting surrogate pairs for emoji, etc.).
  const codePoints = Array.from(rawBody)
  const preview =
    codePoints.length > 1990 ? codePoints.slice(0, 1990).join("") + "…" : rawBody

  try {
    await notionFetch(c.env, "/pages", {
      parent: { database_id: c.env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: title } }] },
        Source: { rich_text: [{ text: { content: source } }] },
        Received: { date: { start: receivedAt } },
        Status: { select: { name: "New" } },
      },
      children: [
        {
          code: {
            language: "json",
            rich_text: [{ text: { content: preview } }],
          },
        },
      ],
    })

    return c.json({ received: true, title })
  } catch (err: unknown) {
    console.error("Failed to log to Notion:", err)
    return c.json({ received: false, error: (err as Error).message }, 500)
  }
})

export default app
