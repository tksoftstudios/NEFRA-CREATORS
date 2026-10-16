/**
 * NEFRA API Client
 * Connects Frontend to the Node.js Express Backend Service
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] ${endpoint} request error:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth & YouTube Verification
  verifyYouTube: (accessToken, email) =>
    request('/auth/verify-youtube', {
      method: 'POST',
      body: JSON.stringify({ accessToken, email })
    }),

  // Creator
  getCreatorProfile: () => request('/creators/me'),
  updateCreatorProfile: (data) =>
    request('/creators/me', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getRateCards: () => request('/creators/rate-cards'),
  createRateCard: (data) =>
    request('/creators/rate-cards', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateRateCard: (id, data) =>
    request(`/creators/rate-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  getLeaderboard: () => request('/creators/leaderboard'),

  // Campaigns & Proposals
  getCampaigns: (params = '') => request(`/campaigns${params}`),
  createCampaign: (data) =>
    request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  submitProposal: (data) =>
    request('/campaigns/proposals', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Escrow & Fees
  getEscrowContracts: () => request('/escrow/contracts'),
  getEscrowContractById: (id) => request(`/escrow/contracts/${id}`),
  uploadDeliverable: (id, data) =>
    request(`/escrow/contracts/${id}/deliverable`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  transitionContract: (id, nextState, note) =>
    request(`/escrow/contracts/${id}/transition`, {
      method: 'POST',
      body: JSON.stringify({ nextState, note })
    }),
  calculateFees: (amount, takeRate) =>
    request(`/escrow/fees/calculate?amount=${amount}${takeRate ? `&takeRate=${takeRate}` : ''}`),

  // AI Intelligence
  auditVideo: (videoUrl, videoTitle) =>
    request('/ai/audit-video', {
      method: 'POST',
      body: JSON.stringify({ videoUrl, videoTitle })
    }),
  getChannelSafety: () => request('/ai/channel-safety')
};
