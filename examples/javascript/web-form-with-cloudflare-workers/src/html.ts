export const css = `
:root {
  --black: #191919;
  --gray: #6b7280;
  --light-gray: #f3f4f6;
  --border: #e5e7eb;
  --purple: #6366f1;
  --purple-light: #eef2ff;
  --purple-dark: #4f46e5;
  --green: #059669;
  --green-bg: #ecfdf5;
  --green-border: #a7f3d0;
  --red: #dc2626;
  --red-bg: #fef2f2;
  --red-border: #fecaca;
  --shadow: 0 1px 3px rgba(0,0,0,0.08),0 4px 12px rgba(0,0,0,0.04);
  --radius: 10px;
  --radius-sm: 6px;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f9fafb;color:var(--black);line-height:1.6;min-height:100vh;font-size:15px}
header{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:20}
.header-inner{max-width:760px;margin:0 auto;padding:.75rem 1.5rem;display:flex;align-items:center}
.logo{display:flex;align-items:center;gap:.5rem;font-weight:600;font-size:.9375rem;color:var(--black);text-decoration:none}
main{max-width:760px;margin:0 auto;padding:2.5rem 1.5rem 5rem}
.intro{margin-bottom:2.5rem}
.intro h1{font-size:1.875rem;font-weight:700;letter-spacing:-.02em;margin-bottom:.625rem;line-height:1.25}
.intro p{color:var(--gray);max-width:56ch}
.intro p+p{margin-top:.5rem}
.tip{font-size:.875rem}
.tip::before{content:"💡 "}
.steps{display:flex;flex-direction:column;gap:1.25rem}
.step{background:#fff;border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.step.completed{border-color:var(--green-border)}
.step.completed .step-num{background:var(--green);color:#fff}
.step-header{display:flex;align-items:flex-start;gap:1rem;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border)}
.step-num{width:2rem;height:2rem;border-radius:50%;background:var(--purple-light);color:var(--purple);font-weight:700;font-size:.8125rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:.125rem;transition:background .2s,color .2s}
.step-header h2{font-size:.9375rem;font-weight:600;line-height:1.4}
.step-desc{font-size:.8125rem;color:var(--gray);margin-top:.125rem}
.step-body{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;padding:1.5rem;align-items:start}
@media(max-width:580px){.step-body{grid-template-columns:1fr}}
form{display:flex;flex-direction:column}
.field{display:flex;flex-direction:column;gap:.3125rem;margin-bottom:.875rem}
label{font-size:.8125rem;font-weight:500;color:var(--gray);display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}
input[type=text],textarea{width:100%;padding:.5rem .75rem;border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.9375rem;font-family:inherit;color:var(--black);background:#fff;transition:border-color .15s,box-shadow .15s;-webkit-appearance:none}
input[type=text]:focus,textarea:focus{outline:none;border-color:var(--purple);box-shadow:0 0 0 3px var(--purple-light)}
textarea{resize:vertical;min-height:76px;line-height:1.5}
.input-row{display:flex;gap:.375rem}
.input-row input{flex:1;min-width:0}
.copy-btn{padding:0 .75rem;background:var(--light-gray);border:1px solid var(--border);border-radius:var(--radius-sm);font-size:.8125rem;font-family:inherit;color:var(--gray);cursor:pointer;white-space:nowrap;transition:background .15s,color .15s;flex-shrink:0}
.copy-btn:hover{background:var(--border);color:var(--black)}
.copy-btn.copied{color:var(--green);background:var(--green-bg);border-color:var(--green-border)}
.auto-badge{font-size:.6875rem;font-weight:600;padding:1px 7px;border-radius:20px;background:var(--green-bg);color:var(--green);border:1px solid var(--green-border);line-height:1.6}
.btn{display:inline-flex;align-items:center;gap:.5rem;background:var(--purple);color:#fff;border:none;border-radius:var(--radius-sm);padding:.5625rem 1.125rem;font-size:.9375rem;font-weight:500;font-family:inherit;cursor:pointer;margin-top:.25rem;transition:background .15s,opacity .15s;align-self:flex-start}
.btn:hover:not(:disabled){background:var(--purple-dark)}
.btn:disabled{opacity:.65;cursor:not-allowed}
.spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.response{border-radius:var(--radius-sm);padding:.875rem 1rem;font-size:.8125rem;line-height:1.5;border:1px solid transparent}
.response.success{background:var(--green-bg);border-color:var(--green-border)}
.response.error{background:var(--red-bg);border-color:var(--red-border)}
.response-label{font-weight:600;font-size:.8125rem;margin-bottom:.5rem}
.response.success .response-label{color:var(--green)}
.response.error .response-label{color:var(--red)}
.response-row{display:flex;gap:.375rem;margin-top:.25rem;flex-wrap:wrap;align-items:baseline}
.response-key{color:var(--gray);flex-shrink:0}
.response-value{font-family:"SFMono-Regular",Consolas,monospace;word-break:break-all;color:var(--black)}
.response-link{color:var(--purple);text-decoration:none;word-break:break-all}
.response-link:hover{text-decoration:underline}
footer{max-width:760px;margin:0 auto;padding:1.5rem;text-align:center;color:var(--gray);font-size:.8125rem;border-top:1px solid var(--border)}
footer a{color:var(--purple);text-decoration:none}
footer a:hover{text-decoration:underline}
`

