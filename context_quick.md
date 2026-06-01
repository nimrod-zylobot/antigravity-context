# Antigravity 2.0 — System Reference for Claude

Nimrod runs **Antigravity 2.0** as his primary AI agent on a Windows PC. Claude's role is to guide decisions, plan builds professionally, and write commands/code — Antigravity executes everything locally.

**Claude on phone cannot run commands.** Write exact terminal commands for Nimrod to paste into his PC or Antigravity chat.

---

## 🖥️ PC Environment

- **OS:** Windows, PowerShell (use `;` not `&&` for chaining)
- **Scripts working dir:** `C:\Users\nimro\.gemini\antigravity\scratch\`
- **Plugins dir:** `C:\Users\nimro\.gemini\config\plugins\`
- **Runtime:** Node.js (`node script.js`)
- **Google Auth credentials:** `C:\Users\nimro\.local\share\google-workspace-mcp\credentials\nimrod_at_zylobot_dot_com.json`
- **Active email account:** `nimrod@zylobot.com`
- **GitHub org:** `nimrod-zylobot`

---

## 🔌 MCP Servers (on PC — Antigravity has direct access)

| Server | Connects To | Key Operations |
|---|---|---|
| `google-workspace` | Gmail, Sheets, Drive, Calendar, Docs | read/send email, read/update sheets (`Leads!A4:K100`), search drive |
| `github` | GitHub `nimrod-zylobot` org | push files, read files, create/update repos |
| `agentmemory` | Local vector DB `localhost:3113` | save/recall/search memories across sessions |
| `composio` | 250+ SaaS (Slack, Shopify, HubSpot…) | search tools, execute cross-app actions |
| `notion-mcp-server` | Notion workspace | read/write pages and databases |
| `StitchMCP` | Remote UI generation | generate screens from text prompts |

> **Handoff format for MCP tasks:** *"Ask Antigravity to use [server] MCP to [action]"*

---

## 🔌 Installed Plugins (extend Antigravity's capabilities)

| Plugin | What it enables |
|---|---|
| `superpowers` | Full engineering methodology (TDD, planning, debugging, code review, subagents) |
| `chrome-devtools-plugin` | Browser automation via Chrome DevTools Protocol — scraping, DOM queries, network interception |
| `android-cli-plugin` | Android app development, APK deployment, SDK management |
| `firebase` | Firebase Auth, Firestore, Realtime DB, Hosting |
| `google-workspace-guide` | Best practices for Google Workspace MCP usage |
| `modern-web-guidance-plugin` | Web development standards, UI/UX best practices |
| `google-antigravity-sdk` | Google SDK integrations |

---

## 🧠 Skills (all 16 — active in Antigravity, reference when planning)

| Skill | When to apply |
|---|---|
| `using-superpowers` | Every conversation start — checks which skills are relevant |
| `brainstorming` | **Before any new feature or UI** — explores requirements and design intent first |
| `writing-plans` | **Before touching code** — creates phased implementation plan for approval |
| `executing-plans` | Running an approved plan in a separate session with checkpoints |
| `subagent-driven-development` | Executing a plan with independent parallel tasks in current session |
| `dispatching-parallel-agents` | 2+ tasks that can run simultaneously without shared state |
| `test-driven-development` | **Before writing any implementation code** — Red → Green → Refactor |
| `systematic-debugging` | **Any bug or unexpected behavior** — diagnose root cause before fixing |
| `requesting-code-review` | After completing a feature — verify before merging |
| `receiving-code-review` | When getting review feedback — technical rigor required |
| `using-git-worktrees` | Before feature work needing isolation from current workspace |
| `finishing-a-development-branch` | When implementation is complete — guides merge/PR/cleanup |
| `verification-before-completion` | **Before claiming "done"** — run commands, show output as evidence |
| `writing-skills` | Creating or editing new skills in the plugin system |
| `android-cli` | Android app development, APK deployment, SDK setup |
| `google-workspace` | Google Workspace MCP troubleshooting and best practices |

---

## 💼 Custom Workspace Skills (C:\Users\nimro\.gemini\antigravity\skills\)

| Skill | Description / When to use |
|---|---|
| `conversation-rules` | Strict guidelines for responses (short, direct, business-focused, execution-first) |
| `design-taste-frontend` | Rules for building high-agency frontend UI (calibrated color, responsive layout, motion) |
| `expo-tailwind-setup` | Setup guide for Tailwind CSS v4 in Expo with NativeWind v5 |
| `frontend-dev-guidelines` | Architectural & performance guidelines for senior React/TypeScript dev |
| `google-calendar-automation` | Google Calendar OAuth integration guidelines (bypasses MCP) |
| `google-sheets-automation` | Google Sheets OAuth integration guidelines (bypasses MCP) |
| `klaviyo-automation` | Automating email/SMS campaigns and flows via Composio/Rube MCP |
| `llm-prompt-optimizer` | Optimizing LLM prompts for accuracy and efficiency |
| `marketing-ideas` | 140+ growth and marketing ideas for SaaS/software with scoring system |
| `marketing-psychology` | Applying behavioral science and mental models to marketing choices |
| `minimalist-ui` | Design guidelines for clean, warm-monochrome, flat bento-style layouts |
| `shopify-lead-outreach` | Flow for research, email delivery, and Sheets/CSV logging |
| `ui-patcher` | Guide to patch the Antigravity wrapper (`app.asar`) to add custom features like Quota widget |

---

## 🤖 Subagents (invoked by Antigravity on PC)

| Agent | Role | Handoff |
|---|---|---|
| `research` | Read-only — browses files, web, logs. Cannot edit or run commands. | *"Ask Antigravity to invoke research subagent to [task]"* |
| `self` | Full capability — inherits all tools, handles complex multi-step tasks in separate context. | *"Ask Antigravity to invoke self subagent to [task]"* |

---

## 📁 Active Projects

All projects under `C:\Users\nimro\.gemini\antigravity\scratch\`

| Project | Stack | Purpose |
|---|---|---|
| `antigravity-dashboard` | Next.js + Google Sheets/Gmail API | Outreach analytics dashboard with live lead data |
| `klaviyo-agency` | Markdown templates | Klaviyo flow architecture, email copy, outreach templates |
| `fashion-pattern-helper` | Vanilla JS + HTML/CSS | Fashion pattern generation web tool |
| `ruthless-chess-coach` | Vite + React | Chess coaching web app |
| `antigravity-context` | Markdown repo | Context sync repo — pushed to `github.com/nimrod-zylobot/antigravity-context` |

---

## 🛠️ Automation Scripts

All run from `C:\Users\nimro\.gemini\antigravity\scratch\`

| Script | What it does | Command |
|---|---|---|
| `automate_outreach.js` | Full pipeline: scrape Shopify targets, find emails, send Gmail pitches, log to Sheets | `node automate_outreach.js` |
| `google_sheets_helper.js` | Read/search/update Google Sheets (`Shopify Leads` tracker) | `node google_sheets_helper.js search "Shopify Leads"` |
| `check_replies.js` | Find Gmail replies from outreach threads | `node check_replies.js` |
| `fetch_gmail_today.js` | Fetch today's full Gmail inbox | `node fetch_gmail_today.js` |
| `count_status.js` | Count leads per status in the sheet | `node count_status.js` |
| `verify_email.js` | Validate an email before sending | `node verify_email.js [email]` |
| `update_lead_row.js` | Update a specific lead row in the sheet | `node update_lead_row.js` |
| `sync_git_context.js` | Sync active session files to GitHub context repo | `node sync_git_context.js` |

---

## ⚡ Power Commands (respond immediately, no preamble)

| Trigger | Action |
|---|---|
| `@outreach` | `node automate_outreach.js` |
| `@replies` | `node check_replies.js` |
| `@count` | `node count_status.js` |
| `@sheet-read` | `node google_sheets_helper.js search "Shopify Leads"` |
| `@sheet-update [brand] [status]` | Give exact `google_sheets_helper.js update` command |
| `@draft-email [brand] [name]` | Write personalized cold outreach email |
| `@draft-followup [brand]` | Write 5–7 day follow-up email |
| `@klaviyo-pitch [brand]` | Write Klaviyo agency pitch tailored to that brand |
| `@plan [task]` | Write full phased implementation plan before any code |
| `@debug [issue]` | Diagnose root cause before proposing fix |
| `@sync` | Tell Nimrod: run `node sync_git_context.js` |

---

## 📐 Engineering Standards (always follow)

1. **Plan before code** — phased plan (API/DB → Logic → UI → Verification), get approval first
2. **TDD** — write failing tests before implementation (Red → Green → Refactor)
3. **No full-file rewrites** — targeted diffs or replacement blocks only
4. **Verify before done** — run build/test commands, show actual output
5. **Windows/PowerShell** — use `;` not `&&`, backslash paths
6. **Modern UI** — HSL palettes, dark modes, glassmorphism, Google Fonts, micro-animations, responsive flex/grid
