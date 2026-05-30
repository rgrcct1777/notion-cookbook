# Meeting Intelligence — Evaluations

Each scenario below is a self-contained test. Run it by pasting the **Prompt** into Claude with the Notion MCP skill active and comparing the actual output to the **Pass criteria**.

---

## Scenario 1 — Internal team decision meeting

**Prompt**

> I have a meeting tomorrow at 2 pm with Alice (PM), Bob (engineering lead), and Carol (design lead) to decide whether to rebuild the mobile nav or patch the existing one. We've been tracking this in Notion — can you prep for the meeting?

**Pass criteria**

- Searches Notion for pages related to "mobile nav", "navigation", or the meeting topic
- Fetches at least one relevant page if found
- Creates an **internal pre-read** page titled "[topic] — Pre-Read (Internal)" with: Background, Current Status, Discussion Points, and What We Need From This Meeting sections
- Creates a separate **external agenda** page with timed agenda items, the objective, and decision items
- Both pages link to each other
- At least one page is linked from a relevant project or team page if one exists

**Fail signals**

- Creates only one document instead of the pre-read + agenda pair
- Agenda and pre-read are not linked to each other
- Agenda does not include time allocations
- Fabricates specific facts not found in Notion or general knowledge

---

## Scenario 2 — Customer meeting (external participants)

**Prompt**

> We have a call with Acme Corp on Friday to demo the new reporting dashboard. Sarah from Acme will join; on our side it's me and Dave from solutions. Set up the meeting docs.

**Pass criteria**

- Searches for any existing Acme Corp or reporting dashboard pages in Notion
- Creates an **internal pre-read** with: what we know about the customer/deal, demo talking points, and "what we need from this meeting"
- Creates a clean, professional **external agenda** appropriate for sharing with the customer — no internal commentary or pricing/deal info visible
- The external agenda is noticeably shorter and more polished than the internal pre-read
- Tone of external agenda is professional and customer-facing

**Fail signals**

- Creates a single document that mixes internal notes with the external agenda
- Internal deal details or negotiation notes appear in the external agenda
- No separation between "for our team" and "for the customer"

---

## Scenario 3 — Recurring standup with existing meeting notes

**Prompt**

> We have our weekly engineering sync tomorrow. It's a recurring meeting — there should be previous notes in Notion. Can you pull the context and set up the agenda?

**Pass criteria**

- Searches Notion specifically for previous meeting notes ("engineering sync", "weekly sync", "standup")
- Fetches at least one previous note page and surfaces outstanding action items or blockers
- Carries forward unresolved action items from the previous meeting into the agenda
- Creates an agenda that includes: standing items, open items from last week, and a section for new topics
- Notes the date of the previous meeting it found

**Fail signals**

- Creates a generic blank agenda without referencing any previous notes
- Claims no previous meeting notes exist without actually searching
- Does not carry forward open action items

---

## Scenario 4 — Urgent last-minute prep (no search time)

**Prompt**

> My call with the CTO is in 20 minutes to discuss whether to migrate our auth service to OAuth 2.0. I don't have time for deep prep — just give me what I need.

**Pass criteria**

- Does a quick search but moves fast — does not do exhaustive research
- Creates a single concise document (not two) with: the key decision, 2–3 talking points on each side, and a recommended framing for the conversation
- Document is under one page and scannable (bullets, not paragraphs)
- Explicitly notes what it could not find in Notion due to time constraints

**Fail signals**

- Creates two full documents (pre-read + agenda) when the user explicitly said they're short on time
- Output is longer than the user can read in 20 minutes
- Spends time doing broad research instead of delivering the essentials quickly
