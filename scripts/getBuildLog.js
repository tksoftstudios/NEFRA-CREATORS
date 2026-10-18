import { getVertexAccessToken } from '../src/server/vertexHandler.js';

async function main() {
  const token = await getVertexAccessToken();
  const buildId = 'f5b4c3fb-995a-44e8-895f-7bd671483191';
  const url = `https://cloudbuild.googleapis.com/v1/projects/194521973902/locations/us-central1/builds/${buildId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Build status:', data.status);
  console.log('Failure Info:', JSON.stringify(data.failureInfo, null, 2));
  if (data.steps) {
    for (let i = 0; i < data.steps.length; i++) {
      const step = data.steps[i];
      console.log(`Step ${i} (${step.name}): status=${step.status}, entrypoint=${step.entrypoint}, args=${JSON.stringify(step.args)}`);
    }
  }
  console.log('Logs bucket:', data.logsBucket);
  if (data.logsBucket) {
    const logBucketName = data.logsBucket.replace('gs://', '').replace('/', '');
    const logRes = await fetch(`https://storage.googleapis.com/storage/v1/b/${logBucketName}/o/log-${buildId}.txt?alt=media`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Log fetch status:', logRes.status);
    if (logRes.ok) {
      const logText = await logRes.text();
      console.log('=== BUILD LOG TAIL ===\n' + logText.split('\n').slice(-40).join('\n'));
    }
  }
}

main().catch(console.error);
