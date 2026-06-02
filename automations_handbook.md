# 🛠️ Business Automations Handbook

This document is the functional guide for the automation scripts running in Nimrod's PC workspace. These scripts handle lead research, cold outreach, Gmail tracking, and Google Sheets updates.

> **How to update this file:** When a new automation script is added, ask Antigravity on PC to document it here with full context — what it does, how it works, when to use it, and the exact trigger command.

---

## 1. Outreach Automation Engine (`automate_outreach.js`)

* **What it does:** Scrapes Shopify targets to find active review apps (Judge.me, Loox, Yotpo, etc.), crawls for relevant direct emails, performs verification lookups, drafts short-form outreach copy, sends pitches via Gmail, and writes the contacted leads to Google Sheets.
* **How it works:**
  1. Resolves OAuth token for `nimrod@zylobot.com`.
  2. Fetches target website HTML to detect review apps (e.g. `/judge\.me|judgeme/i`).
  3. Scrapes raw email addresses, filters out platform footprints (`@shopify.com`, `@loox.io`, etc.).
  4. Prefers direct owner/founder emails over generic addresses (info@, support@).
  5. Appends lead to Google Sheets with status "Contacted", date stamp, and notes.
* **When it is useful:** Whenever Nimrod has new targets on his sheet and wants to run outreach at scale.
* **Trigger:** `node automate_outreach.js`

---

## 2. Google Sheets API Helper (`google_sheets_helper.js`)

* **What it does:** Standalone spreadsheet operations — search, read, and update the Shopify Leads tracker.
* **How it works:**
  - Authenticates via local OAuth2 profile.
  - Exposes `search`, `get`, `read`, and `update` actions against Google Sheets REST endpoints.
* **When it is useful:** Checking outreach status, updating individual lead cells, or doing one-off queries of the tracker.
* **Triggers:**
  - Search: `node google_sheets_helper.js search "Shopify Leads"`
  - Read: `node google_sheets_helper.js read "<spreadsheetId>" "Leads!A4:K100"`
  - Update: `node google_sheets_helper.js update "<spreadsheetId>" "Leads!F4" "[[ \"Contacted\", \"2026-06-01\" ]]"`

---

## 3. Real-Time Gmail Tracker (`fetch_gmail_today.js` / `check_replies.js`)

* **What it does:** Queries Nimrod's Gmail inbox for daily incoming mail and locates responses from active cold-outreach threads.
* **How it works:**
  - Connects to Gmail API with query filter `in:inbox after:YYYY/MM/DD`.
  - Decodes base64 HTML/Text payloads, extracts metadata (From, Subject, Date, Snippet).
  - Strips signatures and styles to produce clean text output.
* **When it is useful:** Run to check if store founders have replied, so their status can be updated to "Replied" on the sheet.
* **Triggers:**
  - `node fetch_gmail_today.js` — all today's inbox
  - `node check_replies.js` — filtered outreach replies only

---

## 4. Lead Counter (`count_status.js`)

* **What it does:** Counts leads grouped by status (Contacted, Replied, Not Contacted, etc.) from the Shopify Leads tracker.
* **When it is useful:** Quick snapshot of pipeline health — how many leads have been touched and how many have responded.
* **Trigger:** `node count_status.js`

---

## 5. Email Validator (`verify_email.js`)

* **What it does:** Validates email syntax and checks spam/bounce signals before sending pitches — protects the sender reputation of `nimrod@zylobot.com`.
* **When it is useful:** Auto-triggered internally by `automate_outreach.js`. Can also be run standalone to validate a single address.
* **Trigger:** `node verify_email.js [email]`

---

## 6. Context Sync (`sync_git_context.js`)

* **What it does:** Regenerates the 4 auto-refresh context files and pushes the `antigravity-context` repo to GitHub.
* **What it updates:** `checklist.md`, `walkthrough.md`, `chat_history.md`, `projects_inventory.md`.
* **What it never touches:** All hand-crafted docs (`README.md`, `master_workspace_profile.md`, `agents_handbook.md`, `automations_handbook.md`, `power_commands.md`, `pc_path_map.md`, `mcp_servers.md`, `installed_plugins.md`, `skills_reference.md`).
* **Trigger:** `node sync_git_context.js`

---

## 7. Follow-up Automation (`followup_automation.js`)

* **What it does:** Scans all Shopify leads with status `Contacted` and automatically sends scheduled follow-up emails via Gmail based on days elapsed since the last contact event. Writes follow-up dates and notes back to the Google Sheet after each send.
* **How it works:**
  1. Resolves OAuth token for `nimrod@zylobot.com` using the same credential file as the outreach engine.
  2. Fetches all rows from `Leads!A1:K100` in the Shopify Leads tracker spreadsheet.
  3. For each lead with status `Contacted`:
     - **Follow-up 1** — if `Follow-up 1` (Col G) is empty AND `Date Contacted` (Col F) was ≥ 2 days ago → sends Follow-up 1 email and writes today's date to Col G.
     - **Follow-up 2** — if `Follow-up 2` (Col H) is empty AND `Follow-up 1` (Col G) date was ≥ 3 days ago → sends Follow-up 2 email and writes today's date to Col H.
  4. Skips any lead where status is `Replied`.
  5. Resolves contacts from `lead_details_override.json` first (same as `automate_outreach.js`), falling back to the raw email in Col E.
  6. Verifies each email via MX record lookup (DNS-over-HTTPS) before sending.
  7. Addresses recipients by first name only. Falls back to `[Store Name] Team` for generic/team email addresses.
* **Email Templates:**
  - *Follow-up 1 Subject:* `Re: lost checkouts at [Store Name]?`
    > Hi [First Name], Just bumping this to see if you had a moment to read my note about Klaviyo checkout recovery for [Store Name]? We build performance-based flows that typically recover an extra 15-20% of abandoned carts. Worth a brief call?
  - *Follow-up 2 Subject:* `Re: lost checkouts at [Store Name]?`
    > Hi [First Name], I know you are busy running [Store Name]. One last quick question: is optimizing checkout recovery a focus for you this quarter, or should I check back later?
* **Sheet Columns Used:**
  | Column | Field | Action |
  |--------|-------|--------|
  | F | Date Contacted | Read — determines eligibility for Follow-up 1 |
  | G | Follow-up 1 | Read (empty = not yet sent); Write (today's date after send) |
  | H | Follow-up 2 | Read (empty = not yet sent); Write (today's date after send) |
  | J | Status | Read — must be `Contacted`; skips `Replied` |
  | K | Notes | Append — logs which follow-up was sent to which email |
* **When it is useful:** Run daily (or when prompted) to keep outreach threads active and warm leads engaged without manual effort.
* **Triggers:**
  - Dry-run (no emails sent, no sheet updates): `node followup_automation.js`
  - Execute (sends emails + updates sheet): `node followup_automation.js --send`
  - With mock date for testing: `node followup_automation.js --date=2026-06-05 --send`
