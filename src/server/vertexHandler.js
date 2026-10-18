import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let cachedAccessToken = null;
let tokenExpiry = 0;

/**
 * Loads GCP Service Account credentials from:
 * 1. GCP_SERVICE_ACCOUNT_JSON (raw JSON string in env)
 * 2. service-account.json in root
 * 3. gcp-credentials.json in root
 */
function getServiceAccount() {
  if (process.env.GCP_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.warn('[Vertex AI] Error parsing GCP_SERVICE_ACCOUNT_JSON:', e.message);
    }
  }

  const candidatePaths = [
    path.resolve(process.cwd(), 'nefra-creators-x-9c9d7b751da8.json'),
    path.resolve(process.cwd(), 'service-account.json'),
    path.resolve(process.cwd(), 'gcp-credentials.json'),
    path.resolve(process.cwd(), 'vertex-key.json')
  ];

  // Also scan root directory for any nefra-creators-x-*.json
  try {
    const files = fs.readdirSync(process.cwd());
    const gcpJson = files.find(f => f.startsWith('nefra-creators-x') && f.endsWith('.json'));
    if (gcpJson) {
      candidatePaths.unshift(path.resolve(process.cwd(), gcpJson));
    }
  } catch (e) {}

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {
        console.warn(`[Vertex AI] Error reading service account file at ${p}:`, e.message);
      }
    }
  }

  return null;
}

/**
 * Obtains an OAuth2 Access Token for Google Cloud Vertex AI
 * via standard Google Service Account JWT bearer flow.
 */
