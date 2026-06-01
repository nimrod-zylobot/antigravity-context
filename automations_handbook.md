# 🛠️ Business Automations Handbook

This directory serves as the functional design and operations guide for the automation scripts running in Nimrod's PC workspace. These scripts are run to crawl leads, perform custom research, execute cold outreach campaigns, and check incoming replies.

---

## 1. Outreach Automation Engine (`automate_outreach.js`)
* **What it does:** Scrapes Shopify targets to find active review apps (Judge.me, Loox, Yotpo, etc.), crawls for relevant direct emails, performs verification lookups, drafts short-form outreach copy, sends pitches via Gmail, and writes the contacted leads to Google Sheets and local offline CSV trackers.
* **How it works:**
  1. Resolves authorization token for `nimrod@zylobot.com`.
  2. Fetches target website HTML to search for specific scripts/classes mapping to review apps (e.g. `/judge\.me|judgeme/i`).
  3. Scrapes raw email addresses, filtering out media files and general platform footprints (excludes `@shopify.com`, `@loox.io`, etc.).
  4. Prefers direct owner/founder emails over generic addresses (info@, support@).
  5. Interacts with the Google Sheets API to append email coordinates, status "Contacted", date stamps, and custom notes.
* **When it is useful:** Whenever Nimrod researches new targets on his sheet and wants to execute outreach templates at scale.
* **Trigger Command:** `node automate_outreach.js` (Optional params for target domain filtering).

---

## 2. Google Sheets API Helper (`google_sheets_helper.js`)
* **What it does:** Performs robust standalone spreadsheet operations (search, read, update) using secure Google Sheets REST endpoints.
* **How it works:** 
  - Authenticates via local OAuth2 profile.
  - Exposes actions like `search` (looks for spreadsheets matching a name), `get` (retrieves sheet metadata), `read` (grabs values in a range), and `update` (writes JSON values to a cell range).
* **When it is useful:** Useful when checking current outreach status parameters, adding new columns, or doing one-off queries of the Shopify Leads tracker.
* **Trigger Commands:**
  - Search: `node google_sheets_helper.js search "Shopify Leads"`
  - Read: `node google_sheets_helper.js read "<spreadsheetId>" "Leads!A4:K100"`
  - Update: `node google_sheets_helper.js update "<spreadsheetId>" "Leads!F4" "[[ \"Contacted\", \"2026-06-01\" ]]"`

---

## 3. Real-Time Gmail Tracker (`fetch_gmail_today.js` / `check_replies.js`)
* **What it does:** Queries Nimrod's Gmail inbox for daily incoming mail and parses email headers to locate responses from active cold-outreach threads.
* **How it works:**
  - Connects to Gmail API and list messages query filtering on: `in:inbox after:YYYY/MM/DD` or specific thread criteria.
  - Decodes base64 HTML/Text payloads and extracts metadata (From, Subject, Date, Snippet).
  - Truncates raw text to filter out long duplicate signatures and styles.
* **When it is useful:** Run continuously to find if store founders have replied to pitches, so we can update their status to "replied" on the sheet tracker immediately.
* **Trigger Command:** `node fetch_gmail_today.js`

---

## 4. Email Validator (`verify_email.js`)
* **What it does:** Validates syntax and filters out spam configurations of scraped email targets before executing GMail pitches, protecting the sender reputation of `nimrod@zylobot.com`.
* **When it is useful:** Automatically triggered internally by `automate_outreach.js` during the campaign loop.
