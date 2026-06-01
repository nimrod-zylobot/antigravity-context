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

    const ids = ['19e782d874d43ee6', '19e782a96823cd77'];
    for (const id of ids) {
        const detailRes = await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const detail = await detailRes.json();
        console.log('Message ID:', id);
        console.log('Snippet:', detail.snippet);
        console.log('Body:', detail.snippet + '\n' + (detail.payload ? JSON.stringify(detail.payload.body) : ''));
        // Decode body if possible
        if (detail.payload && detail.payload.parts) {
            for (const part of detail.payload.parts) {
                if (part.body && part.body.data) {
                    const decoded = Buffer.from(part.body.data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
                    console.log('Decoded part:\n', decoded);
                }
            }
        }
        console.log('--------------------------------------------------\n');
    }
}

main().catch(console.error);
