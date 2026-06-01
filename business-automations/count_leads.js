const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = 'C:\\Users\\nimro\\.local\\share\\google-workspace-mcp\\credentials\\nimrod_at_zylobot_dot_com.json';
const SPREADSHEET_ID = '1Zhu-BGL8u41L0j8WirsV_leh8iQ8COoHkqIBVrSGBBo';

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

async function run() {
    try {
        const token = await getAccessToken();
        const range = 'Leads!A1:D100'; // fetch first 100 rows
        const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(range)}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        
        console.log('--- Sheets Data ---');
        console.log('Values count:', data.values ? data.values.length : 0);
        if (data.values) {
            console.log('Header:', data.values[0]);
            // Print a few rows
            for (let i = 1; i < Math.min(15, data.values.length); i++) {
                console.log(`Row ${i + 1}:`, data.values[i]);
            }
            console.log(`Total rows in sheet (including header): ${data.values.length}`);
            
            // Filter non-empty leads
            const leads = data.values.slice(1).filter(row => row[0] && row[0].trim() !== '');
            console.log(`Total active leads (excluding header): ${leads.length}`);
        } else {
            console.log('No values returned:', data);
        }
    } catch (e) {
        console.error('Error fetching sheet rows:', e);
    }
}

run();
