const fs = require('fs');
const path = require('path');
const { verifyEmail } = require('./verify_email');

const CREDENTIALS_PATH = 'C:\\Users\\nimro\\.local\\share\\google-workspace-mcp\\credentials\\nimrod_at_zylobot_dot_com.json';
const SPREADSHEET_ID = '1Zhu-BGL8u41L0j8WirsV_leh8iQ8COoHkqIBVrSGBBo';

// Helper to get access token
async function getAccessToken() {
    const credential = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: credential.client_id,
            client_secret: credential.client_secret,
            refresh_token: credential.refresh_token,
            grant_type: 'refresh_token',
        }),
    });
    const data = await response.json();
    return data.access_token;
}

// Clean domain to help match
function getCleanDomain(url) {
    let clean = url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '');
    clean = clean.split('/')[0];
    return clean;
}

// Robust helper to check if email is generic team address
function isGenericEmail(email) {
    const genericPrefixes = [
        'info@', 'support@', 'hello@', 'we@', 'contact@', 'help@', 'operations@', 
        'sales@', 'care@', 'customercare@', 'customerfeedback@', 'feedback@', 
        'office@', 'cc@', 'market@', 'marketing@', 'media@', 'press@', 
        'enquiries@', 'admin@', 'service@', 'team@', 'careers@', 'jobs@', 
        'enquiry@', 'partner@', 'partners@', 'collaboration@', 'collaborations@',
        'supplier@', 'suppliers@', 'order@', 'orders@', 'shop@', 'store@',
        'help.tindia@'
    ];
    const emailLower = email.toLowerCase().trim();
    return genericPrefixes.some(pref => emailLower.startsWith(pref));
}

// Fetch homepage HTML & find apps/emails (domain-filtered)
async function researchStore(url) {
    let html = '';
    const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    const cleanDomain = getCleanDomain(url);
    const domainBase = cleanDomain.replace(/^store\./, '');

    try {
        console.log(`Researching ${formattedUrl}...`);
        const res = await fetch(formattedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            signal: AbortSignal.timeout(10000)
        });
        html = await res.text();
    } catch (e) {
        console.log(`Failed to fetch website ${formattedUrl}: ${e.message}`);
    }

    const appPatterns = {
        'Loox': /loox/i,
        'Judge.me': /judge\.me|judgeme/i,
        'Yotpo': /yotpo/i,
        'Stamped.io': /stamped\.io|stamped/i,
        'Okendo': /okendo/i,
        'Shopify Product Reviews': /productreviews/i
    };

    let matchedApp = 'None detected';
    for (const [app, pattern] of Object.entries(appPatterns)) {
        if (pattern.test(html)) {
            matchedApp = app;
            break;
        }
    }

    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const foundEmails = html.match(emailRegex) || [];
    
    const excludeDomains = ['stagheaddesigns.com', 'shopify.com', 'loox.io', 'judgeme.com', 'template.com', 'developer.com'];
    
    const uniqueEmails = [...new Set(foundEmails)].filter(e => {
        const lower = e.toLowerCase();
        const isMedia = lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.gif') || lower.endsWith('.webp');
        if (isMedia) return false;
        
        const emailDomain = lower.split('@')[1];
        const isExcluded = excludeDomains.some(d => emailDomain.includes(d));
        if (isExcluded) return false;

        return emailDomain.includes(domainBase.split('.')[0]); 
    });

    return { matchedApp, emails: uniqueEmails };
}

// Send email using Gmail API
async function sendEmail(token, to, subject, bodyText) {
    const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        bodyText
    ];
    const email = emailLines.join('\r\n');
    const base64Safe = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ raw: base64Safe })
    });

    if (!response.ok) {
        throw new Error(`Gmail API error: ${await response.text()}`);
    }
    return await response.json();
}

// Update Lead Row in Sheet
async function updateRow(token, rowNumber, emailAddress, status, notes) {
    const date = new Date().toISOString().split('T')[0];
    
    // Update Email (Column E)
    const emailRange = `Leads!E${rowNumber}`;
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(emailRange)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [[emailAddress]] })
    });

    // Update F:K (Date, Follow-up 1, Follow-up 2, Follow-up 3, Status, Notes)
    const range = `Leads!F${rowNumber}:K${rowNumber}`;
    const values = [[date, '', '', '', status, notes]];

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
    });
    return await response.json();
}

