"""
Step 2 — Create a database

Creates a "Book Tracker" database as a child of the page set in your .env file.
Run: python 2_create_database.py
"""

import os
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

notion = Client(auth=os.environ["NOTION_KEY"])
page_id = os.environ["NOTION_PAGE_ID"]

response = notion.databases.create(
    parent={"type": "page_id", "page_id": page_id},
    title=[{"type": "text", "text": {"content": "Book Tracker"}}],
    properties={
        "Title": {"title": {}},
        "Author": {"rich_text": {}},
        "Status": {
            "select": {
                "options": [
                    {"name": "To Read", "color": "gray"},
                    {"name": "Reading", "color": "blue"},
                    {"name": "Done", "color": "green"},
                ]
            }
        },
        "Rating": {"number": {"format": "number"}},
        "Finished": {"date": {}},
    },
)

print(f"Database created!")
print(f"  ID:  {response['id']}")
print(f"  URL: {response['url']}")
print()
print("Copy the database ID above — you'll need it for the next steps.")
