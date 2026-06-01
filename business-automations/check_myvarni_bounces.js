const fs = require('fs');

async function main() {
    const credPath = 'C:\\Users\\nimro\\.local\\share\\google-workspace-mcp\\credentials\\nimrod_at_zylobot_dot_com.json';
    const credential = JSON.parse(fs.readFileSync(credPath, 'utf8'));

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

    // Search query for mailer-daemon emails containing myvarni
    const query = 'from:mailer-daemon myvarni';
    const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`;
    const listRes = await fetch(listUrl, { headers: { Authorization: `Bearer ${token}` } });
    const listData = await listRes.json();

    if (!listData.messages || listData.messages.length === 0) {
        console.log('No bounce/failure notifications found for myvarni.');
        return;
    }

    console.log(`Found ${listData.messages.length} mailer-daemon messages for "myvarni":\n`);

    for (const msg of listData.messages) {
        const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const detail = await detailRes.json();
        const headers = detail.payload ? detail.payload.headers : [];
        console.log('Message ID:', msg.id);
        console.log('Subject:', headers.find(h => h.name.toLowerCase() === 'subject')?.value);
        console.log('Date:', headers.find(h => h.name.toLowerCase() === 'date')?.value);
        console.log('Snippet:', detail.snippet);
        console.log('--------------------------------------------------\n');
    }
}

main().catch(console.error);
