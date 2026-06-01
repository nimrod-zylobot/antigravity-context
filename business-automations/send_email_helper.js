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
    return data.access_token;
}

async function sendEmail(to, subject, bodyText) {
    const token = await getAccessToken();

    // Construct RFC 2822 message
    const emailLines = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        bodyText
    ];
    const email = emailLines.join('\r\n');

    // Base64URL encode the message
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
        body: JSON.stringify({
            raw: base64Safe
        })
    });

    return await response.json();
}

async function main() {
    const args = process.argv.slice(2);
    const to = args[0];
    const subject = args[1];
    const bodyPath = args[2];

    if (!to || !subject || !bodyPath) {
        console.log("Usage: node send_email_helper.js [to] [subject] [body_file_path]");
        return;
    }

    try {
        const bodyText = fs.readFileSync(bodyPath, 'utf8');
        const result = await sendEmail(to, subject, bodyText);
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main();
