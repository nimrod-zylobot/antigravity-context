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

async function updateRow(rowNumber, emailAddress, date, status, notes) {
    const token = await getAccessToken();
    const spreadsheetId = '1Zhu-BGL8u41L0j8WirsV_leh8iQ8COoHkqIBVrSGBBo';
    
    // Update Email (Column E)
    const emailRange = `Leads!E${rowNumber}`;
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(emailRange)}?valueInputOption=USER_ENTERED`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [[emailAddress]] })
    });

    // Update the rest (F:K)
    const range = `Leads!F${rowNumber}:K${rowNumber}`;
    const values = [[date, '', '', '', status, notes]];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`;
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values })
    });
    return await response.json();
}

async function main() {
    const args = process.argv.slice(2);
    const row = args[0];
    const emailAddress = args[1];
    const status = args[2];
    const notes = args[3];
    const date = new Date().toISOString().split('T')[0];

    if (!row || !emailAddress || !status || !notes) {
        console.log("Usage: node update_lead_row.js [rowNumber] [emailAddress] [status] [notes]");
        return;
    }

    try {
        const result = await updateRow(row, emailAddress, date, status, notes);
        console.log(JSON.stringify(result, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main();
