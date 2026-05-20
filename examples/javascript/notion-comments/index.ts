import { Client } from "@notionhq/client"
import * as dotenv from "dotenv"

dotenv.config()

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const pageId = process.env.NOTION_PAGE_ID ?? ""
const command = process.argv[2] ?? "list"

async function listComments() {
  const allComments = []
  let cursor: string | undefined

  do {
    const response = await notion.comments.list({
      block_id: pageId,
      ...(cursor ? { start_cursor: cursor } : {}),
    })
    allComments.push(...response.results)
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  if (allComments.length === 0) {
    console.log("No comments found on this page.")
    return
  }

  console.log(`Found ${allComments.length} comment(s):\n`)

  for (const comment of allComments) {
    const text = comment.rich_text.map((t) => t.plain_text).join("")
    const created = new Date(comment.created_time).toLocaleString()
    console.log(`[${created}] ${text}`)
  }
}

async function addComment() {
  const commentText = process.env.COMMENT_TEXT ?? "Hello from the Notion API!"

  const comment = await notion.comments.create({
    parent: { page_id: pageId },
    rich_text: [{ type: "text", text: { content: commentText } }],
  })

  console.log(`Comment added (id: ${comment.id})`)
}

async function main() {
  if (!pageId) {
    console.error("Set NOTION_PAGE_ID in your .env file.")
    process.exit(1)
  }

  if (command === "add") {
    await addComment()
  } else {
    await listComments()
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
