const fs = require('fs');

async function getAccessToken() {
    const credPath = 'C:\\Users\\nimro\\.local\\share\\google-workspace-mcp\\credentials\\nimrod_at_zylobot_dot_com.json';
    const credential = JSON.parse(fs.readFileSync(credPath, 'utf8'));

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
    if (!data.access_token) {
        console.error('Failed to get access token:', JSON.stringify(data));
        process.exit(1);
    }
    return data.access_token;
}

function decodeBase64(str) {
    try {
        return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    } catch (e) {
        return '';
    }
}

function getBody(payload) {
    if (!payload) return '';
    // Check direct body
    if (payload.body && payload.body.data) {
        return decodeBase64(payload.body.data);
    }
    // Check parts
    if (payload.parts) {
        for (const part of payload.parts) {
            if (part.mimeType === 'text/plain' && part.body && part.body.data) {
                return decodeBase64(part.body.data);
            }
        }
        // fallback to text/html or nested parts
        for (const part of payload.parts) {
            const nested = getBody(part);
            if (nested) return nested;
        }
    }
    return '';
}

function getHeader(headers, name) {
    const h = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return h ? h.value : '';
}

function extractEmail(from) {
    const match = from.match(/<([^>]+)>/);
    if (match) return match[1].toLowerCase().trim();
    return from.toLowerCase().trim();
}

async function main() {
    const token = await getAccessToken();

    // Use after: with epoch seconds for today's date in UTC
    // Today is 2026-05-26
    const query = 'in:inbox after:2026/05/26';
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=50`;

    console.log(`Fetching messages with query: ${query}`);

    const listRes = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const listData = await listRes.json();

    if (!listData.messages || listData.messages.length === 0) {
        console.log('NO_MESSAGES_TODAY');
        console.log(JSON.stringify({ messages: [], total: 0 }));
        return;
    }

    console.log(`Found ${listData.messages.length} messages. Fetching details...`);

    const results = [];
    for (const msg of listData.messages) {
        const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const detail = await detailRes.json();

        const headers = detail.payload ? detail.payload.headers : [];
        const from = getHeader(headers, 'From');
        const subject = getHeader(headers, 'Subject');
        const date = getHeader(headers, 'Date');
        const senderEmail = extractEmail(from);
        const body = getBody(detail.payload);
        const snippet = detail.snippet || '';

        results.push({
            id: msg.id,
            from,
            senderEmail,
            subject,
            date,
            snippet,
            body: body.substring(0, 1000) // limit body length
        });
    }

    console.log('RESULTS_JSON:' + JSON.stringify(results, null, 2));
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
