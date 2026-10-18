/**
 * Nefra Marketplace API & Service Endpoints Configuration
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api',
  timeoutMs: 15000,
  endpoints: {
    health: '/health',
    auth: {
      verifyYouTube: '/auth/verify-youtube'
    },
    creators: {
      profile: '/creators/me',
      rateCards: '/creators/rate-cards',
      leaderboard: '/creators/leaderboard'
    },
    campaigns: {
      base: '/campaigns',
      detail: (id) => `/campaigns/${id}`,
      apply: (id) => `/campaigns/${id}/apply`
    },
    escrow: {
      contracts: '/escrow/contracts',
      detail: (id) => `/escrow/contracts/${id}`,
      deliver: (id) => `/escrow/contracts/${id}/deliver`,
      release: (id) => `/escrow/contracts/${id}/release`,
      dispute: (id) => `/escrow/contracts/${id}/dispute`
    },
    ai: {
      generateJobCard: '/ai/generate-job-card',
      rankCreators: '/ai/rank-creators',
      generateProposal: '/ai/generate-proposal'
    }
  }
};

export default API_CONFIG;
