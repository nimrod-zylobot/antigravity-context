# ⚡ Power Commands & Trigger Shorthand

Use these shorthand triggers when chatting with Claude (on phone or desktop) to get fast, precise responses without needing to explain full context.

---

## 🔁 Automation Triggers

| Command | What it does |
|---|---|
| `@outreach` | Run the Shopify outreach automation on the PC. Claude will give you the exact terminal command to execute. |
| `@replies` | Check Gmail inbox for replies from cold-outreach leads. Outputs today's replies from Shopify founders. |
| `@validate [email]` | Validate a specific email before pitching it. |
| `@sheet-read` | Read the current state of the Shopify Leads tracker Google Sheet. |
| `@sheet-update [brand] [status]` | Update a lead's status on the sheet (e.g. `@sheet-update Brillare Replied`). |
| `@count` | Count how many leads are in each status (Contacted, Replied, Not Contacted, etc.) |

---

## 🧠 Context & Status Triggers

| Command | What it does |
|---|---|
| `@status` | Summarize current active tasks from the checklist and what's in progress. |
| `@projects` | List all current projects with their paths and what they do. |
| `@agents` | List all available Antigravity subagents and when to use each. |
| `@mcps` | List all MCP servers and their trigger tools. |
| `@plugins` | List all installed plugins and skills. |
| `@sync` | Tell Claude to instruct you on running the context sync script to update the GitHub repo. |

---

## ✍️ Drafting Triggers

| Command | What it does |
|---|---|
| `@draft-email [brand] [founder name]` | Draft a cold-outreach email for a specific Shopify brand and founder using your template style. |
| `@draft-followup [brand]` | Draft a follow-up email for a brand that hasn't replied within 5–7 days. |
| `@draft-reply [brand] [context]` | Draft a reply to an interested lead, continuing from their message. |
| `@klaviyo-pitch [brand]` | Generate a Klaviyo agency services pitch tailored to a specific brand's niche. |

---

## 🔧 Antigravity System Triggers

| Command | What it does |
|---|---|
| `@logs` | Tell Claude where to find the latest conversation transcript and task logs. |
| `@plan [task]` | Ask Claude to write a full implementation plan for a new feature or task before touching code. |
| `@debug [issue]` | Trigger systematic debugging mode — Claude will diagnose before proposing fixes. |
| `@tdd [feature]` | Trigger test-driven development mode for a new feature. |
| `@subagent [task]` | Ask Claude to spin up a subagent for a parallel background task. |

---

## 📌 How to Use These

Just type the trigger in your Claude chat message (on phone or desktop):

> `@outreach` → Claude immediately gives you the command to run  
> `@draft-email Brillare Jigar` → Claude writes the full personalized pitch  
> `@status` → Claude tells you what tasks are active right now

No need for long explanations — Claude will recognize the trigger from this document and respond with the relevant action.
