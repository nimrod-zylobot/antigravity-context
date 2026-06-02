# Walkthrough: Lead Enrichment Script (enrich_lead.js)

We have successfully implemented and verified the lead enrichment CLI script `enrich_lead.js` inside the scratch directory.

## Changes Made

1. **Created `enrich_lead.js`**:
   - Implemented manual parsing of `--store` and `--name` arguments.
   - Generated business email permutations in the specified order:
     1. `first@domain`
     2. `first.last@domain`
     3. `f.last@domain`
     4. `firstl@domain`
     5. `last.first@domain`
   - Verified permutations sequentially via [verify_email.js](file:///C:/Users/nimro/.gemini/antigravity/scratch/verify_email.js) using the new catch-all detection + SMTP verification API check, with local MX lookup as a robust fallback.
   - Fetched store HTML with a browser-like User-Agent and a 10s timeout.
   - Scraped store characteristics:
     - **Store Name**: Decodes HTML entities and intelligently identifies the clean brand name (e.g. `"Brillare"`) by comparing split parts against the domain name, fallback to capitalized domain name.
     - **Review App**: Pattern match for Judge.me, Loox, Yotpo, Stamped.io, Okendo, or Shopify Product Reviews.
     - **Free Shipping Threshold**: Scans stripped HTML for shipping rules (e.g. `₹999+`).
     - **Instagram Handle**: Extracted from store links (excluding post/story/reel paths).
     - **Niche**: Keyword-based classification into scannable categories (e.g. `Skincare`, `Hair Care`, `Apparel`).
     - **Storefront Emails**: Scrapes valid business emails (e.g. `customercare@brillarescience.com`) directly from the storefront HTML, filtering out media files and platform domains.
   - **Storefront Email Fallback**: Reordered script execution to scrape the HTML first. If all generated owner name email permutations are unverified (due to SMTP ping failures or domain catch-all behavior), the script automatically falls back to testing and using the first email address scraped directly from the storefront HTML, writing it to the Email column.
   - **Date Contacted Behavior**: Left Column F (`Date Contacted`) completely empty (`""`) when adding new leads, as that column is meant to be updated only by `automate_outreach.js` when emails are actually sent.
   - Integrated with Google Sheets API:
     - Found the first empty row in `Leads!A4:M300` (defined by having both blank Store Name and Store URL).
     - Appended the lead including `№`, `Store Name`, `Store URL`, `Owner Name`, `Email`, `Date Contacted` (empty `""`), `Status` (`Not Contacted` if verified, `Unverified` if not), `Notes` (containing scraped metadata), `Niche`, and `Email Status` (`Verified` or `Unverified`).
     - Automatically updated sheet headers for columns L (`Niche`) and M (`Email Status`) on Row 3 if not present.
   - Formatted CLI logging using ANSI colors.

2. **Upgraded `verify_email.js`**:
   - Integrated `https://rapid-email-verifier.fly.dev/api/validate` to perform actual mailbox-existence checking.
   - Added **Catch-All Detection**: Sends a random test address (e.g., `nonexistent_test_123@domain`) before testing target email address permutations.
   - If the domain accepts the random test address (indicating it is an "accept-all" or catch-all server, like GoDaddy or Google Workspace), the verifier flags the domain as catch-all. In this case, programmatic SMTP verification cannot reliably identify whether a mailbox exists, so it fails the validation, forcing the lead status to `"Unverified"` so you can manually check it before sending.
   - Preserves local MX record check as a fallback if the API is down or rate-limited.

3. **Added Design Documentation**:
   - Created [2026-06-02-enrich-lead-design.md](file:///C:/Users/nimro/.gemini/antigravity/scratch/docs/superpowers/specs/2026-06-02-enrich-lead-design.md) spec.
   - Created [2026-06-02-enrich-lead.md](file:///C:/Users/nimro/.gemini/antigravity/scratch/docs/superpowers/plans/2026-06-02-enrich-lead.md) implementation plan.

---

## Verification & Validation Results

### CLI Run Output (Testing storefront email fallback)
Running `node enrich_lead.js --store="brillare.co.in" --name="Jigar Patel"` produced the following console log:

```text
Starting enrichment for Lead: Name="Jigar Patel", Store="brillare.co.in"...
Scraping website HTML from https://brillare.co.in...
Scraped emails from website HTML: [ customercare@brillarescience.com ]
Verifying email permutation: jigar@brillare.co.in...
Verifying MX records for domain: brillare.co.in...
Checking control email to detect catch-all: nonexistent_test_428880@brillare.co.in...
Domain brillare.co.in catch-all status: ACTIVE
Verifying email permutation: jigar.patel@brillare.co.in...
Verifying MX records for domain: brillare.co.in...
Verifying email permutation: j.patel@brillare.co.in...
Verifying MX records for domain: brillare.co.in...
Verifying email permutation: jigarp@brillare.co.in...
Verifying MX records for domain: brillare.co.in...
Verifying email permutation: patel.jigar@brillare.co.in...
Verifying MX records for domain: brillare.co.in...
Owner email unverified. Testing storefront scraped email fallback: customercare@brillarescience.com...
Verifying MX records for domain: brillarescience.com...
Checking control email to detect catch-all: nonexistent_test_191525@brillarescience.com...
Domain brillarescience.com catch-all status: ACTIVE
Storefront email catch-all or unverified (using anyway): customercare@brillarescience.com
Authenticating and writing lead to Google Sheet...

Enrichment Summary:
✓ Email found: customercare@brillarescience.com
✓ Review app: Stamped.io
✓ Free shipping: Not found
✓ Niche: Skincare
✓ Lead added to sheet — Row 81
⚠ Email unverified — fallback used.
```

### Reversion to Owner Permutation Fallback

Following user feedback, the storefront fallback change was reverted. If all email permutations for an owner fail verification (or if the domain is a catch-all), the script falls back to the **first generated owner name permutation** (e.g. `vinay@soch.com` for Soch / Vinay Chatlani, and `jigar@brillare.co.in` for Brillare / Jigar Patel) and flags it as `Unverified`.

We have also updated Row 81 for Brillare in the Google Sheet to use `jigar@brillare.co.in` and removed the temporary override from `lead_details_override.json` to ensure clean execution.

### Outreach Script Verification with Manual Target Override

We updated `automate_outreach.js` so that when a user manually targets a specific row (e.g. `--row=81` or `--row=82`), the script prints a warning for verification failures (such as catch-all domains) but **bypasses the skip check** so the user can manually decide whether to send or draft the email.

Running `node automate_outreach.js --row=82` (Soch, catch-all) successfully generated the draft:
```text
Starting automated outreach script (Mode: DRAFT ONLY)...

========================================
Targeting Row 82: Soch (soch.com)
Researching https://soch.com...
Verifying MX records for domain: soch.com...
Checking control email to detect catch-all: nonexistent_test_99620@soch.com...
Domain soch.com catch-all status: ACTIVE

Verification FAILED for vinay@soch.com: Domain is catch-all (mailbox existence cannot be verified remotely)
Bypassing verification failure because row 82 is manually targeted.

----------------------------------------
Draft for vinay@soch.com (Salutation: Vinay):
Subject: lost checkouts at Soch?
Body:
Hi Vinay,
...
Draft saved to: C:\Users\nimro\.gemini\antigravity\scratch\email_body_soch_vinay.txt
```

Running `node automate_outreach.js --row=81` (Brillare, catch-all) also successfully generated the draft using `jigar@brillare.co.in`:
```text
Starting automated outreach script (Mode: DRAFT ONLY)...

========================================
Targeting Row 81: Brillare (brillare.co.in)
Researching https://brillare.co.in...
Verifying MX records for domain: brillare.co.in...
Checking control email to detect catch-all: nonexistent_test_344659@brillare.co.in...
Domain brillare.co.in catch-all status: ACTIVE

Verification FAILED for jigar@brillare.co.in: Domain is catch-all (mailbox existence cannot be verified remotely)
Bypassing verification failure because row 81 is manually targeted.

----------------------------------------
Draft for jigar@brillare.co.in (Salutation: Jigar):
...
Draft saved to: C:\Users\nimro\.gemini\antigravity\scratch\email_body_brillare_jigar.txt
```

### Google Sheet Verification
Reading `Leads!A81:M81` and `Leads!A82:M82` confirms the correct values:
- **№**: `78` / `79`
- **Store Name**: `Brillare` / `Soch`
- **Store URL**: `brillare.co.in` / `soch.com`
- **Owner Name**: `Jigar Patel` / `Vinay Chatlani`
- **Email**: `jigar@brillare.co.in` / `vinay@soch.com`
- **Date Contacted**: `""` (Empty, waiting for outreach automation)
- **Status**: `Unverified`
- **Notes**: `Review App: Stamped.io | Free Shipping: Not found | ...`
- **Niche**: `Skincare` / `Apparel`
- **Email Status**: `Unverified`

