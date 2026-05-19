# Knowledge Capture — Evaluations

Each scenario below is a self-contained test. Run it by pasting the **Prompt** into Claude with the Notion MCP skill active and comparing the actual output to the **Pass criteria**.

---

## Scenario 1 — Capture a how-to from a chat explanation

**Prompt**

> I just explained to you how we deploy to production: push to `main`, GitHub Actions builds the Docker image, tags it with the commit SHA, pushes it to ECR, then ECS picks it up via a rolling update. The whole thing takes about 8 minutes. Please save this to Notion as a how-to guide.

**Pass criteria**

- Searches Notion for an existing "deploy" or "production" page before creating a new one
- Creates a new page with a clear title (e.g., "How to Deploy to Production")
- Page content includes all four steps in numbered/bulleted format
- Content is written as a guide (second person, imperative verbs), not a transcript
- Adds a link from a relevant hub page (engineering wiki, team home, or docs index)
- Does **not** hallucinate steps that weren't mentioned

**Fail signals**

- Skips the Notion search step entirely
- Creates a page as a direct quote or transcript of the chat
- Orphans the page with no link from a parent/hub page

---

## Scenario 2 — Document an architecture decision from a discussion

**Prompt**

> We just decided to use Postgres instead of MongoDB for the new payments service. The main reasons were: we already have Postgres expertise on the team, we need ACID transactions for financial data, and MongoDB's licensing change in 2024 made us uncomfortable. The decision was made by Alice, Bob, and Carol. Please record this as a decision log entry in Notion.

**Pass criteria**

- Searches Notion for an existing decision log or ADR database
- Creates a structured decision record with: Context, Decision, Rationale, Options Considered (at least MongoDB vs. Postgres), and Deciders
- Sets the status to "Decided" or equivalent
- Includes the date (today's date or asks the user to confirm)
- Links the new entry from the decision log index if one exists

**Fail signals**

- Creates a plain paragraph page instead of a structured record
- Omits the rationale or options considered
- Does not mention all three deciders

---

## Scenario 3 — Save a Q&A pair as a FAQ entry

**Prompt**

> Someone asked in Slack: "Why do our API responses sometimes return 429 errors?" and I answered: "That's a rate limit hit. Our API allows 100 requests per minute per API key. If you exceed that, you get a 429. The fix is to add exponential backoff with jitter to your retry logic — wait 2^n seconds plus a random offset before retrying." Add this to our FAQ in Notion.

**Pass criteria**

- Searches Notion for an existing FAQ page or database
- Creates a FAQ entry with: the question as the title, the short answer up front, and the detailed explanation with the specific numbers (100 req/min, exponential backoff formula)
- Content is written in a documentation voice, not as a chat transcript
- Correctly preserves the technical specifics (rate limit number, retry strategy)
- Links the entry from the FAQ index or adds it to the FAQ database

**Fail signals**

- Creates a general page instead of adding to the existing FAQ structure
- Paraphrases the technical details inaccurately (e.g., wrong rate limit number)
- Omits the actionable fix (exponential backoff)

---

## Scenario 4 — Update an existing page instead of creating a duplicate

**Prompt**

> We updated the onboarding process — now new engineers also need to set up 1Password before anything else. Can you add that to our existing onboarding doc in Notion?

**Pass criteria**

- Searches Notion and **finds** the existing onboarding doc (does not create a duplicate)
- Fetches the page to read its current structure
- Appends or inserts the 1Password step in the appropriate place (beginning of the setup steps)
- Does not overwrite or delete existing content

**Fail signals**

- Creates a new page titled "Onboarding" instead of updating the existing one
- Appends the step at the bottom when the beginning is clearly more appropriate
- Acknowledges the existing page but creates a duplicate anyway
