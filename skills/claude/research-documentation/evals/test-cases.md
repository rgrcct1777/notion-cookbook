# Research & Documentation — Evaluations

Each scenario below is a self-contained test. Run it by pasting the **Prompt** into Claude with the Notion MCP skill active and comparing the actual output to the **Pass criteria**.

---

## Scenario 1 — Synthesize a topic that spans multiple Notion pages

**Prompt**

> Research how our team handles database migrations and write it up as a reference doc in Notion. We should have some info scattered across our engineering wiki.

**Pass criteria**

- Searches Notion using multiple queries (e.g., "database migration", "migrations", "schema change")
- Fetches content from at least 2 relevant pages if found
- Synthesizes content into a coherent reference document — not a copy-paste of raw pages
- Document has a clear structure: Overview, Process/Steps, Examples, Related Pages
- Cites source pages with Notion links (not fabricated URLs)
- Saves the document to an appropriate location (engineering wiki, docs database) and links it from a relevant hub page

**Fail signals**

- Searches only once with a single query
- Produces a list of links instead of synthesized content
- Fabricates migration details not found in any Notion page
- Orphans the new doc with no link from a parent or hub

---

## Scenario 2 — Research a topic with no existing Notion content

**Prompt**

> I need a reference document on our approach to API versioning. I don't think we have anything written down yet — can you research best practices and write up a proposal for how we should handle it?

**Pass criteria**

- Searches Notion first and accurately reports that little or nothing was found
- Clearly labels the output as a **proposal** based on industry best practices, not existing team docs
- Covers at minimum: versioning strategies (URL path, header, query param), deprecation policy, and breaking vs. non-breaking changes
- Uses Claude's general knowledge but does not present it as company-specific fact
- Saves to Notion in the appropriate wiki or docs section
- Includes a "Proposed by" or "Status: Draft" indicator

**Fail signals**

- Searches Notion, finds nothing, then invents company-specific practices as if they were found
- Does not distinguish between "what we found in Notion" vs. "best practices from general knowledge"
- Omits a Status or source label on the document

---

## Scenario 3 — Comparative research with a recommendation

**Prompt**

> Compare our options for adding a search feature: Algolia, Elasticsearch, and building on top of Postgres full-text search. Look for anything in our Notion about our infrastructure constraints, then give me a recommendation.

**Pass criteria**

- Searches Notion for relevant infrastructure, architecture, or constraints pages
- Surfaces any relevant constraints found (e.g., existing cloud provider, data residency requirements)
- Produces a structured comparison covering: cost, complexity, maintenance burden, and fit with found constraints
- Makes a concrete recommendation with a rationale (not "it depends" without specifics)
- Saves the comparison document to Notion with a clear recommendation section

**Fail signals**

- Skips the Notion search for constraints and makes recommendations in a vacuum
- Recommendation section is vague ("all three have trade-offs, choose what fits your needs")
- Does not save the comparison to Notion

---

## Scenario 4 — Pull and summarize a specific page

**Prompt**

> Summarize our incident post-mortem from last month's database outage and turn it into a "lessons learned" page.

**Pass criteria**

- Searches Notion for "post-mortem", "incident", "database outage" to find the page
- Fetches the actual page content — does not paraphrase from memory
- Creates a new "Lessons Learned" page that: distills root causes, specific action items, and process improvements — distinct from just summarizing the post-mortem
- Links the new page back to the original post-mortem
- Does not invent incident details not present in the source page

**Fail signals**

- Cannot find the post-mortem page and creates a generic lessons-learned template without real content
- The new page is just a shorter version of the post-mortem with no additional synthesis
- Invents specific incident details (time of outage, affected systems) not found in the source
