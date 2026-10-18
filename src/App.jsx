import React, { useState, useEffect } from 'react';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { PublicDirectory } from './components/directory/PublicDirectory';
import { CreatorDetailModal } from './components/directory/CreatorDetailModal';

// Creator Components
import { CreatorDashboard } from './components/creator/CreatorDashboard';
import { CreatorConnectors } from './components/creator/CreatorConnectors';
import { RateCardsManager } from './components/creator/RateCardsManager';
import { OpportunitiesBoard } from './components/creator/OpportunitiesBoard';
import { CreatorContracts } from './components/creator/CreatorContracts';
import { ChannelAuditView } from './components/creator/ChannelAuditView';
import { CreatorWalletView } from './components/creator/CreatorWalletView';

// Brand Components
import { BrandDashboard } from './components/brand/BrandDashboard';
import { AICampaignBuilder } from './components/brand/AICampaignBuilder';
import { CreatorMatchList } from './components/brand/CreatorMatchList';
import { BrandContracts } from './components/brand/BrandContracts';
import { NefraSenseAdvisor } from './components/brand/NefraSenseAdvisor';

// Admin Components
import { AdminOverview } from './components/admin/AdminOverview';
import { CreatorReviewQueue } from './components/admin/CreatorReviewQueue';
import { DisputeResolution } from './components/admin/DisputeResolution';
import { PlatformConfig } from './components/admin/PlatformConfig';
import { AdminAuditLog } from './components/admin/AdminAuditLog';

// Escrow & Seed Logic
import { transitionContract } from './packages/escrow/stateMachine';
import { calculateContractFees, calculateMilestones } from './packages/escrow/feeCalculator';
import {
  INITIAL_CREATORS,
  INITIAL_RATE_CARDS,
  INITIAL_CAMPAIGNS,
  INITIAL_CONTRACTS,
  INITIAL_PLATFORM_CONFIG,
  INITIAL_AUDIT_LOG
} from './data/seedData';
import confetti from 'canvas-confetti';
import { 
  fetchCreatorProfile, 
  subscribeToCreatorProfile 
} from './services/youtubeOAuthService';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './config/firebaseConfig.js';


