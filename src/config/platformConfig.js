/**
 * Nefra Platform Economy & System Configuration Parameters
 */
export const PLATFORM_CONFIG = {
  appName: "NEFRA CREATORS",
  version: "2.0.0",
  economy: {
    platformTakeRatePercent: 10, // 10% marketplace commission
    creatorNetPayoutPercent: 90,
    creatorStartingCredits: 50,
    jobApplicationCostCredits: 5,
    dailyLoginBonusCredits: 15
  },
  supportedModalities: [
    { key: 'online', label: 'Online / Remote Digital Deliverable' },
    { key: 'hybrid', label: 'Hybrid / Hardware Shoot' },
    { key: 'physical', label: 'Physical On-Site Shoot' }
  ],
  oauth: {
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    defaultClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
  },
  ai: {
    provider: 'Google Cloud Vertex AI',
    defaultModel: 'gemini-1.5-flash-002',
    projectId: import.meta.env.VITE_GCP_PROJECT_ID || 'nefra-creators-x',
    region: import.meta.env.VITE_GCP_REGION || 'us-central1'
  }
};

export default PLATFORM_CONFIG;
