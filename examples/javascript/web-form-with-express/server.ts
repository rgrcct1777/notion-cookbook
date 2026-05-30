import { config } from "dotenv"
import express, { Request, Response } from "express"
import { Client, isFullDatabase } from "@notionhq/client"

config()

const app = express()
const notion = new Client({ auth: process.env.NOTION_KEY })

app.use(express.static("public"))
app.use(express.json())

app.get("/", (_req: Request, res: Response) => {
  res.sendFile(__dirname + "/views/index.html")
})

// Create a new database inside the configured page
app.post("/databases", async (req: Request, res: Response) => {
  const pageId = process.env.NOTION_PAGE_ID
  const { dbName } = req.body

  if (!dbName?.trim()) {
    res
      .status(400)
      .json({ message: "error", error: { message: "Database name is required" } })
    return
  }
  if (!pageId) {
    res.status(500).json({
      message: "error",
      error: { message: "NOTION_PAGE_ID is not set in environment variables" },
    })
    return
  }

  try {
    const newDb = await notion.databases.create({
      parent: { type: "page_id", page_id: pageId },
      title: [{ type: "text", text: { content: dbName.trim() } }],
      initial_data_source: {
        properties: { Name: { title: {} } },
      },
    })

    if (!isFullDatabase(newDb)) {
      res
        .status(403)
        .json({ message: "error", error: { message: "No read permissions on database" } })
      return
    }

    const dataSourceId = newDb.data_sources[0]?.id
    if (!dataSourceId) {
      res.status(403).json({
        message: "error",
        error: { message: "Database has no data sources — check integration permissions" },
      })
      return
    }
    res.json({ message: "success!", data: { ...newDb, dataSourceId } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ message: "error", error: { message } })
  }
})

// Create a new page in the given database (by data source ID)
app.post("/pages", async (req: Request, res: Response) => {
  const { dbID, pageName, header } = req.body

  if (!dbID?.trim() || !pageName?.trim()) {
    res.status(400).json({
      message: "error",
      error: { message: "Data Source ID and page name are required" },
    })
    return
  }

  try {
    const newPage = await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: dbID.trim() },
      properties: {
        Name: {
          title: [{ text: { content: pageName.trim() } }],
        },
      },
      children: header?.trim()
        ? [
            {
              object: "block" as const,
              heading_2: {
                rich_text: [{ text: { content: header.trim() } }],
              },
            },
          ]
        : [],
    })
    res.json({ message: "success!", data: newPage })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ message: "error", error: { message } })
  }
})

// Append a paragraph block to an existing page
app.post("/blocks", async (req: Request, res: Response) => {
  const { pageID, content } = req.body

  if (!pageID?.trim() || !content?.trim()) {
    res.status(400).json({
      message: "error",
      error: { message: "Page ID and content are required" },
    })
    return
  }

  try {
    const newBlock = await notion.blocks.children.append({
      block_id: pageID.trim(),
      children: [
        {
          paragraph: {
            rich_text: [{ text: { content: content.trim() } }],
          },
        },
      ],
    })
    res.json({ message: "success!", data: newBlock })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ message: "error", error: { message } })
  }
})

// Add a comment to a page
app.post("/comments", async (req: Request, res: Response) => {
  const { pageID, comment } = req.body

  if (!pageID?.trim() || !comment?.trim()) {
    res.status(400).json({
      message: "error",
      error: { message: "Page ID and comment are required" },
    })
    return
  }

  try {
    const newComment = await notion.comments.create({
      parent: { page_id: pageID.trim() },
      rich_text: [{ text: { content: comment.trim() } }],
    })
    res.json({ message: "success!", data: newComment })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error"
    res.status(500).json({ message: "error", error: { message } })
  }
})

const listener = app.listen(process.env.PORT ?? 3000, () => {
  const address = listener.address()
  if (address && typeof address === "object") {
    console.log(`App listening on port ${address.port}`)
  }
})
