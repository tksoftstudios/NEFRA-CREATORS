import { getVertexAccessToken } from '../src/server/vertexHandler.js';

async function main() {
  const token = await getVertexAccessToken();
  if (!token) {
    console.error('Could not get token');
    process.exit(1);
  }

  const funcName = 'projects/nefra-creators-x/locations/us-central1/functions/api';
  console.log(`Getting IAM policy for function ${funcName}...`);

  const getRes = await fetch(`https://cloudfunctions.googleapis.com/v1/${funcName}:getIamPolicy`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  console.log('Get IAM status:', getRes.status);
  let policy = {};
  if (getRes.ok) {
    policy = await getRes.json();
    console.log('Current bindings:', JSON.stringify(policy.bindings, null, 2));
  } else {
    console.log('Error:', await getRes.text());
  }

  policy.bindings = policy.bindings || [];
  let binding = policy.bindings.find(b => b.role === 'roles/cloudfunctions.invoker');
  if (!binding) {
    binding = { role: 'roles/cloudfunctions.invoker', members: [] };
    policy.bindings.push(binding);
  }

  if (!binding.members.includes('allUsers')) {
    binding.members.push('allUsers');
  }

  console.log(`Setting updated IAM policy on ${funcName}...`);
  const setRes = await fetch(`https://cloudfunctions.googleapis.com/v1/${funcName}:setIamPolicy`, {
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
