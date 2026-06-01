# Nimrod's Workspace Knowledge & Project Context (Antigravity Bridge)

This document aggregates the essential background context, business objectives, tools, and configurations running on Nimrod's PC. It serves as the master reference sheet for any Claude session.

---

## 👤 User Profile & Long-Term Goals
- **Name:** Nimrod David Karan (Preferred: Nimrod)
- **Email:** nimrod@zylobot.com
- **Immediate Goal:** Generate $10,000 in revenue by setting up and selling automated email flows (mainly Abandoned Cart recovery sequences) to e-commerce brands using Klaviyo.
- **Outreach Focus:** Shopify stores generating $10k–$100k/month in revenue.
- **Cold Outreach Strategy:** Send highly personalized, text-only, call-focused emails. Direct emails are customized to mention the specific reviews app they use (e.g. Judge.me, Loox) and their free shipping thresholds to establish trust.
- **Long-Term Vision:** Build digital assets, own and run personal Shopify stores, and achieve financial freedom to move out of India and live with his girlfriend in Oman.

---

## 🛠️ Project Ecosystem & Codebases

## Active Business & Project Focus
Nimrod's main focus is **building automations that directly assist his e-commerce agency business**:
- Scraper and research scripts to find active Shopify store owners.
- Cold outreach automation (Gmail and sheets integration) to speed up pitch delivery.
- Designing high-converting Klaviyo sequences (abandoned cart flows) to sell to clients.
- The ultimate goal is client acquisition, closing deals, and driving agency revenue to hit the $10,000 target. Codebases like the dashboard are secondary tools supporting this core outreach engine.

---

## ⚙️ PC Environment & Agent Tools

### 1. Active MCP Servers
- **agentmemory:** Runs a local vector-database using `iii-engine` at `http://localhost:3113`. Keeps track of active session records, notes, and memory queries.
- **google-workspace:** Connects to Calendar, Docs, Drive, Meet, Sheets, Tasks, and Gmail. Uses authorized user profile for `nimrod@zylobot.com`.
- **github:** Allows repository management, commits, issue handling, and pull requests.
- **notion-mcp-server:** API mapping for project tables and documentation.
- **StitchMCP:** Remote workspace endpoint mapping.

### 2. Loaded Custom Plugins & Skills
- **superpowers:** Global agentic instructions framework (TDD, Planning, and Verification methodologies).
- **android-cli:** SDK and platform configuration scripts.
- **chrome-devtools:** Protocol wrappers for browser automation.

---

## 📝 Operating Guidelines for Claude
- **Independent Problem Solving:** Claude should act as a Staff Full-Stack Engineer and Designer. Don't wait for micro-instructions—analyze current errors or UI layout and propose direct improvements.
- **Engineering Quality:** Enforce clean planning (`implementation_plan.md`), task execution lists (`task.md`), and strict build verifications.
- **UI Aesthetics:** Propose HSL tailored palettes, modern dark modes, and crisp flex layout structures when editing front-end files.
- **Handoff Layout:** Format your code blocks with complete file paths so Antigravity (the local agent) can parse and apply the diffs immediately.