export const js = `
const dbForm = document.getElementById("databaseForm")
const pageForm = document.getElementById("pageForm")
const blocksForm = document.getElementById("blocksForm")
const commentForm = document.getElementById("commentForm")
const dbResponseEl = document.getElementById("dbResponse")
const pageResponseEl = document.getElementById("pageResponse")
const blocksResponseEl = document.getElementById("blocksResponse")
const commentResponseEl = document.getElementById("commentResponse")

function setLoading(btn, loading) {
  const text = btn.querySelector(".btn-text")
  const spinner = btn.querySelector(".spinner")
  btn.disabled = loading
  if (loading) { spinner.removeAttribute("hidden"); text.style.opacity = ".75" }
  else { spinner.setAttribute("hidden", ""); text.style.opacity = "" }
}

function renderResponse(container, type, fields) {
  container.removeAttribute("hidden")
  container.className = "response " + type
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
      a.className = "response-link"; a.href = value; a.target = "_blank"; a.rel = "noopener"; a.textContent = value
      row.appendChild(a)
    } else {
      const val = document.createElement("span")
      val.className = "response-value"; val.textContent = value; row.appendChild(val)
    }
    container.appendChild(row)
  })
}

function autofill(inputId, badgeId, value) {
  const input = document.getElementById(inputId)
  const badge = document.getElementById(badgeId)
  if (input && value) { input.value = value; badge && badge.removeAttribute("hidden") }
}

function markComplete(stepId) { document.getElementById(stepId)?.classList.add("completed") }

document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target)
    if (!input?.value) return
    navigator.clipboard.writeText(input.value).then(() => {
      btn.textContent = "Copied!"; btn.classList.add("copied")
      setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied") }, 2000)
    })
  })
})

async function post(path, body) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
  return res.json()
}

dbForm.addEventListener("submit", async e => {
  e.preventDefault(); const btn = dbForm.querySelector(".btn"); setLoading(btn, true)
  try {
    const json = await post("/databases", { dbName: dbForm.dbName.value.trim() })
    if (json.message !== "success!") { renderResponse(dbResponseEl, "error", [{ key: "Error:", value: json.error?.message ?? String(json.error) }]); return }
    renderResponse(dbResponseEl, "success", [
      { key: "Database ID:", value: json.data.id },
      { key: "Data Source ID:", value: json.data.dataSourceId },
      ...(json.data.url ? [{ key: "URL:", value: json.data.url, link: true }] : [])
    ])
    markComplete("step-1"); autofill("newPageDB", "dsId-badge", json.data.dataSourceId)
  } catch(err) { renderResponse(dbResponseEl, "error", [{ key: "Error:", value: err.message }]) }
  finally { setLoading(btn, false) }
})

pageForm.addEventListener("submit", async e => {
  e.preventDefault(); const btn = pageForm.querySelector(".btn"); setLoading(btn, true)
  try {
    const json = await post("/pages", { dbID: pageForm.newPageDB.value.trim(), pageName: pageForm.newPageName.value.trim(), header: pageForm.header.value.trim() })
    if (json.message !== "success!") { renderResponse(pageResponseEl, "error", [{ key: "Error:", value: json.error?.message ?? String(json.error) }]); return }
    renderResponse(pageResponseEl, "success", [
      { key: "Page ID:", value: json.data.id },
      ...(json.data.url ? [{ key: "URL:", value: json.data.url, link: true }] : [])
    ])
    markComplete("step-2"); autofill("pageID", "pageId-badge", json.data.id); autofill("pageIDComment", "commentPageId-badge", json.data.id)
  } catch(err) { renderResponse(pageResponseEl, "error", [{ key: "Error:", value: err.message }]) }
  finally { setLoading(btn, false) }
})

blocksForm.addEventListener("submit", async e => {
  e.preventDefault(); const btn = blocksForm.querySelector(".btn"); setLoading(btn, true)
  try {
    const json = await post("/blocks", { pageID: blocksForm.pageID.value.trim(), content: blocksForm.content.value.trim() })
    if (json.message !== "success!") { renderResponse(blocksResponseEl, "error", [{ key: "Error:", value: json.error?.message ?? String(json.error) }]); return }
    renderResponse(blocksResponseEl, "success", [{ key: "Block ID:", value: json.data.results?.[0]?.id ?? json.data.id }])
    markComplete("step-3")
  } catch(err) { renderResponse(blocksResponseEl, "error", [{ key: "Error:", value: err.message }]) }
  finally { setLoading(btn, false) }
})

commentForm.addEventListener("submit", async e => {
  e.preventDefault(); const btn = commentForm.querySelector(".btn"); setLoading(btn, true)
  try {
    const json = await post("/comments", { pageID: commentForm.pageIDComment.value.trim(), comment: commentForm.comment.value.trim() })
    if (json.message !== "success!") { renderResponse(commentResponseEl, "error", [{ key: "Error:", value: json.error?.message ?? String(json.error) }]); return }
    renderResponse(commentResponseEl, "success", [{ key: "Comment ID:", value: json.data.id }, { key: "Discussion ID:", value: json.data.discussion_id ?? "—" }])
    markComplete("step-4")
  } catch(err) { renderResponse(commentResponseEl, "error", [{ key: "Error:", value: err.message }]) }
  finally { setLoading(btn, false) }
})
`