async function getVertexAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (cachedAccessToken && tokenExpiry > now + 60) {
    return cachedAccessToken;
  }

  // Check if static token provided in env
  if (process.env.GCP_ACCESS_TOKEN) {
    return process.env.GCP_ACCESS_TOKEN.trim();
  }

  const sa = getServiceAccount();
  if (!sa || !sa.client_email || !sa.private_key) {
    return null;
  }

  try {
    const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    })).toString('base64url');

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(`${header}.${payload}`);
    const signature = sign.sign(sa.private_key, 'base64url');
    const assertion = `${header}.${payload}.${signature}`;

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google OAuth token exchange failed: ${err}`);
    }

    const data = await res.json();
    cachedAccessToken = data.access_token;
    tokenExpiry = now + (data.expires_in || 3600);
    console.log('✅ [Vertex AI] Acquired Google Cloud OAuth2 Access Token for service account:', sa.client_email);
    return cachedAccessToken;
  } catch (err) {
    console.error('❌ [Vertex AI] Failed to generate OAuth2 token:', err.message);
    return null;
  }
}

/**
 * Get current Vertex AI configuration status
 */
export function handleGetVertexStatus() {
  const sa = getServiceAccount();
  const projectId = sa?.project_id || process.env.VITE_GCP_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'nefra-creators-x';
  const region = process.env.VITE_GCP_REGION || 'us-central1';
  const hasToken = Boolean(process.env.GCP_ACCESS_TOKEN || cachedAccessToken);
  const hasServiceAccount = Boolean(sa?.client_email && sa?.private_key);

  return {
    success: true,
    configured: hasServiceAccount || hasToken,
    authType: hasServiceAccount ? 'service_account' : (hasToken ? 'access_token' : 'none'),
    serviceAccountEmail: sa?.client_email || null,
    projectId,
    region
  };
}

/**
 * Saves uploaded or pasted Service Account JSON to service-account.json in the project root
 */
export async function handleSaveVertexCredentials(payload = {}) {
  const { serviceAccountJson, accessToken } = payload;

  if (accessToken && typeof accessToken === 'string' && accessToken.trim()) {
    process.env.GCP_ACCESS_TOKEN = accessToken.trim();
    cachedAccessToken = accessToken.trim();
    tokenExpiry = Math.floor(Date.now() / 1000) + 3600;
    return {
      success: true,
      message: 'OAuth2 access token successfully registered for Vertex AI.',
      authType: 'access_token'
    };
  }

  if (serviceAccountJson) {
    let parsed;
    if (typeof serviceAccountJson === 'string') {
      try {
        parsed = JSON.parse(serviceAccountJson.trim());
      } catch (e) {
        throw new Error('Invalid JSON format for Service Account credentials');
      }
    } else {
      parsed = serviceAccountJson;
    }

    if (!parsed.client_email || !parsed.private_key) {
      throw new Error('Service Account JSON must contain client_email and private_key');
    }

    const targetPath = path.resolve(process.cwd(), 'service-account.json');
    fs.writeFileSync(targetPath, JSON.stringify(parsed, null, 2), 'utf8');

    // Invalidate cached token so new credentials generate fresh token
    cachedAccessToken = null;
    tokenExpiry = 0;

    console.log('✅ [Vertex AI] Service account saved to service-account.json for:', parsed.client_email);

    return {
      success: true,
      message: `Service account credentials saved for ${parsed.client_email}`,
      serviceAccountEmail: parsed.client_email,
      projectId: parsed.project_id,
      authType: 'service_account'
    };
  }

  throw new Error('Either serviceAccountJson or accessToken must be provided');
}

/**
 * Proxies request to Vertex AI generateContent endpoint.
 */
export async function handleVertexGenerateContent(body = {}) {
  const sa = getServiceAccount();
  const projectId = sa?.project_id || process.env.VITE_GCP_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID || 'nefra-creators-x';
  const region = process.env.VITE_GCP_REGION || 'us-central1';
  let model = body.model || 'gemini-2.5-flash';
  // Preserve image models (Gemini Flash Image / Nano Banana, Imagen)
  if (model.includes('banana') || model === 'gemini-2.5-flash-image' || model.includes('image')) {
    model = 'gemini-2.5-flash-image';
  } else if (model.includes('imagen') || model.includes('imagegeneration')) {
    // Keep exact imagen model requested
  } else if (model.includes('flash')) {
    model = 'gemini-2.5-flash';
  } else if (model.includes('pro')) {
    model = 'gemini-2.5-pro';
  }

  // Ensure role: "user" is present on all contents
  const payload = JSON.parse(JSON.stringify(body.payload || body));
  if (Array.isArray(payload.contents)) {
    payload.contents = payload.contents.map(c => ({
      role: c.role || 'user',
      parts: c.parts || []
    }));
  }

  // Check if caller sent access token directly
  const accessToken = body.accessToken || await getVertexAccessToken();

  if (!accessToken) {
    return {
      status: 401,
      data: {
        success: false,
        requiresAuth: true,
        message: "Google Cloud Vertex AI requires an OAuth2 Access Token or Service Account JSON (service-account.json) with role 'Vertex AI User' to draw from your GCP credits.",
        projectId,
        region
      }
    };
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  };

  const isPredictModel = model.includes('imagen') || model.includes('imagegeneration');
  const action = isPredictModel ? ':predict' : ':generateContent';
  const endpoint = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}${action}`;

  console.log(`📡 [Vertex AI Proxy] Dispatching to ${region}-aiplatform.googleapis.com (Model: ${model}, Action: ${action}, Project: ${projectId})...`);

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.error?.details?.[0]?.reason === 'SERVICE_DISABLED') {
        const activationUrl = `https://console.developers.google.com/apis/api/aiplatform.googleapis.com/overview?project=${projectId}`;
        console.warn(`⚠️ [Vertex AI Proxy] Vertex AI API is disabled on project "${projectId}". 1-Click to enable: ${activationUrl}`);
        return {
          status: 403,
          data: {
            success: false,
            requiresActivation: true,
            activationUrl,
            message: `Vertex AI API is disabled on project "${projectId}". Please enable it in Google Cloud Console.`,
            error: data.error
          }
        };
      }

      console.warn(`⚠️ [Vertex AI Proxy] Google Cloud responded with status ${res.status}:`, data.error?.message || data);
    }

    return {
      status: res.status,
      data
    };
  } catch (err) {
    console.error('❌ [Vertex AI Proxy] Request exception:', err.message);
    return {
      status: 500,
      data: { success: false, error: err.message }
    };
  }
}
