import { getVertexAccessToken } from '../src/server/vertexHandler.js';

async function main() {
  const token = await getVertexAccessToken();
  if (!token) {
    console.error('Could not get token');
    process.exit(1);
  }

  const bucket = 'gcf-sources-194521973902-us-central1';
  const member = 'serviceAccount:194521973902-compute@developer.gserviceaccount.com';
  const role = 'roles/storage.objectViewer';

  console.log(`Getting IAM policy for bucket ${bucket}...`);
  const getRes = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucket}/iam`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!getRes.ok) {
    console.log('Bucket IAM get status:', getRes.status, await getRes.text());
    
    // Try project-level IAM
    console.log('Trying project-level IAM...');
    const projRes = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects/nefra-creators-x:getIamPolicy', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Project IAM get status:', projRes.status, await projRes.text());
    return;
  }

  const policy = await getRes.json();
  console.log('Current bucket policy bindings:', JSON.stringify(policy.bindings, null, 2));

  let binding = (policy.bindings || []).find(b => b.role === role);
  if (!binding) {
    binding = { role, members: [] };
    policy.bindings = policy.bindings || [];
    policy.bindings.push(binding);
  }

  if (!binding.members.includes(member)) {
    binding.members.push(member);
  }

  console.log(`Setting updated IAM policy for bucket ${bucket}...`);
  const setRes = await fetch(`https://storage.googleapis.com/storage/v1/b/${bucket}/iam`, {
    method: 'PUT',
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(policy)
  });

  console.log('Bucket IAM set status:', setRes.status);
  const result = await setRes.text();
  console.log('Result:', result);
}

main().catch(console.error);
