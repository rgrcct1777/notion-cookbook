"""
Step 3 — Add a page to the database

Creates a new row in the Book Tracker database.
Run: python 3_add_page_to_database.py <database_id>
  or set NOTION_DATABASE_ID in your .env file.
"""

import os
import sys
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

notion = Client(auth=os.environ["NOTION_KEY"])

database_id = (
    sys.argv[1] if len(sys.argv) > 1 else os.environ.get("NOTION_DATABASE_ID", "")
)
if not database_id:
    print("Usage: python 3_add_page_to_database.py <database_id>")
    print("  or set NOTION_DATABASE_ID in your .env file.")
    sys.exit(1)

response = notion.pages.create(
    parent={"database_id": database_id},
    properties={
        "Title": {
            "title": [{"text": {"content": "The Pragmatic Programmer"}}]
        },
        "Author": {
            "rich_text": [{"text": {"content": "David Thomas, Andrew Hunt"}}]
        },
        "Status": {"select": {"name": "Done"}},
        "Rating": {"number": 5},
        "Finished": {"date": {"start": "2024-03-15"}},
    },
)

print(f"Page created!")
print(f"  ID:  {response['id']}")
print(f"  URL: {response['url']}")
