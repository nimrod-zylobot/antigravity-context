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

async function searchSpreadsheets(query) {
    const token = await getAccessToken();
    const url = `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'+and+name+contains+'${encodeURIComponent(query)}'&fields=files(id,name)`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
}

async function getSpreadsheet(spreadsheetId) {
    const token = await getAccessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
}

async function getSheetValues(spreadsheetId, range) {
    const token = await getAccessToken();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
    const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return await response.json();
}

async function updateSheetValues(spreadsheetId, range, values) {
    const token = await getAccessToken();
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
    const action = args[0];
    const param1 = args[1];
    const param2 = args[2];
    const param3 = args[3]; // For JSON values to update

    try {
        if (action === 'search') {
            const results = await searchSpreadsheets(param1 || 'Shopify');
            console.log(JSON.stringify(results, null, 2));
        } else if (action === 'get') {
            const result = await getSpreadsheet(param1);
            console.log(JSON.stringify(result, null, 2));
        } else if (action === 'read') {
            const values = await getSheetValues(param1, param2 || 'Sheet1');
            console.log(JSON.stringify(values, null, 2));
        } else if (action === 'update') {
            const parsedValues = JSON.parse(param3);
            const result = await updateSheetValues(param1, param2, parsedValues);
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log("Usage: node google_sheets_helper.js [search|get|read|update] [param1] [param2] [param3]");
        }
    } catch (e) {
        console.error(e);
    }
}

main();
