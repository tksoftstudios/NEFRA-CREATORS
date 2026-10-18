import React, { useState, useEffect } from 'react';
import { TopBar } from './components/navigation/TopBar';
import { Sidebar } from './components/navigation/Sidebar';
import { PortalSwitchTransition } from './components/navigation/PortalSwitchTransition';
import { PublicDirectory } from './components/directory/PublicDirectory';
import { CreatorDetailModal } from './components/directory/CreatorDetailModal';

// Landing & Onboarding
import { LandingPage } from './components/landing/LandingPage';
import { OnboardingStepper } from './components/onboarding/OnboardingStepper';

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
import { BrandCampaignsManager } from './components/brand/BrandCampaignsManager';
import { AICampaignBuilder } from './components/brand/AICampaignBuilder';
import { CreatorMatchList } from './components/brand/CreatorMatchList';
import { BrandContracts } from './components/brand/BrandContracts';
import { NefraSenseAdvisor } from './components/brand/NefraSenseAdvisor';
import { AIContentCreator } from './components/brand/AIContentCreator';
import { BrandWalletView } from './components/brand/BrandWalletView';
import { NefraSenseFloatingAdvisor } from './components/common/NefraSenseFloatingAdvisor';

// Chat & Fiverr-Style Gig Inbox
import { GigChatInbox } from './components/chat/GigChatInbox';

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
  INITIAL_AUDIT_LOG,
  INITIAL_BIDS,
  INITIAL_CONVERSATIONS
} from './data/seedData';
import { deduplicateCreators } from './lib/utils';
import confetti from 'canvas-confetti';
import { 
  fetchCreatorProfile, 
  subscribeToCreatorProfile 
} from './services/youtubeOAuthService';
import { 
  subscribeToAuth, 
  signInWithGoogle, 
  signOutUser, 
  getUserProfile, 
  fetchAllRegisteredCreators 
} from './services/authService';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './config/firebaseConfig.js';
import { getSavedCurrency, saveCurrency } from './services/currencyService';
import { AIScoreJustificationModal } from './components/creator/AIScoreJustificationModal';
import {
  deductCreditsInFirestore,
  refillCreditsInFirestore,
  subscribeToUserCredits,
  saveBidToFirestore,
  subscribeToBidsFromFirestore,
  saveConversationToFirestore,
  subscribeToConversationsFromFirestore,
  subscribeToTransactions,
  saveContractToFirestore,
  subscribeToContractsFromFirestore,
  recordEscrowPaymentInFirestore
} from './services/firestoreSyncService';

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pendingRole, setPendingRole] = useState(null); // 'creator' | 'brand'

  // Multi-Currency, Theme & AI Score Breakdown State
  const [preferredCurrency, setPreferredCurrency] = useState(getSavedCurrency);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('nefra_theme') || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  const [isScoreJustificationOpen, setIsScoreJustificationOpen] = useState(false);

  // Sync theme with HTML document element and localStorage
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    try {
      localStorage.setItem('nefra_theme', theme);
    } catch (e) {}
  }, [theme]);

  const handleCurrencyChange = (newCurrency) => {
    setPreferredCurrency(newCurrency);
    saveCurrency(newCurrency);
  };

  const handleThemeToggle = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Navigation State
  const [activePortal, setActivePortal] = useState('creator'); // 'creator' | 'brand' | 'admin'
  const [activeRoute, setActiveRoute] = useState('directory');

  // Full-screen Portal Switching Transition State
  const [portalTransition, setPortalTransition] = useState({
    isTransitioning: false,
    targetPortal: null,
    fromPortal: null
  });

  // Sync portal theme with HTML document element
  useEffect(() => {
    document.documentElement.setAttribute('data-portal', activePortal);
    if (activePortal === 'brand') {
      document.documentElement.classList.add('theme-brand');
      document.documentElement.classList.remove('theme-creator');
    } else {
      document.documentElement.classList.add('theme-creator');
      document.documentElement.classList.remove('theme-brand');
    }
  }, [activePortal]);

  // Shared Data State
  const [creators, setCreators] = useState(() => deduplicateCreators(INITIAL_CREATORS));

  const [rateCards, setRateCards] = useState(INITIAL_RATE_CARDS);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  
  // Creator Credits (Nefra Credits) - Synced from Firestore
  const [creatorCredits, setCreatorCredits] = useState(50);

  // Dedicated Brand Credits - Synced from Firestore
  const [brandCredits, setBrandCredits] = useState(250);

  // Backward compatibility alias
  const credits = creatorCredits;
  const setCredits = setCreatorCredits;

  // Real-time Bids State - Synced from Firestore
  const [bids, setBids] = useState(INITIAL_BIDS);

  useEffect(() => {
    const unsubscribeBids = subscribeToBidsFromFirestore((firestoreBids) => {
      if (firestoreBids && firestoreBids.length > 0) {
        setBids(firestoreBids);
      }
    });
    return () => unsubscribeBids();
  }, []);

  // Fiverr-Style Gig Conversations State - Synced from Firestore
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState(null);

  useEffect(() => {
    const unsubscribeConvs = subscribeToConversationsFromFirestore((firestoreConvs) => {
      if (firestoreConvs) {
        setConversations(prev => {
          const map = new Map();
          INITIAL_CONVERSATIONS.forEach(c => map.set(c.id, c));
          prev.forEach(c => map.set(c.id, c));
          firestoreConvs.forEach(c => map.set(c.id, c));
          return Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.lastActivity || a.updatedAt || 0).getTime();
            const timeB = new Date(b.lastActivity || b.updatedAt || 0).getTime();
            return timeB - timeA;
          });
        });
      }
    });
    return () => unsubscribeConvs();
  }, []);

  // Real-time Escrow Contracts State - Synced from Firestore
  useEffect(() => {
    const unsubscribeContracts = subscribeToContractsFromFirestore((firestoreContracts) => {
      if (firestoreContracts) {
        setContracts(prev => {
          const map = new Map();
          INITIAL_CONTRACTS.forEach(c => map.set(c.id, c));
          prev.forEach(c => map.set(c.id, c));
          firestoreContracts.forEach(c => map.set(c.id, c));
          return Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.updatedAt || a.events?.[a.events.length - 1]?.timestamp || 0).getTime();
            const timeB = new Date(b.updatedAt || b.events?.[b.events.length - 1]?.timestamp || 0).getTime();
            return timeB - timeA;
          });
        });
      }
    });
    return () => unsubscribeContracts();
  }, []);

  const unreadMessagesCount = React.useMemo(() => {
    return conversations.reduce((acc, conv) => {
      const count = activePortal === 'brand' ? (conv.unreadForBrand || 0) : (conv.unreadForCreator || 0);
      return acc + count;
    }, 0);
  }, [conversations, activePortal]);

  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOG);
  const [platformConfig, setPlatformConfig] = useState(INITIAL_PLATFORM_CONFIG);

  // Creator Transactions - Synced from Firestore
  const [creatorTransactions, setCreatorTransactions] = useState([
    { description: "Welcome creator bonus", amount: 50, timestamp: "Today, 10:00 AM" }
  ]);

  // Dedicated Brand Transactions - Synced from Firestore
  const [brandTransactions, setBrandTransactions] = useState([
    { description: "Welcome business marketing credits", amount: 250, timestamp: "Today, 10:00 AM" }
  ]);

  // Backward compatibility alias
  const transactions = creatorTransactions;
  const setTransactions = setCreatorTransactions;

  // Modal State
  const [inspectedCreator, setInspectedCreator] = useState(null);

  // Real-time Firestore Credits & Transactions Subscription for current user / active role
  useEffect(() => {
    const targetId = currentUser ? currentUser.uid : (activePortal === 'brand' ? 'brand_01' : 'creator_01');
    const role = activePortal === 'brand' ? 'brand' : 'creator';

    const unsubscribeCredits = subscribeToUserCredits(targetId, role, (balance) => {
      if (role === 'brand') {
        setBrandCredits(balance);
      } else {
        setCreatorCredits(balance);
      }
    });

    const unsubscribeTransactions = subscribeToTransactions(targetId, role, (txList) => {
      if (role === 'brand') {
        setBrandTransactions(txList);
      } else {
        setCreatorTransactions(txList);
      }
    });

    return () => {
      unsubscribeCredits();
      unsubscribeTransactions();
    };
  }, [currentUser, activePortal]);


  // Load all registered creators from Cloud Firestore into directory (deduplicated)
  useEffect(() => {
    fetchAllRegisteredCreators().then(registeredList => {
      if (registeredList && registeredList.length > 0) {
        setCreators(prev => {
          // Prepend registered live creators and deduplicate with existing
          return deduplicateCreators([...registeredList, ...prev]);
        });
      }
    });
  }, []);

  // 1. Subscribe to Firebase Auth (Google tokens, browser sessions & multi-account switching)
  useEffect(() => {
    const unsubscribeAuth = subscribeToAuth(async (user, profile) => {
      setCurrentUser(user);
      setUserProfile(profile);
      setAuthLoading(false);

      if (user) {
        console.log(`%c🔐 [Auth] Active Google Session: ${user.email} (UID: ${user.uid})`, 'color: #3b82f6; font-weight: bold;');
        
        // If onboarded user has a designated role, route directly
        if (profile?.onboardingCompleted) {
          if (profile.role) {
            setActivePortal(profile.role);
            if (profile.role === 'creator') setActiveRoute('directory');
            else if (profile.role === 'brand') setActiveRoute('dashboard');
          }
          if (typeof profile.creatorCredits === 'number') {
            setCreatorCredits(profile.creatorCredits);
          } else if (typeof profile.credits === 'number') {
            setCreatorCredits(profile.credits);
          }
          if (typeof profile.brandCredits === 'number') {
            setBrandCredits(profile.brandCredits);
          }
        }
      } else {
        console.log('%c🔓 [Auth] No active session. Rendering Landing Page.', 'color: #71717a;');
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Determine active creator for creator portal
  const activeCreator = React.useMemo(() => {
    if (currentUser && userProfile?.role !== 'brand') {
      const match = creators.find(c => c.id === currentUser.uid || c.googleAccount?.uid === currentUser.uid);
      if (match) return match;
    }
    return creators[0] || INITIAL_CREATORS[0];
  }, [creators, currentUser, userProfile?.role]);

  // Filtered creator directories:
  // 1. For Brand / Business Portal: never show the business user's own profile or account
  const brandVisibleCreators = React.useMemo(() => {
    return deduplicateCreators(creators).filter(c => {
      if (currentUser?.uid && (c.id === currentUser.uid || c.googleAccount?.uid === currentUser.uid)) {
        return false;
      }
      if (currentUser?.email && c.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return false;
      }
      if (userProfile?.uid && c.id === userProfile.uid) {
        return false;
      }
      if (userProfile?.role === 'brand' && (c.role === 'brand' || c.isBrand)) {
        return false;
      }
      return true;
    });
  }, [creators, currentUser, userProfile]);

  // 2. For Creator Portal: never show the creator's own profile in the directory to browse/hire
  const creatorVisibleDirectory = React.useMemo(() => {
    return deduplicateCreators(creators).filter(c => {
      if (activeCreator?.id && c.id === activeCreator.id) {
        return false;
      }
      if (currentUser?.uid && (c.id === currentUser.uid || c.googleAccount?.uid === currentUser.uid)) {
        return false;
      }
      if (currentUser?.email && c.email && c.email.toLowerCase() === currentUser.email.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [creators, activeCreator, currentUser]);

  // 3. For Creator Portal: exclude any campaigns created by the creator's own brand account
  const creatorVisibleCampaigns = React.useMemo(() => {
    return campaigns.filter(camp => {
      if (currentUser?.uid && camp.brandOrgId === currentUser.uid) {
        return false;
      }
      return true;
    });
  }, [campaigns, currentUser]);

  // Real-time Firestore sync for the active creator profile (skip if brand)
  useEffect(() => {
    if (currentUser && userProfile?.role === 'brand') {
      return;
    }

    const targetId = currentUser ? currentUser.uid : 'creator_01';
    
    const mergeFirestoreCreator = (data) => {
      if (!data) return;
      if (typeof data.credits === 'number') {
        setCreatorCredits(data.credits);
      }

      setCreators((prev) => {
        const exists = prev.some(c => c.id === targetId);
        const yt = data.youtube || {};
        const realUploads = yt.recentUploads || data.recentVideos || [];
        const realTags = data.tags?.length ? data.tags : (data.audit?.nicheTags || []);

        const creatorObject = {
          id: targetId,
          name: data.name || yt.title || currentUser?.displayName || 'Creator Channel',
          handle: data.handle || yt.handle || '@creator',
          avatar: data.avatar || yt.avatar || currentUser?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
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
          googleAccount: data.googleAccount || (currentUser ? { uid: currentUser.uid, email: currentUser.email } : null),
          credits: typeof data.credits === 'number' ? data.credits : 50,
          startingPriceCents: data.startingPriceCents || 85000,
          bio: data.bio || yt.description || (data.name ? `${data.name} verified channel on NEFRA.` : ''),
          modalityPreference: data.modalityPreference || ['online', 'hybrid'],
          willingToTravel: data.willingToTravel ?? true,
          status: data.status || 'active',
          updatedAt: data.updatedAt || new Date().toISOString()
        };

        if (exists) {
          return deduplicateCreators(prev.map(c => c.id === targetId ? { ...c, ...creatorObject } : c));
        } else {
          return deduplicateCreators([creatorObject, ...prev]);
        }
      });
    };

    fetchCreatorProfile(targetId).then((data) => {
      if (data) mergeFirestoreCreator(data);
    });

    const unsubscribe = subscribeToCreatorProfile(targetId, (data) => {
      if (data) mergeFirestoreCreator(data);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [currentUser, userProfile?.role]);

  // Real-time Firestore sync for Brand Account profile and credits
  useEffect(() => {
    if (!currentUser || userProfile?.role !== 'brand' || !db) return;
    try {
      const brandRef = doc(db, 'brands', currentUser.uid);
      const unsubscribe = onSnapshot(brandRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.brandCredits === 'number') {
            setBrandCredits(data.brandCredits);
          } else if (typeof data.credits === 'number') {
            setBrandCredits(data.credits);
          }
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('[App] Brand sync note:', err);
    }
  }, [currentUser, userProfile?.role]);



  // Handle Google Auth Trigger (from Landing or TopBar)
  const handleGoogleSignIn = async (desiredRole = null) => {
    setIsAuthenticating(true);
    try {
      if (desiredRole) setPendingRole(desiredRole);
      const user = await signInWithGoogle();
      const profile = await getUserProfile(user.uid);
      setCurrentUser(user);
      setUserProfile(profile);

      if (profile?.onboardingCompleted && profile.role) {
        setActivePortal(profile.role);
        if (profile.role === 'creator') setActiveRoute('directory');
        else if (profile.role === 'brand') setActiveRoute('dashboard');
      } else if (desiredRole) {
        setActivePortal(desiredRole);
      }
    } catch (err) {
      console.warn('[App] Google Sign-In note:', err);
      if (err.code !== 'auth/popup-closed-by-user' && err.code !== 'auth/cancelled-popup-request') {
        alert(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Focus Selection on Landing Page
  const handleSelectFocus = (focus) => {
    setPendingRole(focus);
    handleGoogleSignIn(focus);
  };

  // Sign out
  const handleSignOut = async () => {
    try {
      await signOutUser();
      setCurrentUser(null);
      setUserProfile(null);
      setPendingRole(null);
    } catch (err) {
      console.error('[App] Sign out error:', err);
    }
  };

  // Switch to another Google Account
  const handleSwitchAccount = async () => {
    try {
      await handleGoogleSignIn(pendingRole || activePortal);
    } catch (err) {
      console.error('[App] Switch Account error:', err);
    }
  };

  // Handle Onboarding Completion
  const handleOnboardingComplete = ({ role: completedRole, profile }) => {
    setUserProfile({ ...profile, onboardingCompleted: true, role: completedRole });
    setActivePortal(completedRole);
    setActiveRoute(completedRole === 'creator' ? 'directory' : 'dashboard');

    if (completedRole === 'creator') {
      setCreators(prev => {
        return deduplicateCreators([profile, ...prev]);
      });
      const creds = typeof profile.creatorCredits === 'number' 
        ? profile.creatorCredits 
        : (typeof profile.credits === 'number' ? profile.credits : 50);
      setCreatorCredits(creds);
    } else if (completedRole === 'brand') {
      const bCreds = typeof profile.brandCredits === 'number' 
        ? profile.brandCredits 
        : (typeof profile.credits === 'number' ? profile.credits : 250);
      setBrandCredits(bCreds);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Switch Portal with Full-screen Transition & default route
  const handlePortalChange = (portal) => {
    if (portal === activePortal) return;

    // Trigger full screen transition
    setPortalTransition({
      isTransitioning: true,
      targetPortal: portal,
      fromPortal: activePortal
    });

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
          const updated = transitionContract(c, nextState, metadata);
          saveContractToFirestore(updated);
          return updated;
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
      brandOrgId: currentUser?.uid || "brand_acme",
      brandName: userProfile?.companyName || "Acme Enterprise Corp",
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
    saveContractToFirestore(newContract);
    recordEscrowPaymentInFirestore({
      brandOrgId: newContract.brandOrgId,
      brandName: newContract.brandName,
      creatorId: newContract.creatorId,
      creatorName: newContract.creatorName,
      contractId: newContract.id,
      offerTitle: newContract.packageType,
      amountCents: newContract.amountCents,
      platformFeeCents: newContract.platformFeeCents,
      netCreatorCents: newContract.netCreatorCents
    });
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
    setBids(prev => [bidData, ...prev]);
    saveBidToFirestore(bidData);
    setCampaigns(prev => prev.map(c => {
      if (c.id === bidData.campaignId) {
        return { ...c, bidsCount: (c.bidsCount || 0) + 1 };
      }
      return c;
    }));
  };

  // Brand Accepts Creator Proposal & Funds Escrow
  const handleAcceptBid = (bid, campaign) => {
    const amountCents = bid.amountCents || campaign?.budgetCents || 250000;
    const fees = calculateContractFees(amountCents, platformConfig.feePercent);
    const milestones = calculateMilestones(amountCents);

    const newContract = {
      id: `cnt_${Date.now()}`,
      brandOrgId: campaign?.brandOrgId || currentUser?.uid || "brand_acme",
      brandName: campaign?.brandName || userProfile?.companyName || "My Brand",
      creatorId: bid.creatorId || "creator_03",
      creatorName: bid.creatorName || "Elena Rostova",
      campaignTitle: campaign?.title || "Influencer Marketing Campaign",
      packageType: campaign?.deliverableType || "Dedicated Video Integration",
      amountCents,
      feePercent: platformConfig.feePercent,
      platformFeeCents: fees.platformFeeCents,
      netCreatorCents: fees.netCreatorCents,
      state: "funded",
      revisionsLeft: 2,
      deadline: campaign?.deadline || "2026-11-28",
      deliverableUrl: null,
      modality: campaign?.modality || "online",
      milestones,
      events: [
        {
          id: `evt_${Date.now()}`,
          from: "pending_payment",
          to: "funded",
          actor: "brand",
          reason: `Proposal accepted & 100% pre-funded escrow locked for ${bid.creatorName}`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setContracts([newContract, ...contracts]);
    saveContractToFirestore(newContract);
    recordEscrowPaymentInFirestore({
      brandOrgId: newContract.brandOrgId,
      brandName: newContract.brandName,
      creatorId: newContract.creatorId,
      creatorName: newContract.creatorName,
      contractId: newContract.id,
      offerTitle: newContract.packageType,
      amountCents: newContract.amountCents,
      platformFeeCents: newContract.platformFeeCents,
      netCreatorCents: newContract.netCreatorCents
    });
    setBids(prev => prev.map(b => b.id === bid.id ? { ...b, status: 'accepted' } : b));
    setActivePortal('brand');
    setActiveRoute('contracts');

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  // -------------------------------------------------------------
  // FIVERR-STYLE GIG CHAT & CUSTOM OFFERS (Firestore Synced)
  // -------------------------------------------------------------
  const handleSendMessage = (conversationId, messagePayload) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      const newMsg = {
        id: `msg_${Date.now()}`,
        timestamp: 'Just now',
        ...messagePayload
      };
      const updatedConv = {
        ...conv,
        messages: [...conv.messages, newMsg],
        lastActivity: new Date().toISOString(),
        unreadForBrand: messagePayload.senderRole === 'creator' ? (conv.unreadForBrand || 0) + 1 : 0,
        unreadForCreator: messagePayload.senderRole === 'brand' ? (conv.unreadForCreator || 0) + 1 : 0
      };
      saveConversationToFirestore(updatedConv);
      return updatedConv;
    }));
  };

  const handleSendCustomOffer = (conversationId, offerPayload) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      const offerMsg = {
        id: `msg_${Date.now()}`,
        type: 'custom_offer',
        senderRole: offerPayload.senderRole || (activePortal === 'brand' ? 'brand' : 'creator'),
        senderName: offerPayload.senderRole === 'brand'
          ? (conv.brandName || userProfile?.companyName || 'Brand')
          : (conv.creatorName || activeCreator?.name || 'Creator'),
        text: `Custom Gig Offer submitted: "${offerPayload.title}" for $${(offerPayload.priceCents / 100).toLocaleString()}. Turnaround: ${offerPayload.turnaroundDays} days.`,
        offer: offerPayload,
        timestamp: 'Just now'
      };
      const updatedConv = {
        ...conv,
        messages: [...conv.messages, offerMsg],
        lastActivity: new Date().toISOString(),
        unreadForBrand: offerPayload.senderRole === 'creator' ? (conv.unreadForBrand || 0) + 1 : 0,
        unreadForCreator: offerPayload.senderRole === 'brand' ? (conv.unreadForCreator || 0) + 1 : 0
      };
      saveConversationToFirestore(updatedConv);
      return updatedConv;
    }));
  };

  const handleAcceptCustomOffer = async (conversationId, offer, conversation) => {
    const amountCents = offer.priceCents;
    const fees = calculateContractFees(amountCents, platformConfig.feePercent);
    const milestones = calculateMilestones(amountCents, offer.turnaroundDays);

    const brandOrgId = conversation.brandOrgId || currentUser?.uid || "brand_acme";
    const brandName = conversation.brandName || userProfile?.companyName || "Acme Enterprise Corp";
    const creatorId = conversation.creatorId || "creator_01";
    const creatorName = conversation.creatorName || "Creator";

    const newContract = {
      id: `cnt_${Date.now().toString().slice(-6)}`,
      brandOrgId,
      brandName,
      creatorId,
      creatorName,
      campaignTitle: conversation.campaignTitle || offer.title,
      packageType: offer.title,
      deliverables: offer.deliverables,
      amountCents,
      feePercent: platformConfig.feePercent,
      platformFeeCents: fees.platformFeeCents,
      netCreatorCents: fees.netCreatorPayoutCents || (amountCents - fees.platformFeeCents),
      state: "funded",
      revisionsLeft: 2,
      deadline: new Date(Date.now() + (offer.turnaroundDays || 7) * 86400000).toISOString().split('T')[0],
      deliverableUrl: null,
      modality: "online",
      milestones,
      events: [
        {
          id: `evt_${Date.now()}`,
          from: "pending_payment",
          to: "funded",
          actor: activePortal === 'brand' ? 'brand' : 'creator',
          reason: `Custom gig offer accepted in chat. 100% Escrow funded ($${(amountCents / 100).toLocaleString()})`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setContracts(prev => [newContract, ...prev]);
    await saveContractToFirestore(newContract);

    // Record monetary escrow transaction in Firestore for both parties
    await recordEscrowPaymentInFirestore({
      brandOrgId,
      brandName,
      creatorId,
      creatorName,
      contractId: newContract.id,
      offerTitle: offer.title,
      amountCents,
      platformFeeCents: fees.platformFeeCents,
      netCreatorCents: newContract.netCreatorCents
    });

    // Mark offer accepted in chat and post confirmation bot note
    setConversations(prev => prev.map(conv => {
      if (conv.id !== conversationId) return conv;
      const updatedMessages = conv.messages.map(m => {
        if (m.type === 'custom_offer' && m.offer?.id === offer.id) {
          return {
            ...m,
            offer: { ...m.offer, status: 'accepted' }
          };
        }
        return m;
      });

      const systemMsg = {
        id: `msg_${Date.now()}`,
        senderRole: 'system',
        senderName: 'Nefra Escrow Bot',
        text: `Custom Offer Accepted! Contract #${newContract.id} has been created and 100% pre-funded ($${(amountCents / 100).toLocaleString()}) in escrow. Funds are locked securely until deliverables are approved.`,
        timestamp: 'Just now'
      };

      const updatedConv = {
        ...conv,
        messages: [...updatedMessages, systemMsg],
        lastActivity: new Date().toISOString()
      };
      saveConversationToFirestore(updatedConv);
      return updatedConv;
    }));

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleOpenChatWithCreator = (creator, initialMessage = null) => {
    if (!creator) return;

    const brandId = currentUser?.uid || 'brand_01';
    const brandName = userProfile?.companyName || currentUser?.displayName || 'Acme Enterprise Corp';
    const brandAvatar = currentUser?.photoURL || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80';
    const creatorId = creator.googleAccount?.uid || creator.uid || creator.id || 'creator_01';

    // Must match BOTH this specific brand AND this specific creator
    const existingConv = conversations.find(c => {
      const isSameBrand = (c.brandOrgId === brandId) || 
                          (currentUser?.uid && c.brandOrgId === currentUser.uid);
      if (!isSameBrand) return false;

      const isSameCreator = (c.creatorId === creatorId) ||
                            (creator.id && c.creatorId === creator.id) ||
                            (creator.handle && c.creatorHandle && c.creatorHandle.toLowerCase() === creator.handle.toLowerCase());
      
      return isSameCreator || c.id === `conv_${brandId}_${creatorId}`;
    });

    if (existingConv) {
      if (initialMessage) {
        handleSendMessage(existingConv.id, {
          text: initialMessage,
          senderRole: activePortal === 'brand' ? 'brand' : 'creator',
          senderName: activePortal === 'brand' ? brandName : (creator.name || 'Creator')
        });
      }
      setActiveConversationId(existingConv.id);
    } else {
      const newConvId = `conv_${brandId}_${creatorId}`;
      const newConv = {
        id: newConvId,
        creatorId: creatorId,
        creatorName: creator.name || 'Creator',
        creatorHandle: creator.handle || '@creator',
        creatorAvatar: creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        creatorCategory: creator.category || 'Technology & AI',
        creatorAiScore: creator.aiScore || 90,
        brandOrgId: brandId,
        brandName,
        brandAvatar,
        campaignId: campaigns[0]?.id || 'camp_direct',
        campaignTitle: campaigns[0]?.title || 'Direct Collaboration',
        gigTitle: 'Custom Integration Package',
        unreadForBrand: 0,
        unreadForCreator: 1,
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: `msg_${Date.now()}`,
            senderRole: activePortal === 'brand' ? 'brand' : 'creator',
            senderName: activePortal === 'brand' ? brandName : (creator.name || 'Creator'),
            text: initialMessage || `Hi ${creator.name}! We'd love to discuss a video partnership and review custom gig packages.`,
            timestamp: 'Just now'
          }
        ]
      };

      setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConvId)]);
      setActiveConversationId(newConvId);
      saveConversationToFirestore(newConv);
    }

    setActiveRoute('messages');
  };

  // Spend Creator Credits (Nefra Credits) - Stored in Cloud Firestore
  const handleDeductCreatorCredits = async (amount, description = 'AI feature usage') => {
    const targetId = currentUser ? currentUser.uid : 'creator_01';
    setCreatorCredits(prev => Math.max(0, prev - amount));
    const result = await deductCreditsInFirestore({
      userId: targetId,
      role: 'creator',
      amount,
      description
    });
    console.log(`%c💳 [Creator Billing Firestore] Deducted ${amount} Credits (${description}). Remaining: ${result.remainingCredits}`, 'color: #f59e0b; font-weight: bold;');
    return result;
  };

  // Refill Creator Credits (via Stripe Sandbox) - Stored in Cloud Firestore
  const handleRefillCreatorCredits = async (amount = 50, receipt = null) => {
    const targetId = currentUser ? currentUser.uid : 'creator_01';
    setCreatorCredits(prev => prev + amount);
    const result = await refillCreditsInFirestore({
      userId: targetId,
      role: 'creator',
      amount,
      receipt
    });
    console.log(`%c💳 [Creator Stripe Billing Firestore] Added +${amount} Credits. Balance: ${result.remainingCredits}`, 'color: #10b981; font-weight: bold;');
    return result;
  };

  // Spend Brand Credits - Stored in Cloud Firestore
  const handleDeductBrandCredits = async (amount, description = 'Brand AI feature usage') => {
    const targetId = currentUser ? currentUser.uid : 'brand_01';
    setBrandCredits(prev => Math.max(0, prev - amount));
    const result = await deductCreditsInFirestore({
      userId: targetId,
      role: 'brand',
      amount,
      description
    });
    console.log(`%c💳 [Brand Billing Firestore] Deducted ${amount} Brand Credits (${description}). Balance: ${result.remainingCredits}`, 'color: #3b82f6; font-weight: bold;');
    return result;
  };

  // Refill Brand Credits (via Stripe Sandbox) - Stored in Cloud Firestore
  const handleRefillBrandCredits = async (amount = 250, receipt = null) => {
    const targetId = currentUser ? currentUser.uid : 'brand_01';
    setBrandCredits(prev => prev + amount);
    const result = await refillCreditsInFirestore({
      userId: targetId,
      role: 'brand',
      amount,
      receipt
    });
    console.log(`%c💳 [Brand Stripe Billing Firestore] Added +${amount} Brand Credits. Balance: ${result.remainingCredits}`, 'color: #3b82f6; font-weight: bold;');
    return result;
  };

  // Aliases for creator credits
  const handleDeductCredits = handleDeductCreatorCredits;
  const handleRefillCredits = handleRefillCreatorCredits;

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

  // -------------------------------------------------------------
  // RENDERING LOGIC: GATED BY AUTHENTICATION & ONBOARDING
  // -------------------------------------------------------------

  // 1. Initial Session Hydration Loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center text-white font-sans selection:bg-[#e11d48]">
        <img
          src="/LOGO.png"
          alt="NEFRA Logo"
          className="w-12 h-12 rounded-xl object-contain bg-[#09090b] border border-[#27272a] shadow-xl shadow-[#e11d48]/20 animate-pulse"
        />
        <p className="mt-4 text-xs text-[#a1a1aa] tracking-widest uppercase font-semibold">
          Synchronizing secure Google session...
        </p>
      </div>
    );
  }

  // Demo Login Option (Instant access for testing creator or brand portals)
  const handleDemoLogin = (role = 'brand') => {
    const isBrand = role === 'brand';
    const mockUser = {
      uid: isBrand ? 'brand_demo_user' : 'creator_demo_user',
      email: isBrand ? 'marketing@acmeglobal.io' : 'kaveen@creators.nefra.io',
      displayName: isBrand ? 'Acme Global Marketing' : 'Kaveen Kudagala',
      photoURL: isBrand 
        ? 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    };
    const mockProfile = {
      uid: mockUser.uid,
      role,
      onboardingCompleted: true,
      companyName: isBrand ? 'Acme Global Marketing' : undefined,
      creatorName: isBrand ? undefined : 'Kaveen Kudagala',
      brandCredits: 250,
      creatorCredits: 50,
      credits: isBrand ? 250 : 50
    };
    setCurrentUser(mockUser);
    setUserProfile(mockProfile);
    setActivePortal(role);
    setActiveRoute(isBrand ? 'dashboard' : 'directory');
  };

  // 2. Unauthenticated Visitor -> LANDING PAGE ONLY (Zero Admin features exposed)
  if (!currentUser) {
    return (
      <LandingPage
        creators={creators}
        preferredCurrency={preferredCurrency}
        onSelectFocus={handleSelectFocus}
        onSignIn={handleGoogleSignIn}
        onDemoLogin={handleDemoLogin}
        isAuthenticating={isAuthenticating}
      />
    );
  }

  // 3. Authenticated but Unregistered -> ONBOARDING STEPPER
  if (!userProfile?.onboardingCompleted) {
    return (
      <OnboardingStepper
        user={currentUser}
        initialRole={pendingRole || 'creator'}
        onComplete={handleOnboardingComplete}
        onSignOut={handleSignOut}
      />
    );
  }

  // 4. Authenticated & Onboarded -> MAIN PORTAL WORKSPACE
  return (
    <div className="min-h-screen bg-[#000000] text-[#fafafa] flex flex-col font-sans" data-portal={activePortal}>
      {/* Full-Screen Portal Switching Transition */}
      {portalTransition.isTransitioning && (
        <PortalSwitchTransition
          targetPortal={portalTransition.targetPortal}
          fromPortal={portalTransition.fromPortal}
          onComplete={() => {
            setPortalTransition({
              isTransitioning: false,
              targetPortal: null,
              fromPortal: null
            });
          }}
        />
      )}

      {/* Top Bar with Portal Switcher, Account Indicator & Switch Account Option */}
      <TopBar
        activePortal={activePortal}
        setActivePortal={handlePortalChange}
        credits={creatorCredits}
        creatorCredits={creatorCredits}
        brandCredits={brandCredits}
        onRefillCredits={handleRefillCreatorCredits}
        onRefillCreatorCredits={handleRefillCreatorCredits}
        onRefillBrandCredits={handleRefillBrandCredits}
        activeCreator={activeCreator}
        currentUser={currentUser}
        userProfile={userProfile}
        onSignOut={handleSignOut}
        onSwitchAccount={handleSwitchAccount}
        preferredCurrency={preferredCurrency}
        onCurrencyChange={handleCurrencyChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        onOpenScoreJustification={() => setIsScoreJustificationOpen(true)}
      />

      <div className="flex-1 flex w-full">
        {/* Left Portal Sidebar */}
        <Sidebar
          activePortal={activePortal}
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
          unreadDisputesCount={contracts.filter(c => c.state === 'disputed').length}
          pendingReviewCount={creators.filter(c => c.status === 'pending_review').length}
          unreadMessagesCount={unreadMessagesCount}
        />

        {/* Main Workspace Area */}
        <main className={`flex-1 max-w-7xl mx-auto w-full flex flex-col ${activeRoute === 'messages' ? 'h-[calc(100vh-3.5rem)] p-3 sm:p-4 overflow-hidden' : 'p-4 sm:p-6 lg:p-8'}`}>
          {/* ================= CREATOR PORTAL ROUTES ================= */}
          {activePortal === 'creator' && (
            <>
              {activeRoute === 'directory' && (
                <PublicDirectory
                  creators={creatorVisibleDirectory}
                  onSelectCreator={(c) => setInspectedCreator(c)}
                />
              )}
              {activeRoute === 'messages' && (
                <GigChatInbox
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  activePortal="creator"
                  creators={creatorVisibleDirectory}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onSendCustomOffer={handleSendCustomOffer}
                  onAcceptCustomOffer={handleAcceptCustomOffer}
                  onOpenChat={handleOpenChatWithCreator}
                  onNavigate={setActiveRoute}
                />
              )}
              {activeRoute === 'dashboard' && (
                <CreatorDashboard
                  creator={activeCreator}
                  contracts={contracts}
                  rateCards={rateCards}
                  campaigns={campaigns}
                  credits={creatorCredits}
                  onNavigate={setActiveRoute}
                />
              )}
              {activeRoute === 'connectors' && (
                <CreatorConnectors
                  creator={activeCreator}
                  onUpdateCreator={(updated) => {
                    setCreators(prev => prev.map(c => c.id === updated.id ? updated : c));
                  }}
                  onUpdateRateCards={setRateCards}
                  preferredCurrency={preferredCurrency}
                />
              )}
              {activeRoute === 'rate-cards' && (
                <RateCardsManager
                  rateCards={rateCards}
                  setRateCards={setRateCards}
                  feePercent={platformConfig.feePercent}
                  creator={activeCreator}
                  preferredCurrency={preferredCurrency}
                />
              )}
              {activeRoute === 'opportunities' && (
                <OpportunitiesBoard
                  campaigns={creatorVisibleCampaigns}
                  creator={activeCreator}
                  credits={creatorCredits}
                  onDeductCredits={handleDeductCreatorCredits}
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
                  creator={activeCreator}
                  credits={creatorCredits}
                  onDeductCredits={(amt) => handleDeductCreatorCredits(amt, 'Gemini Multimodal Channel Audit & Diagnostics')}
                  onUpdateAudit={async (newAudit) => {
                    const categoryUpdate = newAudit.category || undefined;
                    const tagsUpdate = (newAudit.nicheTags && newAudit.nicheTags.length > 0) ? newAudit.nicheTags : undefined;
                    const countryUpdate = newAudit.inferredCountry || undefined;

                    setCreators(prev => prev.map(c => c.id === activeCreator.id ? { 
                      ...c, 
                      category: categoryUpdate || c.category,
                      tags: tagsUpdate || c.tags,
                      country: countryUpdate || c.country,
                      residence: countryUpdate || c.residence,
                      audit: newAudit, 
                      aiScore: newAudit.aiScore || c.aiScore 
                    } : c));

                    const targetId = activeCreator.id || currentUser?.uid || 'creator_01';
                    if (db) {
                      try {
                        const creatorRef = doc(db, 'creators', targetId);
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
                  credits={creatorCredits}
                  onRefillCredits={handleRefillCreatorCredits}
                  transactions={creatorTransactions}
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
                  creators={brandVisibleCreators}
                  brandCredits={brandCredits}
                  onNavigate={setActiveRoute}
                  onOpenChat={handleOpenChatWithCreator}
                />
              )}
              {activeRoute === 'content-creator' && (
                <AIContentCreator
                  currentUser={currentUser}
                  userProfile={userProfile}
                  campaigns={campaigns}
                  activeCreator={activeCreator}
                  brandCredits={brandCredits}
                  onDeductBrandCredits={handleDeductBrandCredits}
                  onOpenTopup={() => setActiveRoute('credits')}
                />
              )}
              {activeRoute === 'messages' && (
                <GigChatInbox
                  conversations={conversations}
                  activeConversationId={activeConversationId}
                  activePortal="brand"
                  creators={brandVisibleCreators}
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onSendCustomOffer={handleSendCustomOffer}
                  onAcceptCustomOffer={handleAcceptCustomOffer}
                  onOpenChat={handleOpenChatWithCreator}
                  onNavigate={setActiveRoute}
                />
              )}
              {activeRoute === 'campaigns' && (
                <BrandCampaignsManager
                  campaigns={campaigns}
                  bids={bids}
                  creators={brandVisibleCreators}
                  onNavigate={setActiveRoute}
                  onAcceptBid={handleAcceptBid}
                  onOpenChat={handleOpenChatWithCreator}
                />
              )}
              {activeRoute === 'new-campaign' && (
                <AICampaignBuilder
                  onPublishCampaign={handlePublishCampaign}
                  onCancel={() => setActiveRoute('dashboard')}
                  brandCredits={brandCredits}
                  onDeductBrandCredits={handleDeductBrandCredits}
                  onOpenTopup={() => setActiveRoute('credits')}
                />
              )}
              {activeRoute === 'creators' && (
                <CreatorMatchList
                  creators={brandVisibleCreators}
                  rateCards={rateCards}
                  onSelectCreator={(c) => setInspectedCreator(c)}
                  onHirePackage={handleHirePackage}
                  onOpenChat={handleOpenChatWithCreator}
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
                  creators={brandVisibleCreators}
                  brandCredits={brandCredits}
                  onDeductBrandCredits={handleDeductBrandCredits}
                  onOpenTopup={() => setActiveRoute('credits')}
                />
              )}
              {activeRoute === 'credits' && (
                <BrandWalletView
                  brandCredits={brandCredits}
                  onRefillBrandCredits={handleRefillBrandCredits}
                  transactions={brandTransactions}
                  userProfile={userProfile}
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
          onOpenChat={handleOpenChatWithCreator}
          preferredCurrency={preferredCurrency}
        />
      )}

      {/* Global AI Score Breakdown & Pricing Justification Modal */}
      <AIScoreJustificationModal
        isOpen={isScoreJustificationOpen}
        onClose={() => setIsScoreJustificationOpen(false)}
        creator={activeCreator}
      />

      {/* Global Always-On-Top NefraSense Strategic & Trends Advisor (Bottom Right) */}
      <NefraSenseFloatingAdvisor
        activePortal={activePortal}
        activeRoute={activeRoute}
        creators={activePortal === 'brand' ? brandVisibleCreators : creatorVisibleDirectory}
        campaigns={campaigns}
        activeCreator={activeCreator}
        activeCampaign={campaigns[0]}
        currentUser={currentUser}
        creatorCredits={creatorCredits}
        brandCredits={brandCredits}
        onDeductCredits={handleDeductCreatorCredits}
        onDeductBrandCredits={handleDeductBrandCredits}
        onOpenTopup={() => setActiveRoute('credits')}
      />
    </div>
  );
}
