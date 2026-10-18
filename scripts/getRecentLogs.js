import { getVertexAccessToken } from '../src/server/vertexHandler.js';

async function main() {
  const token = await getVertexAccessToken();
  if (!token) {
    console.error('Could not get token');
    process.exit(1);
  }

  const res = await fetch('https://logging.googleapis.com/v2/entries:list', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      resourceNames: ['projects/nefra-creators-x'],
      filter: 'resource.type="cloud_function" AND textPayload:*',
      orderBy: 'timestamp desc',
      pageSize: 40
    })
  });

  if (!res.ok) {
    console.error('Failed to get logs:', res.status, await res.text());
    return;
  }

  const data = await res.json();
  const entries = data.entries || [];
  console.log(`Found ${entries.length} log entries:`);
  for (const entry of entries) {
    console.log(`[${entry.timestamp}] [${entry.severity || 'DEFAULT'}] ${entry.textPayload || JSON.stringify(entry.jsonPayload)}`);
  }
}

main().catch(console.error);
