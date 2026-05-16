// client.js — runs in the browser for each page load

const dbForm = document.getElementById("databaseForm")
const pageForm = document.getElementById("pageForm")
const blocksForm = document.getElementById("blocksForm")
const commentForm = document.getElementById("commentForm")

const dbResponseEl = document.getElementById("dbResponse")
const pageResponseEl = document.getElementById("pageResponse")
const blocksResponseEl = document.getElementById("blocksResponse")
const commentResponseEl = document.getElementById("commentResponse")

// ── Loading state ──────────────────────────────────────────────

function setLoading(btn, loading) {
  const text = btn.querySelector(".btn-text")
  const spinner = btn.querySelector(".spinner")
  btn.disabled = loading
  if (loading) {
    spinner.removeAttribute("hidden")
    text.style.opacity = "0.75"
  } else {
    spinner.setAttribute("hidden", "")
    text.style.opacity = ""
  }
}

// ── Render API response ────────────────────────────────────────

function renderResponse(container, type, fields) {
  container.removeAttribute("hidden")
  container.className = `response ${type}`
  container.innerHTML = ""

  const label = document.createElement("div")
  label.className = "response-label"
  label.textContent = type === "success" ? "✓ Success" : "✗ Error"
  container.appendChild(label)

  fields.forEach(({ key, value, link }) => {
    const row = document.createElement("div")
    row.className = "response-row"
    const keyEl = document.createElement("span")
    keyEl.className = "response-key"
    keyEl.textContent = key
    row.appendChild(keyEl)

    if (link) {
      const a = document.createElement("a")
      a.className = "response-link"
      a.href = value
      a.target = "_blank"
      a.rel = "noopener"
      a.textContent = value
      row.appendChild(a)
    } else {
      const val = document.createElement("span")
      val.className = "response-value"
      val.textContent = value
      row.appendChild(val)
    }
    container.appendChild(row)
  })
}

// ── Auto-fill helpers ──────────────────────────────────────────

function autofill(inputId, badgeId, value) {
  const input = document.getElementById(inputId)
  const badge = document.getElementById(badgeId)
  if (input && value) {
    input.value = value
    if (badge) badge.removeAttribute("hidden")
  }
}

function markComplete(stepId) {
  document.getElementById(stepId)?.classList.add("completed")
}

// ── Copy-to-clipboard buttons ──────────────────────────────────

document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target)
    if (!input?.value) return
    navigator.clipboard.writeText(input.value).then(() => {
      btn.textContent = "Copied!"
      btn.classList.add("copied")
      setTimeout(() => {
        btn.textContent = "Copy"
        btn.classList.remove("copied")
      }, 2000)
    })
  })
})

// ── Step 1: Create database ────────────────────────────────────

dbForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const btn = dbForm.querySelector(".btn")
  setLoading(btn, true)

  try {
    const dbName = dbForm.dbName.value.trim()
    const res = await fetch("/databases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dbName }),
    })
    const json = await res.json()

    if (json.message !== "success!") {
      renderResponse(dbResponseEl, "error", [
        { key: "Error:", value: json.error?.message ?? JSON.stringify(json.error) },
      ])
      return
    }

    renderResponse(dbResponseEl, "success", [
      { key: "Database ID:", value: json.data.id },
      { key: "Data Source ID:", value: json.data.dataSourceId },
      ...(json.data.url ? [{ key: "URL:", value: json.data.url, link: true }] : []),
    ])
    markComplete("step-1")
    autofill("newPageDB", "dsId-badge", json.data.dataSourceId)
  } catch (err) {
    renderResponse(dbResponseEl, "error", [{ key: "Error:", value: err.message }])
  } finally {
    setLoading(btn, false)
  }
})

// ── Step 2: Add a page ─────────────────────────────────────────

pageForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const btn = pageForm.querySelector(".btn")
  setLoading(btn, true)

  try {
    const dbID = pageForm.newPageDB.value.trim()
    const pageName = pageForm.newPageName.value.trim()
    const header = pageForm.header.value.trim()

    const res = await fetch("/pages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dbID, pageName, header }),
    })
    const json = await res.json()

    if (json.message !== "success!") {
      renderResponse(pageResponseEl, "error", [
        { key: "Error:", value: json.error?.message ?? JSON.stringify(json.error) },
      ])
      return
    }

    renderResponse(pageResponseEl, "success", [
      { key: "Page ID:", value: json.data.id },
      ...(json.data.url ? [{ key: "URL:", value: json.data.url, link: true }] : []),
    ])
    markComplete("step-2")
    // Auto-fill Page ID in both step 3 and step 4
    autofill("pageID", "pageId-badge", json.data.id)
    autofill("pageIDComment", "commentPageId-badge", json.data.id)
  } catch (err) {
    renderResponse(pageResponseEl, "error", [{ key: "Error:", value: err.message }])
  } finally {
    setLoading(btn, false)
  }
})

// ── Step 3: Add content block ──────────────────────────────────

blocksForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const btn = blocksForm.querySelector(".btn")
  setLoading(btn, true)

  try {
    const pageID = blocksForm.pageID.value.trim()
    const content = blocksForm.content.value.trim()

    const res = await fetch("/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageID, content }),
    })
    const json = await res.json()

    if (json.message !== "success!") {
      renderResponse(blocksResponseEl, "error", [
        { key: "Error:", value: json.error?.message ?? JSON.stringify(json.error) },
      ])
      return
    }

    const blockId = json.data.results?.[0]?.id ?? json.data.id
    renderResponse(blocksResponseEl, "success", [
      { key: "Block ID:", value: blockId },
    ])
    markComplete("step-3")
  } catch (err) {
    renderResponse(blocksResponseEl, "error", [{ key: "Error:", value: err.message }])
  } finally {
    setLoading(btn, false)
  }
})

// ── Step 4: Add comment ────────────────────────────────────────

commentForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  const btn = commentForm.querySelector(".btn")
  setLoading(btn, true)

  try {
    const pageID = commentForm.pageIDComment.value.trim()
    const comment = commentForm.comment.value.trim()

    const res = await fetch("/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageID, comment }),
    })
    const json = await res.json()

    if (json.message !== "success!") {
      renderResponse(commentResponseEl, "error", [
        { key: "Error:", value: json.error?.message ?? JSON.stringify(json.error) },
      ])
      return
    }

    renderResponse(commentResponseEl, "success", [
      { key: "Comment ID:", value: json.data.id },
      { key: "Discussion ID:", value: json.data.discussion_id ?? "—" },
    ])
    markComplete("step-4")
  } catch (err) {
    renderResponse(commentResponseEl, "error", [{ key: "Error:", value: err.message }])
  } finally {
    setLoading(btn, false)
  }
})
