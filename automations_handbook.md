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
  2. Fetches all leads from the Shopify Leads tracker and filters for status `Contacted`.
  3. Sends **Follow-up 1** if ≥ 2 days have passed since initial contact and no follow-up has been sent yet.
  4. Sends **Follow-up 2** if ≥ 3 days have passed since Follow-up 1 and no second follow-up has been sent.
  5. Skips any lead with status `Replied`. Verifies each email via MX lookup before sending.
  6. Uses `lead_details_override.json` for contact resolution and addresses recipients by first name.
* **When it is useful:** Run daily (or when prompted) to keep outreach threads warm and convert contacted leads without manual effort.
* **Triggers:**
  - Dry-run (no emails sent, no sheet updates): `node followup_automation.js`
  - Execute (sends emails + updates sheet): `node followup_automation.js --send`
  - With mock date for testing: `node followup_automation.js --date=2026-06-05 --send`

---

## 8. Lead Enrichment Automation (`enrich_lead.js`)

* **What it does:** Automates the process of adding new leads to the Shopify Leads sheet. Given a store URL/domain and an owner's name, it crawls the website for storefront details, generates business email permutations, verifies them, and inserts the complete data row with automated niche classification and safety status flags.
* **How it works:**
  1. Scrapes the website storefront HTML first to extract:
     - **Store Name**: Cleaned brand name decoded from `<title>` and matched against the domain.
     - **Review App**: Pattern match for Judge.me, Loox, Yotpo, Stamped.io, etc.
     - **Free Shipping Threshold**: Regex match against announcement bar/cart text.
     - **Instagram Handle**: Extracted from social links.
     - **Niche**: Keyword-based classification into scannable categories (e.g. `Skincare`, `Hair Care`, `Apparel`).
     - **Storefront Emails**: Collects direct emails (like `info@` or `customercare@`) published on the homepage.
  2. Generates standard owner email permutations (`first@domain`, `first.last@domain`, etc.).
  3. Verifies email permutations sequentially using SMTP validation checks via the `verify_email.js` upgrade. If the domain is a catch-all (accept-all), the script flags the lead status and email status as `Unverified` to protect the sender's reputation.
  4. If owner email permutations cannot be verified, it automatically falls back to testing and using the first email address scraped directly from the storefront HTML.
  5. Appends the lead row (A-M) to the first empty row of the Google Sheet, leaving `Date Contacted` empty to be updated only when outreach occurs.
* **When it is useful:** Ingesting new leads into the outreach pipeline with minimal manual scraping and verification effort.
* **Trigger:**
  - `node enrich_lead.js --store="<store domain>" --name="<owner name>"`
