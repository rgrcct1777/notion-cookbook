"""
Step 1 — Add blocks to a page

Appends a heading and paragraph block to the page configured in your .env file.
Run: python 1_add_block.py
"""

import os
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

notion = Client(auth=os.environ["NOTION_KEY"])
page_id = os.environ["NOTION_PAGE_ID"]

response = notion.blocks.children.append(
    block_id=page_id,
    children=[
        {
            "heading_2": {
                "rich_text": [{"text": {"content": "Hello from Python 🐍"}}]
            }
        },
        {
            "paragraph": {
                "rich_text": [
                    {
                        "text": {
                            "content": "This block was added using the Notion API and the notion-client Python SDK."
                        }
                    }
                ]
            }
        },
    ],
)

print(f"Added {len(response['results'])} block(s) to page {page_id}")
for block in response["results"]:
    print(f"  {block['type']}: {block['id']}")
