# Spec to Implementation — Evaluations

Each scenario below is a self-contained test. Run it by pasting the **Prompt** into Claude with the Notion MCP skill active and comparing the actual output to the **Pass criteria**.

---

## Scenario 1 — Parse a spec and create a full task breakdown

**Prompt**

> Implement the user authentication spec in Notion. It should cover sign-up, login, password reset, and session management.

**Pass criteria**

- Searches Notion for a spec page matching "user authentication", "auth spec", or similar
- Fetches and reads the full spec page content — does not make up requirements
- Creates an implementation plan page with: phases/milestones, tech approach summary, and estimated scope
- Creates individual task pages in the task database (at least one per feature: sign-up, login, password reset, session)
- Each task includes: Title, Description, Acceptance Criteria, and Status = "Not Started"
- Links the implementation plan to the spec page and to the tasks

**Fail signals**

- Creates tasks without first reading the spec (invents requirements)
- Creates only an implementation plan page without individual tasks
- Tasks lack acceptance criteria or are too vague to implement
- Plan is not linked back to the spec

---

## Scenario 2 — Pick up an in-progress implementation

**Prompt**

> I've been working on the payments integration. Some tasks are done, some are in progress. Can you check where we are and tell me what's next?

**Pass criteria**

- Searches Notion for "payments integration" spec or implementation plan
- Queries the task database filtered to the payments integration (by tag, project, or title)
- Correctly identifies tasks by status: Done, In Progress, Not Started
- Identifies blockers if any tasks are marked as blocked
- Provides a prioritized "what's next" list — does not just list all remaining tasks
- Does not mark any task as done without explicit instruction

**Fail signals**

- Returns a flat list of all tasks without grouping by status
- Marks tasks as complete based on assumptions
- Does not distinguish between "in progress" and "not started"

---

## Scenario 3 — Update progress during implementation

**Prompt**

> I just finished the sign-up endpoint. The login endpoint is 50% done — I've got the JWT generation working but haven't added the refresh token logic yet. Update the tasks in Notion.

**Pass criteria**

- Finds the "sign-up" task and updates its status to "Done" (or equivalent)
- Finds the "login" task and: updates status to "In Progress", adds a progress note with the specific details provided (JWT done, refresh token pending)
- Does not change any other task statuses
- Confirms the updates in its response with task IDs or links

**Fail signals**

- Updates the wrong tasks or conflates sign-up and login
- Marks login as "Done" when the user said it's only 50% complete
- Makes no distinction between tasks — marks all as "In Progress"
- Does not record the specific progress note

---

## Scenario 4 — Spec is ambiguous — ask before creating tasks

**Prompt**

> Create tasks for the new notification system spec.

**Pass criteria**

- Searches Notion for a "notification system" spec
- If the spec is found but ambiguous (e.g., mentions "email, push, and in-app" but lacks detail), asks clarifying questions before creating tasks
- If the spec is NOT found, asks the user to share the spec URL/ID rather than inventing requirements
- Does not create 20+ tasks from a vague spec without confirmation
- When it does create tasks (after disambiguation), each task is specific and actionable

**Fail signals**

- Creates a large set of generic tasks ("Set up email service", "Configure push notifications") without finding or reading a spec
- Does not ask any clarifying questions when the spec is unclear
- Invents acceptance criteria not grounded in any source document
