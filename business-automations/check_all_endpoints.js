// check_all_endpoints.js - discovers all valid gRPC endpoints on the language server
const http = require('http');
const WebSocket = require('ws');

const DEVTOOLS_PORT = 50162;

http.get(`http://127.0.0.1:${DEVTOOLS_PORT}/json`, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const pages = JSON.parse(body);
    const page = pages.find(p => p.type === 'page' && p.webSocketDebuggerUrl) || pages.find(p => p.webSocketDebuggerUrl);
    runInspection(page.webSocketDebuggerUrl);
  });
}).on('error', e => console.error(e.message));

function runInspection(wsUrl) {
  const ws = new WebSocket(wsUrl);
  ws.on('open', () => {
    const expr = `
(async function() {
  const csrfToken = window.__APP_CONFIG__?.csrfToken;
  const origin = window.location.origin;
  
  // Try all plausible GetAvailableModels endpoint variants to discover weekly data
  const endpoints = [
    '/exa.language_server_pb.LanguageServerService/GetAvailableModels',
    '/exa.language_server_pb.LanguageServerService/GetPersonalizedModels',
    '/exa.language_server_pb.LanguageServerService/GetModelUsage',
    '/exa.language_server_pb.LanguageServerService/GetAccountInfo',
    '/exa.language_server_pb.LanguageServerService/GetProfile',
    '/exa.language_server_pb.LanguageServerService/GetSubscription',
    '/exa.language_server_pb.LanguageServerService/GetQuota',
    '/exa.language_server_pb.LanguageServerService/GetAvailableModelsV2',
  ];
  
  const results = {};
  for (const ep of endpoints) {
    try {
      const r = await fetch(origin + ep, {
        method: 'POST',
        headers: { 'content-type': 'application/grpc-web+json', 'x-codeium-csrf-token': csrfToken, 'x-grpc-web': '1' },
        body: new Uint8Array([0, 0, 0, 0, 2, 123, 125])
      });
      const t = await r.text();
      // Only show successful or interesting responses
      if (r.status !== 404) {
        results[ep] = { status: r.status, body: t.substring(0, 500) };
      }
    } catch(e) {
      results[ep] = { error: e.message };
    }
  }

  // Also: check the GetAvailableModels response more carefully for quota window info
  // The resetTime is ~24h away. What was the window start?
  // If window = 5h, the window started ~(now - (resetTime - 5h))
  // If window = 24h, the window started ~(now - (resetTime - 24h))
  // If window = 7d, the window started ~(now - (resetTime - 7d))
  const grpcRes = await fetch(origin + '/exa.language_server_pb.LanguageServerService/GetAvailableModels', {
    method: 'POST',
    headers: { 'content-type': 'application/grpc-web+json', 'x-codeium-csrf-token': csrfToken, 'x-grpc-web': '1' },
    body: new Uint8Array([0, 0, 0, 0, 2, 123, 125])
  });
  const grpcText = await grpcRes.text();
  const grpcData = JSON.parse(grpcText.substring(grpcText.indexOf('{'), grpcText.lastIndexOf('}')+1));
  const models = grpcData?.response?.models || {};
  
  // Pick Claude Opus 4.6 (Thinking) as the sample - it shows 40% remaining
  const claudeModel = Object.values(models).find(m => m.displayName?.includes('Opus') || m.displayName?.includes('Sonnet'));
  const quotaInfo = claudeModel?.quotaInfo;
  
  const now = Date.now();
  const resetMs = quotaInfo?.resetTime ? new Date(quotaInfo.resetTime).getTime() : null;
  
  let windowAnalysis = null;
  if (resetMs && quotaInfo?.remainingFraction !== undefined) {
    const remainingFrac = quotaInfo.remainingFraction; // 0.4 = 40% remaining
    const usedFrac = 1 - remainingFrac;               // 0.6 = 60% used
    const diffToResetMs = resetMs - now;
    
    // If remainingFraction = 0.4, we've used 60% of the window
    // So elapsed = 60% of total window duration
    // And remaining = 40% of total window duration
    // remaining duration in ms = resetMs - now = diffToResetMs
    // total window = diffToResetMs / remainingFrac
    const estimatedWindowMs = diffToResetMs / remainingFrac;
    const estimatedWindowHrs = estimatedWindowMs / 3600000;
    
    windowAnalysis = {
      remainingFraction: remainingFrac,
      usedFraction: usedFrac,
      diffToResetHours: (diffToResetMs / 3600000).toFixed(2),
      estimatedTotalWindowHours: estimatedWindowHrs.toFixed(2),
      windowType: estimatedWindowHrs < 6 ? '5h session' :
                  estimatedWindowHrs < 26 ? '24h daily' :
                  estimatedWindowHrs < 50 ? '48h' :
                  estimatedWindowHrs < 170 ? '7d weekly' : 'longer',
    };
  }
  
  return JSON.stringify({ otherEndpoints: results, windowAnalysis, sampleQuotaInfo: quotaInfo }, null, 2);
})()
    `;
    ws.send(JSON.stringify({ id: 99, method: 'Runtime.evaluate', params: { expression: expr, awaitPromise: true, returnByValue: true } }));
  });
  ws.on('message', raw => {
    const msg = JSON.parse(raw.toString());
    if (msg.id === 99) {
      console.log('=== ENDPOINT DISCOVERY + WINDOW ANALYSIS ===');
      console.log(msg.result?.result?.value || JSON.stringify(msg.result, null, 2));
      ws.close();
    }
  });
  ws.on('error', e => console.error('WS error:', e.message));
}
