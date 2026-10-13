/**
 * Marketplace & Credit Economy Service for Nefra Platform
 * Handles:
 * 1. Creator Credit Wallet (starting 50 credits, 5 credits/application, +15 daily refill)
 * 2. Real-time Firestore sync & local persistence for applications
 * 3. Match Compatibility Scoring
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { SEED_CAMPAIGNS } from '../data/seedCampaigns';

const APPLICATIONS_COLLECTION = 'campaign_applications';
const WALLET_STORAGE_KEY = 'nefra_creator_wallet';
const APPLICATIONS_STORAGE_KEY = 'nefra_creator_applications';

const DEFAULT_STARTING_CREDITS = 50;
const APPLICATION_CREDIT_COST = 5;
const REFILL_CREDIT_BONUS = 15;

/**
 * Initializes and retrieves the creator's credit wallet.
 */
export function getCreatorWallet() {
  try {
    const saved = localStorage.getItem(WALLET_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.balance === 'number') {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse creator wallet from localStorage', e);
  }

  // Default starting wallet
  const initialWallet = {
    balance: DEFAULT_STARTING_CREDITS,
    totalEarned: DEFAULT_STARTING_CREDITS,
    totalSpent: 0,
    history: [
      {
        id: 'tx-welcome-01',
        title: 'Welcome Creator Grant',
        delta: DEFAULT_STARTING_CREDITS,
        type: 'credit',
        timestamp: new Date().toISOString(),
        note: 'Welcome grant upon joining Nefra Platform'
      }
    ]
  };

  saveCreatorWallet(initialWallet);
  return initialWallet;
}

/**
 * Persists wallet data to localStorage.
 */
export function saveCreatorWallet(wallet) {
  try {
    localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(wallet));
    window.dispatchEvent(new CustomEvent('nefra_wallet_updated', { detail: wallet }));
  } catch (e) {
    console.warn('Failed to save creator wallet', e);
  }
}

/**
 * Deducts credits for applying to a campaign.
 * Returns { success: boolean, newBalance: number, message: string }
 */
export function deductApplicationCredits(jobTitle = 'Brand Campaign') {
  const wallet = getCreatorWallet();

  if (wallet.balance < APPLICATION_CREDIT_COST) {
    return {
      success: false,
      newBalance: wallet.balance,
      message: `Insufficient credits. You need ${APPLICATION_CREDIT_COST} credits to submit an application.`
    };
  }

  const updatedWallet = {
    ...wallet,
    balance: wallet.balance - APPLICATION_CREDIT_COST,
    totalSpent: (wallet.totalSpent || 0) + APPLICATION_CREDIT_COST,
    history: [
      {
        id: `tx-apply-${Date.now()}`,
        title: `Applied to: ${jobTitle}`,
        delta: -APPLICATION_CREDIT_COST,
        type: 'debit',
        timestamp: new Date().toISOString(),
        note: `AI Proposal generation & submission fee`
      },
      ...wallet.history
    ]
  };

  saveCreatorWallet(updatedWallet);
  return {
    success: true,
    newBalance: updatedWallet.balance,
    message: `Deducted ${APPLICATION_CREDIT_COST} credits.`
  };
}

/**
 * Claims the demo daily refill bonus (+15 credits).
 */
export function refillDemoCredits() {
  const wallet = getCreatorWallet();
  const updatedWallet = {
    ...wallet,
    balance: wallet.balance + REFILL_CREDIT_BONUS,
    totalEarned: (wallet.totalEarned || 0) + REFILL_CREDIT_BONUS,
    history: [
      {
        id: `tx-refill-${Date.now()}`,
        title: 'Demo Daily Refill Bonus',
        delta: REFILL_CREDIT_BONUS,
        type: 'credit',
        timestamp: new Date().toISOString(),
        note: 'Complimentary demo bonus credits added'
      },
      ...wallet.history
    ]
  };

  saveCreatorWallet(updatedWallet);
  return updatedWallet;
}

/**
 * Calculates a match score (0-100%) between a creator and a campaign.
 */
