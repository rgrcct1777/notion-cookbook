"""
Step 4 — Query and filter the database

Fetches completed books from the Book Tracker, sorted by rating.
Run: python 4_query_database.py <database_id>
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
    print("Usage: python 4_query_database.py <database_id>")
    print("  or set NOTION_DATABASE_ID in your .env file.")
    sys.exit(1)

response = notion.databases.query(
    database_id=database_id,
    filter={"property": "Status", "select": {"equals": "Done"}},
    sorts=[{"property": "Rating", "direction": "descending"}],
)

pages = response["results"]
print(f"Found {len(pages)} completed book(s):\n")

for page in pages:
    props = page["properties"]

    title_items = props.get("Title", {}).get("title", [])
    name = title_items[0]["plain_text"] if title_items else "(untitled)"

    rating = props.get("Rating", {}).get("number") or 0
    stars = "⭐" * int(rating)

    author_items = props.get("Author", {}).get("rich_text", [])
    author = author_items[0]["plain_text"] if author_items else ""

    print(f"  {stars} {name}" + (f"  —  {author}" if author else ""))
