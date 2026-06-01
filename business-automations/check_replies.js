const fs = require('fs');
const path = require('path');

async function main() {
    const credPath = 'C:\\Users\\nimro\\.local\\share\\google-workspace-mcp\\credentials\\nimrod_at_zylobot_dot_com.json';
    const credential = JSON.parse(fs.readFileSync(credPath, 'utf8'));

    // 1. Get access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: credential.client_id,
            client_secret: credential.client_secret,
            refresh_token: credential.refresh_token,
            grant_type: 'refresh_token',
        }),
    });
    const tokenData = await tokenResponse.json();
    const token = tokenData.access_token;

    // 2. Fetch sheet leads
    const spreadsheetId = '1Zhu-BGL8u41L0j8WirsV_leh8iQ8COoHkqIBVrSGBBo';
    const range = 'Leads!A1:K100';
    const sheetRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const sheetData = await sheetRes.json();
    if (!sheetData.values) {
        console.error('Failed to fetch sheet values.');
        return;
    }
    const rows = sheetData.values;

    // 3. Fetch Gmail messages from last 3 days
    const query = 'in:inbox after:2026/05/26';
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=100`;
    const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } });
    const listData = await listRes.json();

    if (!listData.messages || listData.messages.length === 0) {
        console.log('No inbox messages found.');
        return;
    }

    console.log(`Checking ${listData.messages.length} messages against sheet leads...\n`);

    for (const msg of listData.messages) {
        const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const detail = await detailRes.json();
        const headers = detail.payload ? detail.payload.headers : [];
        const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
        const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '';
        const snippet = detail.snippet || '';

        // Extract sender email
        const match = from.match(/<([^>]+)>/);
        const senderEmail = (match ? match[1] : from).toLowerCase().trim();

        // Match against sheet rows
        for (let i = 3; i < rows.length; i++) {
            const rowEmails = rows[i][4] ? rows[i][4].toLowerCase().split(/[\s,]+/) : [];
            const rowNum = i + 1;
            const storeName = rows[i][1];

            if (rowEmails.includes(senderEmail)) {
                console.log(`[MATCH] Row ${rowNum} (${storeName}) matched sender ${senderEmail}`);
                console.log(`Subject: ${subject}`);
                console.log(`Snippet: ${snippet}`);
                
                // Check if auto-reply
                const isAuto = snippet.toLowerCase().includes('received') || 
                               snippet.toLowerCase().includes('ticket') || 
                               snippet.toLowerCase().includes('thank you for reaching out') ||
                               subject.toLowerCase().includes('automatic reply') ||
                               subject.toLowerCase().includes('re:lost checkouts');
                
                if (isAuto) {
                    console.log(`Classification: Auto-Reply (No status update needed)`);
                } else {
                    console.log(`Classification: MANUAL REPLY! Needs review.`);
                }
                console.log('--------------------------------------------------\n');
            }
        }

        // Check for bounces of our sent emails
        if (senderEmail === 'mailer-daemon@googlemail.com') {
            if (snippet.includes('info@varniindia.com')) {
                console.log(`[BOUNCE] Email to info@varniindia.com (Varni, Row 47) bounced!`);
                console.log(`Snippet: ${snippet}`);
                console.log('--------------------------------------------------\n');
            }
        }
    }
}

main().catch(console.error);
