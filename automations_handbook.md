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


---

## ⚠️ NEW — `analyze_quota_windows.js` (3.4 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node analyze_quota_windows.js`

---

## ⚠️ NEW — `bootstrap_clean.js` (19.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node bootstrap_clean.js`

---

## ⚠️ NEW — `check_all_endpoints.js` (4.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_all_endpoints.js`

---

## ⚠️ NEW — `check_app_config.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_app_config.js`

---

## ⚠️ NEW — `check_myvarni_bounces.js` (2.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_myvarni_bounces.js`

---

## ⚠️ NEW — `check_myvarni_inbox.js` (2.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_myvarni_inbox.js`

---

## ⚠️ NEW — `check_myvarni_sent.js` (2.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_myvarni_sent.js`

---

## ⚠️ NEW — `check_navneet_direct.js` (2.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_navneet_direct.js`

---

## ⚠️ NEW — `check_script_tags.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_script_tags.js`

---

## ⚠️ NEW — `check_sheet_staghead.js` (1.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_sheet_staghead.js`

---

## ⚠️ NEW — `check_skeyndor.js` (2.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node check_skeyndor.js`

---

## ⚠️ NEW — `click_and_query.js` (2.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node click_and_query.js`

---

## ⚠️ NEW — `count_leads.js` (2.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node count_leads.js`

---

## ⚠️ NEW — `debug_widget.js` (1.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node debug_widget.js`

---

## ⚠️ NEW — `debug_widget2.js` (2.5 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node debug_widget2.js`

---

## ⚠️ NEW — `delete_files.js` (1.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node delete_files.js`

---

## ⚠️ NEW — `diagnose_api.js` (2.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node diagnose_api.js`

---

## ⚠️ NEW — `direct_check.js` (0.4 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node direct_check.js`

---

## ⚠️ NEW — `download_frontend_skills.js` (1.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node download_frontend_skills.js`

---

## ⚠️ NEW — `download_minimalist.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node download_minimalist.js`

---

## ⚠️ NEW — `download_optimizer.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node download_optimizer.js`

---

## ⚠️ NEW — `download_skill.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node download_skill.js`

---

## ⚠️ NEW — `download_skills.js` (1.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node download_skills.js`

---

## ⚠️ NEW — `dump_full_quota.js` (4.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node dump_full_quota.js`

---

## ⚠️ NEW — `dump_models_page.js` (2.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node dump_models_page.js`

---

## ⚠️ NEW — `fetch_models_debug.js` (2.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node fetch_models_debug.js`

---

## ⚠️ NEW — `fetch_models_direct.js` (1.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node fetch_models_direct.js`

---

## ⚠️ NEW — `fetch_repo.js` (0.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node fetch_repo.js`

---

## ⚠️ NEW — `find_5h_quota.js` (4.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_5h_quota.js`

---

## ⚠️ NEW — `find_button_grandparent.js` (2.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_button_grandparent.js`

---

## ⚠️ NEW — `find_button_parent.js` (2.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_button_parent.js`

---

## ⚠️ NEW — `find_emails.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_emails.js`

---

## ⚠️ NEW — `find_mcp.js` (1.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_mcp.js`

---

## ⚠️ NEW — `find_session_quota.js` (3.5 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_session_quota.js`

---

## ⚠️ NEW — `find_settings.js` (1.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_settings.js`

---

## ⚠️ NEW — `find_targets.js` (0.5 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_targets.js`

---

## ⚠️ NEW — `find_targets_auto.js` (0.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_targets_auto.js`

---

## ⚠️ NEW — `find_zivi_founder.js` (1.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_zivi_founder.js`

---

## ⚠️ NEW — `find_zivi_socials.js` (0.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node find_zivi_socials.js`

---

## ⚠️ NEW — `generate_payload.js` (1.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node generate_payload.js`

---

## ⚠️ NEW — `get_bounce_detail.js` (2.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node get_bounce_detail.js`

---

## ⚠️ NEW — `get_console_logs.js` (1.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node get_console_logs.js`

---

## ⚠️ NEW — `get_obsidian_download_url.js` (0.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node get_obsidian_download_url.js`

---

## ⚠️ NEW — `get_rosalique_info.js` (1.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node get_rosalique_info.js`

---

## ⚠️ NEW — `get_skills_list.js` (0.5 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node get_skills_list.js`

---

## ⚠️ NEW — `get_youtube_transcript.js` (1.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node get_youtube_transcript.js`

---

