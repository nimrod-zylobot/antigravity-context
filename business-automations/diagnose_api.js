const fs = require('fs');
const path = require('path');

const CREDENTIALS_PATH = 'C:\\Users\\nimro\\.local\\share\\google-workspace-mcp\\credentials\\nimrod_at_zylobot_dot_com.json';
const SCRATCH_DIR = 'C:\\Users\\nimro\\.gemini\\antigravity\\scratch';

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

function decodeBase64(str) {
  try {
    return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
  } catch (e) {
    return '';
  }
}

function getBodyText(payload) {
  if (!payload) return '';
  if (payload.body && payload.body.data) {
    return decodeBase64(payload.body.data);
  }
  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body && part.body.data) {
        return decodeBase64(part.body.data);
      }
    }
    for (const part of payload.parts) {
      const nested = getBodyText(part);
      if (nested) return nested;
    }
  }
  return '';
}

async function main() {
  const token = await getAccessToken();
  const query = 'in:inbox';
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=40`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const listData = await listRes.json();
  console.log('List data messages count:', listData.messages ? listData.messages.length : 0);
  
  if (listData.messages) {
    const details = [];
    for (const msg of listData.messages) {
      const detailRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const detail = await detailRes.json();
      const headers = detail.payload ? detail.payload.headers : [];
      const from = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
      const subject = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '';
      
      let senderEmail = from.toLowerCase();
      const match = from.match(/<([^>]+)>/);
      if (match) senderEmail = match[1].toLowerCase().trim();
      else senderEmail = senderEmail.trim();
      
      console.log(`Msg ID: ${msg.id} | From: ${from} | Email: ${senderEmail} | Subject: ${subject}`);
      
      if (senderEmail.includes('lespetits')) {
        console.log('FOUND LESPETITS DETAIL!');
      }
    }
  }
}

main().catch(console.error);