export function calculateMatchScore(creator, campaign) {
  if (!creator || !campaign) return 85;

  let score = 70;

  // Category match
  if (creator.category === campaign.targetCategory) {
    score += 18;
  } else if (
    (creator.category === 'tech' && campaign.targetCategory === 'education') ||
    (creator.category === 'music' && campaign.targetCategory === 'lifestyle')
  ) {
    score += 8;
  }

  // Tag overlap
  if (Array.isArray(creator.tags) && Array.isArray(campaign.requiredTags)) {
    const creatorTagsLower = creator.tags.map((t) => t.toLowerCase());
    const matches = campaign.requiredTags.filter((t) => 
      creatorTagsLower.some((ct) => ct.includes(t.toLowerCase().replace('#', '')) || t.toLowerCase().includes(ct.replace('#', '')))
    );
    score += Math.min(10, matches.length * 4);
  }

  // Verification & Nefra score bonus
  if (creator.verified) score += 3;
  if (creator.nefraScore) {
    score += Math.min(5, Math.floor(creator.nefraScore / 20));
  }

  return Math.min(99, Math.max(68, score));
}

/**
 * Pre-seeded sample applications for realistic interactive experience.
 */
const DEFAULT_APPLICATIONS = [
  {
    id: 'app-seed-01',
    campaignId: 'camp-music-1',
    campaignTitle: 'Acoustic Soundtracks for JAPAC Eco-Resort Film',
    brandName: 'Aura Retreats & Hospitality',
    brandLogo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=100&auto=format&fit=crop&q=80',
    creatorId: 'creator-music-1',
    creatorName: 'Acoustic Soul Sessions',
    budgetFormatted: '$2,400 USD',
    deliverable: 'Dedicated Video & Original Track',
    status: 'offer_received', // 'pending' | 'offer_received' | 'accepted' | 'declined'
    appliedAt: '2026-04-10T09:30:00Z',
    pitchText: 'Hi Aura Retreats team! Having reviewed your coastal resort vision, I would love to compose an original fingerstyle acoustic composition with serene ambient ocean elements matching the rhythm of your scenic footage. My audience of 890K music lovers has high organic engagement in coastal travel aesthetics.'
  },
  {
    id: 'app-seed-02',
    campaignId: 'camp-tech-1',
    campaignTitle: 'Hands-on Developer Walkthrough of Cloud AI Studio',
    brandName: 'DevStack Cloud Systems',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    creatorId: 'creator-tech-1',
    creatorName: 'The Coding Train',
    budgetFormatted: '$3,200 USD',
    deliverable: '1 Dedicated Video (10-14 mins) + 2 Shorts',
    status: 'pending',
    appliedAt: '2026-04-11T14:15:00Z',
    pitchText: 'Hello DevStack! I propose a practical, project-driven tutorial building an interactive multi-agent workspace using your Cloud AI Studio. By breaking down the concepts through visual diagrams and live terminal coding, my 1.68M developers will see instant practical value.'
  }
];

/**
 * Loads creator applications from Firestore with localStorage fallback.
 */
export function getStoredApplications() {
  try {
    const saved = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse applications from localStorage', e);
  }
  return DEFAULT_APPLICATIONS;
}

/**
 * Saves application to Firestore and updates local state.
 */
export async function submitApplication(appData) {
  const newApp = {
    ...appData,
    id: appData.id || `app-${Date.now()}`,
    status: 'pending',
    appliedAt: new Date().toISOString()
  };

  // Local sync
  const current = getStoredApplications();
  const updated = [newApp, ...current.filter((a) => a.id !== newApp.id)];
  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nefra_applications_updated', { detail: updated }));
  } catch (e) {}

  // Cloud Firestore sync
  try {
    const appRef = doc(db, APPLICATIONS_COLLECTION, newApp.id);
    await setDoc(appRef, {
      ...newApp,
      serverTime: serverTimestamp()
    }, { merge: true });
    console.log(`[Firestore] Application ${newApp.id} synced to Firestore.`);
  } catch (err) {
    console.warn(`[Firestore] Could not sync application to cloud: ${err.message}`);
  }

  return newApp;
}

/**
 * Updates application status (e.g. 'accepted', 'declined').
 */
export async function updateApplicationStatus(applicationId, newStatus) {
  const current = getStoredApplications();
  const updated = current.map((app) => 
    app.id === applicationId ? { ...app, status: newStatus, respondedAt: new Date().toISOString() } : app
  );

  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('nefra_applications_updated', { detail: updated }));
  } catch (e) {}

  // Cloud Firestore sync
  try {
    const appRef = doc(db, APPLICATIONS_COLLECTION, applicationId);
    await setDoc(appRef, {
      status: newStatus,
      respondedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn(`[Firestore] Could not update application in cloud: ${err.message}`);
  }

  return updated;
}
