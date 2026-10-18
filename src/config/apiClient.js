/**
 * Centralized API Client Endpoint Resolver
 * 
 * In production with Firebase Hosting rewrites, relative '/api/...' is used,
 * ensuring 100% same-origin requests with ZERO CORS preflight or header issues.
 * If an external backend URL is specified in VITE_BACKEND_URL (e.g., Render/Cloud Run),
 * it prepends the backend host with full cross-origin credentials enabled.
 */

export function getApiUrl(endpoint) {
  const base = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_BACKEND_URL) || '';
  const cleanBase = base.replace(/\/+$/, '');
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${cleanBase}${cleanEndpoint}`;
}
