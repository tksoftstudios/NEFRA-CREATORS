import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import GlobalNavbar from './components/navbar/GlobalNavbar';
import CreatorDashboard from './components/creator/CreatorDashboard';
import RateCardManager from './components/creator/RateCardManager';
import JobOpportunities from './components/creator/JobOpportunities';
import EscrowManager from './components/creator/EscrowManager';
import ChannelDiagnostics from './components/creator/ChannelDiagnostics';
import CreatorDirectory from './components/creator/CreatorDirectory';
import BusinessPortalPreview from './components/business/BusinessPortalPreview';
import OnboardingScreen from './components/onboarding/OnboardingScreen';

import {
  CURRENT_CREATOR,
  INITIAL_RATE_CARDS,
  BRAND_CAMPAIGNS,
  ACTIVE_ESCROW_CONTRACTS,
  AI_CHANNEL_AUDIT
} from './data/mockData';

export default function App() {
  // Onboarding Screen State (defaults to true on first visit)
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Fiverr-style Toggle state: 'creator' (Selling) vs 'business' (Buying)
  const [mode, setMode] = useState('creator');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Shared state
  const [creator, setCreator] = useState(CURRENT_CREATOR);
  const [rateCards, setRateCards] = useState(INITIAL_RATE_CARDS);
  const [campaigns, setCampaigns] = useState(BRAND_CAMPAIGNS);
  const [escrowContracts, setEscrowContracts] = useState(ACTIVE_ESCROW_CONTRACTS);
  const [aiAudit] = useState(AI_CHANNEL_AUDIT);

  // Ant Design Dark Theme Tokens
  const antdTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: mode === 'creator' ? '#6366f1' : '#10b981',
      colorBgBase: '#030712',
      colorBgContainer: '#0b0f19',
      colorBgElevated: '#111827',
      colorBorder: 'rgba(255, 255, 255, 0.08)',
      colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
      colorText: '#f3f4f6',
      colorTextSecondary: '#9ca3af',
      borderRadius: 10,
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    },
    components: {
      Button: {
        borderRadius: 8,
        controlHeight: 38
      },
      Card: {
        borderRadiusLG: 16
      },
      Table: {
        colorBgContainer: '#0b0f19',
        headerBg: '#111827'
      },
      Modal: {
        contentBg: '#0b0f19',
        headerBg: '#0b0f19'
      }
    }
  };

  const handleOnboardingComplete = (data) => {
    if (data) {
      // Update creator details from onboarding
      setCreator(prev => ({
        ...prev,
        name: data.name || prev.name,
        handle: data.handle || prev.handle,
        category: data.category || prev.category,
        residence: data.residence || prev.residence,
        modalityPreference: data.modalities || prev.modalityPreference,
        willingToTravel: data.willingToTravel ?? prev.willingToTravel
      }));

      // Update rate cards if custom prices set
      if (data.rateCards) {
        setRateCards(prev =>
          prev.map(c => {
            if (c.type === 'shorts') return { ...c, price: data.rateCards.shortsPrice || c.price };
            if (c.type === 'integration') return { ...c, price: data.rateCards.integrationPrice || c.price };
            if (c.type === 'dedicated') return { ...c, price: data.rateCards.dedicatedPrice || c.price };
            return c;
          })
        );
      }
    }
    setShowOnboarding(false);
    setActiveTab('dashboard');
  };

  return (
    <ConfigProvider theme={antdTheme}>
      {showOnboarding ? (
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          initialCreator={creator}
          initialRateCards={rateCards}
        />
      ) : (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
          {/* Global Navigation Bar with Fiverr Switcher */}
          <GlobalNavbar
            mode={mode}
            setMode={setMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            creator={creator}
            onOpenOnboarding={() => setShowOnboarding(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {mode === 'creator' ? (
              /* CREATOR HUB PORTAL */
              <div>
                {activeTab === 'dashboard' && (
                  <CreatorDashboard
                    creator={creator}
                    rateCards={rateCards}
                    escrowContracts={escrowContracts}
                    aiAudit={aiAudit}
                    setActiveTab={setActiveTab}
                  />
                )}

                {activeTab === 'rate-card' && (
                  <RateCardManager
                    rateCards={rateCards}
                    setRateCards={setRateCards}
                    creator={creator}
                    setCreator={setCreator}
                  />
                )}

                {activeTab === 'jobs' && (
                  <JobOpportunities
                    campaigns={campaigns}
                    creator={creator}
                  />
                )}

                {activeTab === 'escrow' && (
                  <EscrowManager
                    escrowContracts={escrowContracts}
                    setEscrowContracts={setEscrowContracts}
                  />
                )}

                {activeTab === 'ai-audit' && (
                  <ChannelDiagnostics
                    aiAudit={aiAudit}
                    creator={creator}
                  />
                )}

                {activeTab === 'directory' && (
                  <CreatorDirectory />
                )}
              </div>
            ) : (
              /* BUSINESS / BRAND CLIENT PORTAL */
              <BusinessPortalPreview
                onSwitchToCreator={() => {
                  setMode('creator');
                  setActiveTab('dashboard');
                }}
                campaigns={campaigns}
                setCampaigns={setCampaigns}
              />
            )}
          </main>

          {/* Global Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-center text-xs text-slate-400">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">NEFRA CREATORS</span>
                <span>•</span>
                <span>Next-Gen Creator Economy & Escrow Platform</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Current Portal: <strong className="text-indigo-400 capitalize">{mode}</strong></span>
                <span>•</span>
                <button
                  onClick={() => setShowOnboarding(true)}
                  className="text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                  Restart Onboarding
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </ConfigProvider>
  );
}
