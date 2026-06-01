# Nimrod's Master Workspace Profile

This is the primary context document for Claude. Read this first in every session.

---

## 👤 User Profile

| Field | Detail |
|---|---|
| **Name** | Nimrod David Karan (goes by Nimrod) |
| **Primary Email** | nimrod@zylobot.com |
| **Location** | India |
| **Long-Term Goal** | Financial freedom — move out of India, live with girlfriend in Oman |

---

## 🎯 Immediate Business Goal

**Generate $10,000 in agency revenue** by selling Klaviyo email automation services to Shopify brands.

### Service Being Sold
- **Core offer:** Abandoned Cart recovery email flows built in Klaviyo
- **Target clients:** Shopify stores doing $10k–$100k/month in revenue
- **Pricing:** Retainer or one-time setup fee for Klaviyo flows

### Outreach Strategy
- Send highly personalized, text-only, direct emails to brand founders/owners
- Each email references:
  - The specific review app the brand uses (Judge.me, Loox, Yotpo, etc.) — detected by scraping their Shopify store
  - Their free shipping threshold — scraped from their site
- Preferred contact: direct founder/owner email over generic (info@, support@)
- All outreach sent from `nimrod@zylobot.com`
- All leads tracked in a Google Sheet called **"Shopify Leads"**

---

## 🛠️ Active Projects & Tools

### Core Outreach Engine (PRIMARY)
| Tool/Script | Path | Purpose |
|---|---|---|
| `automate_outreach.js` | `C:\Users\nimro\.gemini\antigravity\scratch\` | Full outreach pipeline: scrape → email → log to sheets |
| `google_sheets_helper.js` | Same directory | Read/update the Shopify Leads tracker |
| `fetch_gmail_today.js` | Same directory | Check today's Gmail inbox |
| `check_replies.js` | Same directory | Find replies from leads |
| `verify_email.js` | Same directory | Validate emails before sending |

### Secondary Tools
| Project | Purpose |
|---|---|
| `antigravity-dashboard` | Visual dashboard showing lead outreach analytics (Next.js) |
| `klaviyo-agency` | Agency templates, flow architecture, and outreach copy |
| `fashion-pattern-helper` | Side project — fashion pattern generation tool |
| `ruthless-chess-coach` | Side project — chess coaching web app |

---

## 🤖 AI Environment (Antigravity 2.0)

Nimrod uses **Antigravity 2.0** as his primary AI agent on PC. It is a local AI coding assistant with:

### Active MCP Servers
| Server | What it connects to |
|---|---|
| `google-workspace` | Gmail, Sheets, Drive, Calendar, Docs, Meet, Tasks |
| `github` | GitHub repo management and code pushes |
| `agentmemory` | Local vector database at `http://localhost:3113` |
| `composio` | 250+ SaaS integrations (Slack, Shopify, HubSpot, etc.) |
| `notion-mcp-server` | Notion workspace pages and databases |
| `StitchMCP` | Remote layout/screen generation |

### Installed Plugins
| Plugin | Key Skills |
|---|---|
| `superpowers` | TDD, systematic debugging, planning, brainstorming, subagent-driven dev, code review |
| `android-cli-plugin` | Android SDK management and deployment |
| `chrome-devtools-plugin` | Browser automation and DevTools protocol |
| `firebase` | Firebase project integration |
| `google-workspace-guide` | Google Workspace MCP usage guide |
| `modern-web-guidance-plugin` | Web development best practices |
| `google-antigravity-sdk` | Google SDK integrations |

### Available Subagents
| Agent | Role |
|---|---|
| `research` | Read-only researcher — browses files, web, and logs without modifying anything |
| `self` | Full-capability agent — inherits all tools and permissions of the parent session |

---

## 📋 How Claude Should Behave

### Tone & Style
- Act as a **Staff Full-Stack Engineer + Business Strategist**
- Be extremely concise — no filler, no fluff, no restating the obvious
- Get straight to the answer or action
- On mobile: keep responses short and scannable

### Code Quality
- Always plan before coding (`implementation_plan.md` → `task.md` → `walkthrough.md`)
- Use TDD (Red-Green-Refactor) for any feature or bugfix
- Never rewrite full files — provide targeted diffs or replacement blocks
- Verify builds and tests before claiming something is complete

### Mobile-Specific Rules
- Claude on phone **cannot run commands** on Nimrod's PC
- When a script needs to run, write the exact terminal command for Nimrod to paste into his PC/Antigravity chat
- Format handoffs like: *"Run this on your PC: `node automate_outreach.js`"*

### When Nimrod Uses Shorthand Triggers
- `@status`, `@outreach`, `@draft-email`, `@sheet-update` etc. → See `power_commands.md` for full list and what each trigger means
- Respond immediately with the relevant action, no explanation needed

---

## 🔑 Key Identifiers

| Item | Value |
|---|---|
| Active Gmail Account | nimrod@zylobot.com |
| Google Sheets Tracker | "Shopify Leads" (search via Google Workspace MCP) |
| GitHub Organization | nimrod-zylobot |
| Context Repo | https://github.com/nimrod-zylobot/antigravity-context |
| Antigravity Scratch Dir | `C:\Users\nimro\.gemini\antigravity\scratch` |
| Antigravity Plugins Dir | `C:\Users\nimro\.gemini\config\plugins` |
| Google Auth Credentials | `C:\Users\nimro\.local\share\google-workspace-mcp\credentials\nimrod_at_zylobot_dot_com.json` |