// Main automation runner
async function main() {
    const args = process.argv.slice(2);
    const shouldSend = args.includes('--send');
    const targetRowArg = args.find(arg => arg.startsWith('--row='));
    const targetRow = targetRowArg ? parseInt(targetRowArg.split('=')[1], 10) : null;

    console.log(`Starting automated outreach script (Mode: ${shouldSend ? 'SEND' : 'DRAFT ONLY'})...`);
    const token = await getAccessToken();

    // Load overrides if any
    let overrides = {};
    const overridePath = path.join(__dirname, 'lead_details_override.json');
    if (fs.existsSync(overridePath)) {
        overrides = JSON.parse(fs.readFileSync(overridePath, 'utf8'));
    }

    // Fetch leads
    const range = 'Leads!A1:K100';
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!data.values) {
        console.error('Failed to read sheet values.');
        return;
    }

    const rows = data.values;
    // Header is row 3 (index 2). Data starts at row 4 (index 3).
    let selectedIndex = -1;

    if (targetRow) {
        selectedIndex = targetRow - 1;
    } else {
        // Find the first uncontacted row
        for (let i = 3; i < rows.length; i++) {
            const status = rows[i][9] ? rows[i][9].trim() : '';
            const storeName = rows[i][1] ? rows[i][1].trim() : '';
            const storeUrl = rows[i][2] ? rows[i][2].trim() : '';
            
            if (!status && storeName && storeUrl) {
                selectedIndex = i;
                break;
            }
        }
    }

    if (selectedIndex === -1 || selectedIndex >= rows.length) {
        console.log('No pending leads found to process.');
        return;
    }

    const rowNum = selectedIndex + 1;
    const row = rows[selectedIndex];
    
    // Extract fields
    const storeName = row[1] ? row[1].trim() : '';
    const storeUrl = row[2] ? row[2].trim() : '';
    const contactInfo = row[3] ? row[3].trim() : '';
    let emailVal = row[4] ? row[4].trim() : '';

    console.log(`\n========================================`);
    console.log(`Targeting Row ${rowNum}: ${storeName} (${storeUrl})`);

    const cleanDomain = getCleanDomain(storeUrl);
    let contacts = [];

    // Build list of target contacts for this store
    if (overrides[cleanDomain]) {
        contacts = Array.isArray(overrides[cleanDomain]) ? overrides[cleanDomain] : [overrides[cleanDomain]];
    } else {
        let emails = [];
        if (emailVal && emailVal.includes('@')) {
            emails = emailVal.split(/[\s,]+/).filter(Boolean);
        }

        let founderNames = [];
        if (contactInfo) {
            if (contactInfo.startsWith('@')) {
                // Social handle: clean it to get the first name (e.g. @prasanna_vasanadu -> Prasanna)
                const namePart = contactInfo.substring(1).split(/[._]+/)[0];
                if (namePart) {
                    const capName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                    founderNames.push(capName);
                }
            } else {
                founderNames = contactInfo.split(/\s+and\s+|,+/i).map(n => n.trim()).filter(Boolean);
            }
        }

        // Scrape webpage if no emails found in sheet
        const research = await researchStore(storeUrl);
        if (emails.length === 0 && research.emails.length > 0) {
            emails = research.emails;
        }

        if (emails.length > 0) {
            emails.forEach((email, index) => {
                contacts.push({
                    email,
                    founderName: founderNames[index] || founderNames[0] || '',
                    app: research.matchedApp
                });
            });
        }
    }

    if (contacts.length === 0) {
        console.log(`WARNING: No contact emails found for ${storeName}. Exiting.`);
        return;
    }

    let sentEmails = [];
    let noteLogs = [];
    let matchedApp = 'None detected';

    for (const contact of contacts) {
        const email = contact.email;
        const founderName = contact.founderName;
        
        // Validate email format and MX records before drafting/sending
        const verification = await verifyEmail(email);
        if (!verification.valid) {
            console.log(`\nVerification FAILED for ${email}: ${verification.reason}`);
            noteLogs.push(`Verification failed for ${email}: ${verification.reason}`);
            continue;
        }

        if (contact.app) {
            matchedApp = contact.app;
        }

        const isGeneric = isGenericEmail(email);

        let subject = `lost checkouts at ${storeName}?`;
        let body = '';

        // Clean founderName to use only the FIRST name
        let salutationName = founderName ? founderName.trim().split(/\s+/)[0] : '';

        // Heuristic: If name is still long/concatenated (e.g. Sahilbansal42) and email prefix is short and matches start, use email prefix
        if (salutationName && !isGeneric) {
            const emailPrefix = email.split('@')[0].replace(/[._0-9]+/g, '').toLowerCase();
            const lowerSalutation = salutationName.toLowerCase();
            if (emailPrefix.length >= 3 && lowerSalutation.startsWith(emailPrefix)) {
                salutationName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
            } else {
                // Strip digits from the end as fallback
                salutationName = salutationName.replace(/\d+$/, '');
            }
        }

        if (salutationName) {
            if (isGeneric) {
                body = `Hi ${storeName} Team,\n\n`;
                body += `Could you please forward this to ${salutationName}?\n\n`;
                body += `I specialize in setting up checkout recovery email flows for e-commerce brands like ${storeName} to win back customers who start checkout but don't complete their purchase. Given that e-commerce brands lose around 70% of their revenue to abandoned carts, I can help you recover 15-20% of that lost revenue.\n\n`;
                body += `I would love to build this recovery system for you completely on a performance basis (meaning if it doesn't recover lost sales for you, you pay nothing).\n\n`;
                body += `Open to a 5-minute call next Tuesday or Wednesday to see if this makes sense?\n\n`;
                body += `Best,\n\n`;
                body += `Nimrod\n\nnimrod@zylobot.com`;
            } else {
                body = `Hi ${salutationName},\n\n`;
                body += `I specialize in setting up checkout recovery email flows for e-commerce brands like ${storeName} to win back customers who start checkout but don't complete their purchase. Given that e-commerce brands lose around 70% of their revenue to abandoned carts, I can help you recover 15-20% of that lost revenue.\n\n`;
                body += `I would love to build this recovery system for you completely on a performance basis (meaning if it doesn't recover lost sales for you, you pay nothing).\n\n`;
                body += `Open to a 5-minute call next Tuesday or Wednesday to see if this makes sense?\n\n`;
                body += `Best,\n\n`;
                body += `Nimrod\n\nnimrod@zylobot.com`;
            }
        } else {
            if (isGeneric) {
                body = `Hi ${storeName} Team,\n\n`;
                body += `Could you please forward this to the Store Owner / Head of E-commerce?\n\n`;
                body += `I specialize in setting up checkout recovery email flows for e-commerce brands like ${storeName} to win back customers who start checkout but don't complete their purchase. Given that e-commerce brands lose around 70% of their revenue to abandoned carts, I can help you recover 15-20% of that lost revenue.\n\n`;
                body += `I would love to build this recovery system for you completely on a performance basis (meaning if it doesn't recover lost sales for you, you pay nothing).\n\n`;
                body += `Open to a 5-minute call next Tuesday or Wednesday to see if this makes sense?\n\n`;
                body += `Best,\n\n`;
                body += `Nimrod\n\nnimrod@zylobot.com`;
            } else {
                body = `Hi ${storeName} Team,\n\n`;
                body += `I specialize in setting up checkout recovery email flows for e-commerce brands like ${storeName} to win back customers who start checkout but don't complete their purchase. Given that e-commerce brands lose around 70% of their revenue to abandoned carts, I can help you recover 15-20% of that lost revenue.\n\n`;
                body += `I would love to build this recovery system for you completely on a performance basis (meaning if it doesn't recover lost sales for you, you pay nothing).\n\n`;
                body += `Open to a 5-minute call next Tuesday or Wednesday to see if this makes sense?\n\n`;
                body += `Best,\n\n`;
                body += `Nimrod\n\nnimrod@zylobot.com`;
            }
        }

        const safeStoreName = storeName.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const safeFounder = salutationName ? `_${salutationName.toLowerCase()}` : '';
        const draftPath = path.join(__dirname, `email_body_${safeStoreName}${safeFounder}.txt`);
        fs.writeFileSync(draftPath, body, 'utf8');

        console.log(`\n----------------------------------------`);
        console.log(`Draft for ${email} (Salutation: ${salutationName || 'Team'}):`);
        console.log(`Subject: ${subject}`);
        console.log(`Body:\n${body}`);
        console.log(`----------------------------------------`);
        console.log(`Draft saved to: ${draftPath}`);

        if (shouldSend) {
            console.log(`Sending email to ${email}...`);
            try {
                await sendEmail(token, email, subject, body);
                console.log(`Email successfully sent!`);
                sentEmails.push(email);
                noteLogs.push(`Sent to ${email}${salutationName ? ` (addressed to ${salutationName})` : ''}`);
            } catch (err) {
                console.error(`Error sending email to ${email}:`, err.message);
                noteLogs.push(`Failed for ${email}: ${err.message}`);
            }
        }
    }

    if (shouldSend) {
        if (sentEmails.length > 0) {
            const finalEmailsString = sentEmails.join(', ');
            const finalNotes = `Sent separate email pitches: ${noteLogs.join('; ')}. Detected Reviews App: ${matchedApp}.`;
            await updateRow(token, rowNum, finalEmailsString, 'Contacted', finalNotes);
            console.log(`Google Sheet updated successfully for Row ${rowNum}.`);
        } else {
            const allEmails = contacts.map(c => c.email).join(', ');
            const finalNotes = `Verification failed: ${noteLogs.join('; ')}.`;
            await updateRow(token, rowNum, allEmails, 'Failed/Invalid', finalNotes);
            console.log(`Google Sheet updated with failure status for Row ${rowNum}.`);
        }
    } else if (!shouldSend) {
        console.log(`\nTo send the above email(s), run: node automate_outreach.js --row=${rowNum} --send`);
    }
}

main().catch(console.error);
