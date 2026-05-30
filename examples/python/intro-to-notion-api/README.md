# Intro to the Notion API — Python

Four short scripts that walk through the most common Notion API operations using the official [`notion-client`](https://github.com/ramnes/notion-sdk-py) Python SDK.

| Script                      | What it does                                   |
| --------------------------- | ---------------------------------------------- |
| `1_add_block.py`            | Append a heading and paragraph block to a page |
| `2_create_database.py`      | Create a database with typed properties        |
| `3_add_page_to_database.py` | Add a row to the database                      |
| `4_query_database.py`       | Filter and sort database rows                  |

## Prerequisites

- Python 3.9+
- A [Notion integration](https://www.notion.com/my-integrations) with a secret key
- A Notion page shared with your integration (copy its ID from the URL)

## Setup

```bash
# 1. Create a virtual environment
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment variables
cp example.env .env
# Edit .env and fill in NOTION_KEY and NOTION_PAGE_ID
```

## Run the scripts in order

```bash
# Add blocks to your page
python 1_add_block.py

# Create a "Book Tracker" database inside your page
python 2_create_database.py
# → copy the database ID printed above

# Add a book to the database
python 3_add_page_to_database.py <database_id>

# Query completed books sorted by rating
python 4_query_database.py <database_id>
```

You can also set `NOTION_DATABASE_ID` in your `.env` file after step 2
so you don't have to pass the ID as an argument each time.

## Finding your page ID

Open a Notion page in the browser. The ID is the last 32-character
segment of the URL (without hyphens):

```
https://notion.so/My-Page-abc123def456...
                          ^^^^^^^^^^^^^^^^ this is the page ID
```

## Next steps

- [database-email-update](../database-email-update/) — watch a database and send email notifications
- [generate-random-data](../generate-random-data/) — populate a database with sample data
- [Notion API reference](https://developers.notion.com/reference)
