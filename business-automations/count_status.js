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
    const accessToken = tokenData.access_token;

    const spreadsheetId = '1Zhu-BGL8u41L0j8WirsV_leh8iQ8COoHkqIBVrSGBBo';
    const range = 'Leads!A4:K150';
    
    const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
        { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    
    if (!response.ok) {
        console.error(`Failed to fetch values: ${await response.text()}`);
        return;
    }
    
    const data = await response.json();
    if (!data.values) {
        console.log('No values found.');
        return;
    }
    
    const stats = {};
    let totalActiveLeads = 0;
    data.values.forEach((row) => {
        const storeName = row[1];
        if (!storeName) return; // Skip empty rows
        
        totalActiveLeads++;
        const status = row[9] ? row[9].trim() : 'Pending/Blank';
        stats[status] = (stats[status] || 0) + 1;
    });
    
    console.log('\n--- OUTREACH STATS ---');
    console.log(`Total Active Leads: ${totalActiveLeads}`);
    for (const [status, count] of Object.entries(stats)) {
        console.log(`${status}: ${count}`);
    }
}

main().catch(console.error);