export function buildHtml(css: string, js: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Notion API Demo</title>
  <style>${css}</style>
</head>
<body>
  <header>
    <div class="header-inner">
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="100" height="100" rx="12" fill="#191919"/>
          <path d="M22 25.5C22 22.4 24.4 20 27.5 20H72.5C75.6 20 78 22.4 78 25.5V74.5C78 77.6 75.6 80 72.5 80H27.5C24.4 80 22 77.6 22 74.5V25.5Z" fill="white"/>
          <path d="M35 35H65M35 50H65M35 65H55" stroke="#191919" stroke-width="6" stroke-linecap="round"/>
        </svg>
        <span>Notion API Demo</span>
      </div>
    </div>
  </header>
  <main>
    <div class="intro">
      <h1>Build with Notion's API</h1>
      <p>Follow the steps below to create a database, add pages, content, and comments — all via the Notion API. IDs are auto-filled between steps.</p>
      <p class="tip">Open your Notion workspace in another tab to see changes appear in real time.</p>
    </div>
    <div class="steps">
      <div class="step" id="step-1">
        <div class="step-header">
          <div class="step-num">1</div>
          <div><h2>Create a database</h2><p class="step-desc">Creates a new database inside the page set in your environment variables.</p></div>
        </div>
        <div class="step-body">
          <form id="databaseForm">
            <div class="field"><label for="dbName">Database name</label><input type="text" id="dbName" placeholder="My Notion Database" autocomplete="off" /></div>
            <button type="submit" class="btn"><span class="btn-text">Create database</span><span class="spinner" hidden aria-hidden="true"></span></button>
          </form>
          <div id="dbResponse" class="response" hidden aria-live="polite"></div>
        </div>
      </div>
      <div class="step" id="step-2">
        <div class="step-header">
          <div class="step-num">2</div>
          <div><h2>Add a page to the database</h2><p class="step-desc">The Data Source ID is auto-filled after step 1 succeeds.</p></div>
        </div>
        <div class="step-body">
          <form id="pageForm">
            <div class="field">
              <label for="newPageDB">Data Source ID <span class="auto-badge" id="dsId-badge" hidden>Auto-filled ✓</span></label>
              <div class="input-row"><input type="text" id="newPageDB" placeholder="Paste Data Source ID from step 1" autocomplete="off" /><button type="button" class="copy-btn" data-target="newPageDB">Copy</button></div>
            </div>
            <div class="field"><label for="newPageName">Page name</label><input type="text" id="newPageName" placeholder="My New Page" autocomplete="off" /></div>
            <div class="field"><label for="header">Heading (H2)</label><input type="text" id="header" placeholder="Introduction" autocomplete="off" /></div>
            <button type="submit" class="btn"><span class="btn-text">Add page</span><span class="spinner" hidden aria-hidden="true"></span></button>
          </form>
          <div id="pageResponse" class="response" hidden aria-live="polite"></div>
        </div>
      </div>
      <div class="step" id="step-3">
        <div class="step-header">
          <div class="step-num">3</div>
          <div><h2>Add content to the page</h2><p class="step-desc">Appends a paragraph block. Page ID is auto-filled after step 2.</p></div>
        </div>
        <div class="step-body">
          <form id="blocksForm">
            <div class="field">
              <label for="pageID">Page ID <span class="auto-badge" id="pageId-badge" hidden>Auto-filled ✓</span></label>
              <div class="input-row"><input type="text" id="pageID" placeholder="Paste Page ID from step 2" autocomplete="off" /><button type="button" class="copy-btn" data-target="pageID">Copy</button></div>
            </div>
            <div class="field"><label for="content">Content</label><textarea id="content" rows="3" placeholder="Write something here…"></textarea></div>
            <button type="submit" class="btn"><span class="btn-text">Add content</span><span class="spinner" hidden aria-hidden="true"></span></button>
          </form>
          <div id="blocksResponse" class="response" hidden aria-live="polite"></div>
        </div>
      </div>
      <div class="step" id="step-4">
        <div class="step-header">
          <div class="step-num">4</div>
          <div><h2>Add a comment to the page</h2><p class="step-desc">Page ID is auto-filled after step 2 succeeds.</p></div>
        </div>
        <div class="step-body">
          <form id="commentForm">
            <div class="field">
              <label for="pageIDComment">Page ID <span class="auto-badge" id="commentPageId-badge" hidden>Auto-filled ✓</span></label>
              <div class="input-row"><input type="text" id="pageIDComment" placeholder="Paste Page ID from step 2" autocomplete="off" /><button type="button" class="copy-btn" data-target="pageIDComment">Copy</button></div>
            </div>
            <div class="field"><label for="comment">Comment</label><textarea id="comment" rows="2" placeholder="Looks great!"></textarea></div>
            <button type="submit" class="btn"><span class="btn-text">Add comment</span><span class="spinner" hidden aria-hidden="true"></span></button>
          </form>
          <div id="commentResponse" class="response" hidden aria-live="polite"></div>
        </div>
      </div>
    </div>
  </main>
  <footer>
    <p>Built with the <a href="https://developers.notion.com" target="_blank" rel="noopener">Notion API</a> &mdash; <a href="https://github.com/makenotion/notion-cookbook" target="_blank" rel="noopener">notion-cookbook</a></p>
  </footer>
  <script>${js}</script>
</body>
</html>`
}