## ⚠️ NEW — `inspect_myvarni_delay.js` (1.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node inspect_myvarni_delay.js`

---

## ⚠️ NEW — `intercept_all_requests.js` (2.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node intercept_all_requests.js`

---

## ⚠️ NEW — `intercept_headers.js` (1.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node intercept_headers.js`

---

## ⚠️ NEW — `intercept_request_body.js` (1.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node intercept_request_body.js`

---

## ⚠️ NEW — `list_bounces.js` (2.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node list_bounces.js`

---

## ⚠️ NEW — `live_quota_inspector.js` (4.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node live_quota_inspector.js`

---

## ⚠️ NEW — `print_headers.js` (1.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node print_headers.js`

---

## ⚠️ NEW — `query_all_models.js` (2.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_all_models.js`

---

## ⚠️ NEW — `query_buttons.js` (1.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_buttons.js`

---

## ⚠️ NEW — `query_current_quota.js` (2.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_current_quota.js`

---

## ⚠️ NEW — `query_dom.js` (2.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_dom.js`

---

## ⚠️ NEW — `query_modal_html.js` (1.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_modal_html.js`

---

## ⚠️ NEW — `query_models.js` (2.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_models.js`

---

## ⚠️ NEW — `query_models_active.js` (1.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_models_active.js`

---

## ⚠️ NEW — `query_storage.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_storage.js`

---

## ⚠️ NEW — `query_usage_details.js` (2.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_usage_details.js`

---

## ⚠️ NEW — `query_window.js` (1.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node query_window.js`

---

## ⚠️ NEW — `read_calendar.js` (2.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node read_calendar.js`

---

## ⚠️ NEW — `read_drive.js` (1.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node read_drive.js`

---

## ⚠️ NEW — `read_readme.js` (0.4 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node read_readme.js`

---

## ⚠️ NEW — `read_sheet_structure.js` (1.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node read_sheet_structure.js`

---

## ⚠️ NEW — `read_skill_details.js` (1.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node read_skill_details.js`

---

## ⚠️ NEW — `repair_obsidian_links.js` (3.4 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node repair_obsidian_links.js`

---

## ⚠️ NEW — `research_kiikio.js` (1.4 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node research_kiikio.js`

---

## ⚠️ NEW — `research_lespetits.js` (1.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node research_lespetits.js`

---

## ⚠️ NEW — `research_lespetits_direct.js` (1.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node research_lespetits_direct.js`

---

## ⚠️ NEW — `research_qomfort.js` (1.0 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node research_qomfort.js`

---

## ⚠️ NEW — `research_ruchira.js` (1.1 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node research_ruchira.js`

---

## ⚠️ NEW — `research_zivi.js` (1.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node research_zivi.js`

---

## ⚠️ NEW — `run_create_next.js` (0.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node run_create_next.js`

---

## ⚠️ NEW — `search_awesome_skills.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node search_awesome_skills.js`

---

## ⚠️ NEW — `search_composio_skills.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node search_composio_skills.js`

---

## ⚠️ NEW — `search_frontend_skills.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node search_frontend_skills.js`

---

## ⚠️ NEW — `search_prompt_skills.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node search_prompt_skills.js`

---

## ⚠️ NEW — `search_security_skills.js` (0.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node search_security_skills.js`

---

## ⚠️ NEW — `search_shopify_skills.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node search_shopify_skills.js`

---

## ⚠️ NEW — `setup_obsidian_vault.js` (13.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node setup_obsidian_vault.js`

---

## ⚠️ NEW — `sync_context.js` (5.2 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node sync_context.js`

---

## ⚠️ NEW — `test_doh.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node test_doh.js`

---

## ⚠️ NEW — `test_github.js` (0.7 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node test_github.js`

---

## ⚠️ NEW — `test_query.js` (1.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node test_query.js`

---

## ⚠️ NEW — `test_timedtext.js` (0.6 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node test_timedtext.js`

---

## ⚠️ NEW — `test_widget_eval.js` (2.8 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node test_widget_eval.js`

---

## ⚠️ NEW — `test_workspace.js` (4.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node test_workspace.js`

---

## ⚠️ NEW — `verify_lines.js` (0.3 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node verify_lines.js`

---

## ⚠️ NEW — `youtube_helper.js` (3.9 KB)

> Auto-detected on 2026-06-01. Update this section with:
> - What it does
> - How it works
> - When to use it
> - Trigger command

**Trigger:** `node youtube_helper.js`

---