export default function App() {
  // Navigation State
  const [activePortal, setActivePortal] = useState('creator'); // 'creator' | 'brand' | 'admin'
  const [activeRoute, setActiveRoute] = useState('directory');

  // Shared Data State with LocalStorage Caching & Firestore hydration
  const [creators, setCreators] = useState(() => {
    try {
      const cached = localStorage.getItem('nefra_creators');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Purge legacy mock data (e.g. fake 428K subscribers or old seed handle)
          return parsed.map(c => {
            if (c.id === 'creator_01' && (c.subscribers === 428500 || c.handle === '@kaveentech')) {
              return INITIAL_CREATORS[0];
            }
            return c;
          });
        }
      }
    } catch (e) {
      console.warn('[App] LocalStorage parse notice:', e);
    }
    return INITIAL_CREATORS;
  });

  // Sync creators state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nefra_creators', JSON.stringify(creators));
    } catch (e) {}
  }, [creators]);

  // Hydrate and maintain real-time sync with Cloud Firestore
  useEffect(() => {
    const mergeFirestoreCreator = (data) => {
      if (!data) return;
      if (typeof data.credits === 'number') {
        setCredits(data.credits);
        try { localStorage.setItem('nefra_credits', String(data.credits)); } catch (e) {}
      }

      setCreators((prev) =>
        prev.map((c) => {
          if (c.id === 'creator_01') {
            // STRICT ZERO-SEEDING: All fields come exclusively from Live APIs (YouTube / Firestore / Vertex AI)
            const yt = data.youtube || {};
            const realUploads = yt.recentUploads || data.recentVideos || [];
            const realTags = data.tags?.length ? data.tags : (data.audit?.nicheTags || []);

            return {
              id: 'creator_01',
              name: data.name || yt.title || 'Creator Channel',
              handle: data.handle || yt.handle || '@creator',
              avatar: data.avatar || yt.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
              country: data.country || yt.country || 'Sri Lanka',
              residence: data.residence || yt.country || 'Sri Lanka',
              category: data.category || data.audit?.category || 'Education & Science',
              subscribers: data.subscribers !== undefined ? data.subscribers : (yt.subscribers ?? 0),
              subscribersFormatted: data.subscribersFormatted || yt.subscribersFormatted || (data.subscribers ? data.subscribers.toLocaleString() : '0'),
              videoCount: data.videoCount !== undefined ? data.videoCount : (yt.videoCount ?? realUploads.length),
              viewCount: data.viewCount !== undefined ? data.viewCount : (yt.viewCount ?? 0),
              viewsFormatted: data.viewsFormatted || yt.viewsFormatted || (data.viewCount ? data.viewCount.toLocaleString() : '0'),
              avgViewsFormatted: yt.viewCount && yt.videoCount ? Math.round(yt.viewCount / yt.videoCount).toLocaleString() : 'N/A',
              aiScore: data.aiScore || data.audit?.aiScore || 90,
              tags: realTags,
              audit: data.audit || null,
              recentVideos: realUploads,
              youtube: data.youtube || null,
              youtubeConnected: Boolean(data.youtubeConnected),
              verified: Boolean(data.verified),
              googleAccount: data.googleAccount || null,
              credits: typeof data.credits === 'number' ? data.credits : 50,
              startingPriceCents: data.startingPriceCents || 85000,
              bio: data.bio || yt.description || (data.name ? `${data.name} verified channel on NEFRA.` : ''),
              modalityPreference: data.modalityPreference || ['online', 'hybrid'],
              willingToTravel: data.willingToTravel ?? true,
              status: data.status || 'active',
              updatedAt: data.updatedAt || new Date().toISOString()
            };
          }
          return c;
        })
      );
    };

    // 1. Initial fetch from Firestore / server API
    fetchCreatorProfile('creator_01').then((data) => {
      if (data) {
        mergeFirestoreCreator(data);
      }
    });

    // 2. Real-time Firestore snapshot listener
    const unsubscribe = subscribeToCreatorProfile('creator_01', (data) => {
      if (data) {
        mergeFirestoreCreator(data);
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const [rateCards, setRateCards] = useState(INITIAL_RATE_CARDS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [credits, setCredits] = useState(() => {
    try {
      const saved = localStorage.getItem('nefra_credits');
      if (saved !== null && !isNaN(Number(saved))) return Number(saved);
    } catch (e) {}
    return 50;
  });
  const [bids, setBids] = useState([]);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOG);
  const [platformConfig, setPlatformConfig] = useState(INITIAL_PLATFORM_CONFIG);
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('nefra_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [
      { description: "Welcome creator bonus", amount: 50, timestamp: "Today, 10:00 AM" }
    ];
  });


  // Modal State
  const [inspectedCreator, setInspectedCreator] = useState(null);

  // Switch Portal & default route
  const handlePortalChange = (portal) => {
    setActivePortal(portal);
    if (portal === 'creator') setActiveRoute('directory');
    else if (portal === 'brand') setActiveRoute('dashboard');
    else if (portal === 'admin') setActiveRoute('overview');
  };

  // State Machine transition executor
  const handleTransitionContract = (contractId, nextState, metadata = {}) => {
    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        try {
          return transitionContract(c, nextState, metadata);
        } catch (err) {
          alert(err.message);
          return c;
        }
      }
      return c;
    }));
  };

  // Direct Hire via Rate Card into pre-funded Escrow
  const handleHirePackage = (creator, pkg) => {
    const fees = calculateContractFees(pkg.priceCents, platformConfig.feePercent);
    const milestones = calculateMilestones(pkg.priceCents);

    const newContract = {
      id: `cnt_${Date.now()}`,
      brandOrgId: "brand_acme",
      brandName: "Acme Enterprise Corp",
      creatorId: creator.id,
      creatorName: creator.name,
      campaignTitle: `${pkg.title} - Direct Order`,
      packageType: pkg.title,
      amountCents: pkg.priceCents,
      feePercent: platformConfig.feePercent,
      platformFeeCents: fees.platformFeeCents,
      netCreatorCents: fees.netCreatorCents,
      state: "funded",
      revisionsLeft: pkg.revisions || 2,
      deadline: "2026-11-28",
      deliverableUrl: null,
      modality: pkg.modality || "online",
      milestones,
      events: [
        {
          id: `evt_${Date.now()}`,
          from: "pending_payment",
          to: "funded",
          actor: "brand",
          reason: `100% pre-funded escrow deposit confirmed for ${creator.name}`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setContracts([newContract, ...contracts]);
    setActivePortal('brand');
    setActiveRoute('contracts');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  // Creator Bidding
  const handleAddNewBid = (bidData) => {
    setBids([bidData, ...bids]);
    setCampaigns(prev => prev.map(c => {
      if (c.id === bidData.campaignId) {
        return { ...c, bidsCount: (c.bidsCount || 0) + 1 };
      }
      return c;
    }));
  };

  // Spend Credits
  const handleDeductCredits = (amount, description = 'AI feature usage') => {
    let nextCredits = 0;
    setCredits(prev => {
      nextCredits = Math.max(0, prev - amount);
      try { localStorage.setItem('nefra_credits', String(nextCredits)); } catch (e) {}
      return nextCredits;
    });
    setTransactions(prev => {
      const updated = [
        { description, amount: -amount, timestamp: "Just now" },
        ...prev
      ];
      try { localStorage.setItem('nefra_transactions', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    console.log(`%c💳 [Billing] Deducted ${amount} Credits (${description}). Remaining Balance: ${nextCredits}`, 'color: #f59e0b; font-weight: bold; font-size: 13px;');
    if (db) {
      try {
        const creatorRef = doc(db, 'creators', 'creator_01');
        setDoc(creatorRef, { credits: nextCredits }, { merge: true });
      } catch (e) {}
    }
  };

  // Refill Credits (via Stripe Sandbox or demo)
  const handleRefillCredits = (amount = 50, receipt = null) => {
    let nextCredits = 0;
    setCredits(prev => {
      nextCredits = prev + amount;
      try { localStorage.setItem('nefra_credits', String(nextCredits)); } catch (e) {}
      return nextCredits;
    });
    const txDesc = receipt?.paymentIntentId
      ? `Stripe Sandbox Top-up (+${amount} credits • Tx: ${receipt.paymentIntentId.slice(-8)})`
      : `Credit refill bonus (+${amount} credits)`;

    setTransactions(prev => {
      const updated = [
        { description: txDesc, amount, timestamp: "Just now" },
        ...prev
      ];
      try { localStorage.setItem('nefra_transactions', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });

    console.log(`%c💳 [Stripe Billing] Added +${amount} Credits. New Balance: ${nextCredits}`, 'color: #10b981; font-weight: bold; font-size: 14px;');

    if (db) {
      try {
        const creatorRef = doc(db, 'creators', 'creator_01');
        setDoc(creatorRef, { credits: nextCredits }, { merge: true });
      } catch (e) {}
    }
  };

  // Open Dispute
  const handleOpenDispute = (contract) => {
    const reason = prompt("Enter the reason for opening an escrow dispute (required):");
    if (!reason || !reason.trim()) return;

    handleTransitionContract(contract.id, 'disputed', {
      actor: activePortal === 'creator' ? 'creator' : 'brand',
      reason: `Dispute opened: ${reason}`
    });
    alert("Contract frozen in dispute. Escalated to the Admin backoffice for arbitration.");
  };

  // Admin Dispute Resolution
  const handleResolveDispute = ({ contractId, outcome, splitPercentCreator, adminReason }) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    const nextState = outcome === 'refund' ? 'refunded' : 'released';
    handleTransitionContract(contractId, nextState, {
      actor: 'admin',
      reason: `Admin arbitration determination: ${outcome.toUpperCase()} (${adminReason})`
    });

    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        admin: "admin@nefra.com",
        action: `Arbitrated Dispute (${outcome.toUpperCase()})`,
        target: `${contract.campaignTitle} — ${adminReason}`,
        timestamp: "Just now"
      },
      ...prev
    ]);
  };

  // Admin Creator Approval
  const handleApproveCreator = (creatorId) => {
    setCreators(prev => prev.map(c => c.id === creatorId ? { ...c, status: 'active' } : c));
    setAuditLogs(prev => [
      {
        id: `log_${Date.now()}`,
        admin: "admin@nefra.com",
        action: "Approved Creator",
        target: `Creator ${creatorId} activated and listed on directory`,
        timestamp: "Just now"
      },
      ...prev
    ]);
  };

  // Brand New Campaign Publishing
  const handlePublishCampaign = (newCamp) => {
    setCampaigns([newCamp, ...campaigns]);
    setActiveRoute('campaigns');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#fafafa] flex flex-col font-sans">
      {/* Top Bar with Frictionless Portal Switcher & Persona Indicator */}
      <TopBar
        activePortal={activePortal}
        setActivePortal={handlePortalChange}
        credits={credits}
        onRefillCredits={handleRefillCredits}
        activeCreator={creators[0]}
      />

      <div className="flex-1 flex w-full">
        {/* Left Portal Sidebar */}
        <Sidebar
          activePortal={activePortal}
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
          unreadDisputesCount={contracts.filter(c => c.state === 'disputed').length}
          pendingReviewCount={creators.filter(c => c.status === 'pending_review').length}
        />

        {/* Main Workspace Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* ================= CREATOR PORTAL ROUTES ================= */}
          {activePortal === 'creator' && (
            <>
              {activeRoute === 'directory' && (
                <PublicDirectory
                  creators={creators}
                  onSelectCreator={(c) => setInspectedCreator(c)}
                />
              )}
              {activeRoute === 'dashboard' && (
                <CreatorDashboard
                  creator={creators[0]}
                  contracts={contracts}
                  rateCards={rateCards}
                  campaigns={campaigns}
                  credits={credits}
                  onNavigate={setActiveRoute}
                />
              )}
              {activeRoute === 'connectors' && (
                <CreatorConnectors
                  creator={creators[0]}
                  onUpdateCreator={(updated) => {
                    setCreators(prev => prev.map(c => c.id === updated.id ? updated : c));
                  }}
                />
              )}
              {activeRoute === 'rate-cards' && (
                <RateCardsManager
                  rateCards={rateCards}
                  setRateCards={setRateCards}
                  feePercent={platformConfig.feePercent}
                  creator={creators[0]}
                />
              )}
              {activeRoute === 'opportunities' && (
                <OpportunitiesBoard
                  campaigns={campaigns}
                  creator={creators[0]}
                  credits={credits}
                  onDeductCredits={handleDeductCredits}
                  onAddNewBid={handleAddNewBid}
                />
              )}
              {activeRoute === 'contracts' && (
                <CreatorContracts
                  contracts={contracts}
                  onTransitionContract={handleTransitionContract}
                  onOpenDispute={handleOpenDispute}
                />
              )}
              {activeRoute === 'audit' && (
                <ChannelAuditView
                  creator={creators[0]}
                  credits={credits}
                  onDeductCredits={(amt) => handleDeductCredits(amt, 'Gemini Multimodal Channel Audit & Diagnostics')}
                  onUpdateAudit={async (newAudit) => {

                    const categoryUpdate = newAudit.category || undefined;
                    const tagsUpdate = (newAudit.nicheTags && newAudit.nicheTags.length > 0) ? newAudit.nicheTags : undefined;
                    const countryUpdate = newAudit.inferredCountry || undefined;

                    setCreators(prev => prev.map(c => c.id === 'creator_01' ? { 
                      ...c, 
                      category: categoryUpdate || c.category,
                      tags: tagsUpdate || c.tags,
                      country: countryUpdate || c.country,
                      residence: countryUpdate || c.residence,
                      audit: newAudit, 
                      aiScore: newAudit.aiScore || c.aiScore 
                    } : c));

                    if (db) {
                      try {
                        const creatorRef = doc(db, 'creators', 'creator_01');
                        const docUpdates = {
                          audit: newAudit,
                          aiScore: newAudit.aiScore || 95,
                          lastAuditedAt: new Date().toISOString()
                        };
                        if (categoryUpdate) docUpdates.category = categoryUpdate;
                        if (tagsUpdate) docUpdates.tags = tagsUpdate;
                        if (countryUpdate) {
                          docUpdates.country = countryUpdate;
                          docUpdates.residence = countryUpdate;
                        }
                        await setDoc(creatorRef, docUpdates, { merge: true });
                      } catch (err) {
                        console.warn('[App] Save audit to Firestore note:', err.message);
                      }
                    }
                  }}
                />
              )}


              {activeRoute === 'credits' && (
                <CreatorWalletView
                  credits={credits}
                  onRefillCredits={handleRefillCredits}
                  transactions={transactions}
                />
              )}
            </>
          )}

          {/* ================= BRAND PORTAL ROUTES ================= */}
          {activePortal === 'brand' && (
            <>
              {activeRoute === 'dashboard' && (
                <BrandDashboard
                  campaigns={campaigns}
                  contracts={contracts}
                  bids={bids}
                  onNavigate={setActiveRoute}
                />
              )}
              {activeRoute === 'campaigns' && (
                <OpportunitiesBoard
                  campaigns={campaigns}
                  creator={creators[0]}
                  credits={credits}
                  onDeductCredits={handleDeductCredits}
                  onAddNewBid={handleAddNewBid}
                />
              )}
              {activeRoute === 'new-campaign' && (
                <AICampaignBuilder
                  onPublishCampaign={handlePublishCampaign}
                  onCancel={() => setActiveRoute('dashboard')}
                />
              )}
              {activeRoute === 'creators' && (
                <CreatorMatchList
                  creators={creators}
                  rateCards={rateCards}
                  onSelectCreator={(c) => setInspectedCreator(c)}
                  onHirePackage={handleHirePackage}
                />
              )}
              {activeRoute === 'contracts' && (
                <BrandContracts
                  contracts={contracts}
                  onTransitionContract={handleTransitionContract}
                  onOpenDispute={handleOpenDispute}
                />
              )}
              {activeRoute === 'advisor' && (
                <NefraSenseAdvisor
                  campaigns={campaigns}
                />
              )}
            </>
          )}

          {/* ================= ADMIN PORTAL ROUTES ================= */}
          {activePortal === 'admin' && (
            <>
              {activeRoute === 'overview' && (
                <AdminOverview
                  contracts={contracts}
                  creators={creators}
                  feePercent={platformConfig.feePercent}
                  onNavigate={setActiveRoute}
                />
              )}
              {activeRoute === 'creators' && (
                <CreatorReviewQueue
                  creators={creators}
                  onApproveCreator={handleApproveCreator}
                  onRejectCreator={() => {}}
                />
              )}
              {activeRoute === 'disputes' && (
                <DisputeResolution
                  contracts={contracts}
                  onResolveDispute={handleResolveDispute}
                />
              )}
              {activeRoute === 'contracts' && (
                <BrandContracts
                  contracts={contracts}
                  onTransitionContract={handleTransitionContract}
                  onOpenDispute={handleOpenDispute}
                />
              )}
              {activeRoute === 'config' && (
                <PlatformConfig
                  config={platformConfig}
                  onUpdateConfig={(newConf) => setPlatformConfig(newConf)}
                />
              )}
              {activeRoute === 'audit-log' && (
                <AdminAuditLog
                  auditLogs={auditLogs}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global 3-Video Scorecard & Creator Inspection Modal */}
      {inspectedCreator && (
        <CreatorDetailModal
          creator={inspectedCreator}
          rateCards={rateCards}
          isOpen={Boolean(inspectedCreator)}
          onClose={() => setInspectedCreator(null)}
          onHirePackage={handleHirePackage}
        />
      )}
    </div>
  );
}
