import { getVertexAccessToken } from '../src/server/vertexHandler.js';

async function main() {
  const token = await getVertexAccessToken();
  if (!token) {
    console.error('Could not get token');
    process.exit(1);
  }

  const computeSa = 'serviceAccount:194521973902-compute@developer.gserviceaccount.com';
  const buildSa = 'serviceAccount:194521973902@cloudbuild.gserviceaccount.com';
  const repoName = 'projects/nefra-creators-x/locations/us-central1/repositories/gcf-artifacts';

  console.log(`Checking Artifact Registry repo ${repoName}...`);
  const getRes = await fetch(`https://artifactregistry.googleapis.com/v1/${repoName}:getIamPolicy`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('Get IAM status:', getRes.status);
  if (!getRes.ok) {
    console.log('Error:', await getRes.text());
    
    // Also try project-level IAM
    console.log('Checking project-level IAM...');
    const projRes = await fetch('https://cloudresourcemanager.googleapis.com/v1/projects/nefra-creators-x:getIamPolicy', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Project IAM status:', projRes.status, await projRes.text());
    return;
  }

  const policy = await getRes.json();
  console.log('Current repo bindings:', JSON.stringify(policy.bindings, null, 2));

  policy.bindings = policy.bindings || [];

  for (const role of ['roles/artifactregistry.writer', 'roles/artifactregistry.repoAdmin']) {
    let binding = policy.bindings.find(b => b.role === role);
    if (!binding) {
      binding = { role, members: [] };
      policy.bindings.push(binding);
    }
    for (const sa of [computeSa, buildSa]) {
      if (!binding.members.includes(sa)) {
        binding.members.push(sa);
      }
    }
  }

  console.log(`Setting updated IAM policy on ${repoName}...`);
  const setRes = await fetch(`https://artifactregistry.googleapis.com/v1/${repoName}:setIamPolicy`, {
    method: 'POST',
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ policy })
  });

  console.log('Set IAM status:', setRes.status);
  console.log('Result:', await setRes.text());
}

main().catch(console.error);
