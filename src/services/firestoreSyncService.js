/**
 * Cloud Firestore Live Synchronization Service
 * 
 * Manages Credits, Transactions, Bids, and Conversations strictly through Cloud Firestore.
 * Zero reliance on localStorage or sessionStorage.
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

/**
 * Deduct credits directly from Firestore and record transaction in Firestore ledger.
 * 
 * @param {Object} params
 * @param {string} params.userId - User UID or Account ID
 * @param {string} params.role - 'creator' | 'brand'
 * @param {number} params.amount - Credits to deduct
 * @param {string} params.description - Transaction description
 * @returns {Promise<{success: boolean, remainingCredits: number}>}
 */
export async function deductCreditsInFirestore({
  userId,
  role = 'creator',
  amount = 1,
  description = 'AI feature usage'
}) {
  const targetId = userId || (role === 'brand' ? 'brand_01' : 'creator_01');
  if (!db) {
    console.warn('[Firestore Credits] DB not initialized');
    return { success: false, remainingCredits: 0 };
  }

  try {
    const colName = role === 'brand' ? 'brands' : 'creators';
    const docRef = doc(db, colName, targetId);
    const userRef = doc(db, 'users', targetId);

    const snap = await getDoc(docRef);
    const data = snap.exists() ? snap.data() : {};

    const currentBalance = role === 'brand'
      ? (typeof data.brandCredits === 'number' ? data.brandCredits : (data.credits ?? 250))
      : (typeof data.credits === 'number' ? data.credits : 50);

    const remainingCredits = Math.max(0, currentBalance - Number(amount));

    const payload = role === 'brand'
      ? { brandCredits: remainingCredits, credits: remainingCredits, updatedAt: new Date().toISOString() }
      : { credits: remainingCredits, creatorCredits: remainingCredits, updatedAt: new Date().toISOString() };

    await setDoc(docRef, payload, { merge: true });
    try {
      await setDoc(userRef, payload, { merge: true });
    } catch (e) {}

    // Record in Cloud Firestore transactions ledger
    try {
      await addDoc(collection(db, 'transactions'), {
        userId: targetId,
        role,
        amount: -Number(amount),
        description,
        remainingCredits,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[Firestore Credits] Transaction log note:', e);
    }

    return { success: true, remainingCredits };
  } catch (error) {
    console.error('[Firestore Credits] Deduct error:', error);
    return { success: false, remainingCredits: 0 };
  }
}

/**
 * Refill credits directly in Firestore and record top-up transaction.
 * 
 * @param {Object} params
 * @returns {Promise<{success: boolean, remainingCredits: number}>}
 */
export async function refillCreditsInFirestore({
  userId,
  role = 'creator',
  amount = 50,
  receipt = null
}) {
  const targetId = userId || (role === 'brand' ? 'brand_01' : 'creator_01');
  if (!db) return { success: false, remainingCredits: 0 };

  try {
    const colName = role === 'brand' ? 'brands' : 'creators';
    const docRef = doc(db, colName, targetId);
    const userRef = doc(db, 'users', targetId);

    const snap = await getDoc(docRef);
    const data = snap.exists() ? snap.data() : {};

    const currentBalance = role === 'brand'
      ? (typeof data.brandCredits === 'number' ? data.brandCredits : 250)
      : (typeof data.credits === 'number' ? data.credits : 50);

    const remainingCredits = currentBalance + Number(amount);

    const payload = role === 'brand'
      ? { brandCredits: remainingCredits, credits: remainingCredits, updatedAt: new Date().toISOString() }
      : { credits: remainingCredits, creatorCredits: remainingCredits, updatedAt: new Date().toISOString() };

    await setDoc(docRef, payload, { merge: true });
    try {
      await setDoc(userRef, payload, { merge: true });
    } catch (e) {}

    const txDesc = receipt?.paymentIntentId
      ? `Stripe Sandbox Top-up (+${amount} credits • Tx: ${receipt.paymentIntentId.slice(-8)})`
      : `Credit refill bonus (+${amount} credits)`;

    try {
      await addDoc(collection(db, 'transactions'), {
        userId: targetId,
        role,
        amount: Number(amount),
        description: txDesc,
        remainingCredits,
        receipt: receipt || null,
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      });
    } catch (e) {}

    return { success: true, remainingCredits };
  } catch (error) {
    console.error('[Firestore Credits] Refill error:', error);
    return { success: false, remainingCredits: 0 };
  }
}

/**
 * Real-time listener for user credits directly from Firestore.
 */
export function subscribeToUserCredits(userId, role, onUpdate) {
  const targetId = userId || (role === 'brand' ? 'brand_01' : 'creator_01');
  if (!db) return () => {};

  const colName = role === 'brand' ? 'brands' : 'creators';
  const docRef = doc(db, colName, targetId);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const balance = role === 'brand'
        ? (typeof data.brandCredits === 'number' ? data.brandCredits : (data.credits ?? 250))
        : (typeof data.credits === 'number' ? data.credits : 50);
      onUpdate(balance);
    }
  }, (err) => {
    console.warn('[Firestore Credits] Subscription warning:', err);
  });
}

/**
 * Save Bids directly to Firestore.
 */
export async function saveBidToFirestore(bid) {
  if (!db || !bid) return null;
  try {
    const docRef = await addDoc(collection(db, 'bids'), {
      ...bid,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (e) {
    console.error('[Firestore Bids] Save error:', e);
    return null;
  }
}

/**
 * Real-time listener for Bids from Firestore.
 */
export function subscribeToBidsFromFirestore(onUpdate) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'bids'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(d => items.push({ id: d.id, ...d.data() }));
      onUpdate(items);
    }, (err) => {
      console.warn('[Firestore Bids] Subscription notice:', err);
    });
  } catch (e) {
    return () => {};
  }
}

/**
 * Save and sync conversations directly in Firestore.
 */
export async function saveConversationToFirestore(conversation) {
  if (!db || !conversation?.id) return null;
  try {
    const docRef = doc(db, 'conversations', conversation.id);
    await setDoc(docRef, {
      ...conversation,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return conversation.id;
  } catch (e) {
    console.error('[Firestore Conversations] Save error:', e);
    return null;
  }
}

/**
 * Real-time listener for conversations from Firestore.
 */
export function subscribeToConversationsFromFirestore(onUpdate) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'conversations'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(d => items.push({ id: d.id, ...d.data() }));
      onUpdate(items);
    }, (err) => {
      console.warn('[Firestore Conversations] Notice:', err);
    });
  } catch (e) {
    return () => {};
  }
}

/**
 * Real-time listener for transactions from Firestore.
 */
export function subscribeToTransactions(userId, role, onUpdate) {
  if (!db) return () => {};
  try {
    const isRealUser = userId && userId !== 'brand_01' && userId !== 'creator_01';
    const validIds = isRealUser 
      ? [userId] 
      : (role === 'brand' ? ['brand_01', 'brand_acme'] : ['creator_01']);

    const q = query(
      collection(db, 'transactions'),
      where('userId', 'in', validIds.slice(0, 10)),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(d => {
        const data = d.data();
        items.push({
          id: d.id,
          description: data.description || 'Transaction',
          amount: data.amount || 0,
          currency: data.currency || 'CREDITS',
          isEscrow: data.isEscrow || data.type === 'escrow_deposit' || data.type === 'escrow_secured',
          type: data.type || 'credit_event',
          contractId: data.contractId || null,
          timestamp: data.createdAt ? new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          createdAt: data.createdAt,
          rawTimestamp: data.timestamp || 0,
          ...data
        });
      });
      items.sort((a, b) => (b.rawTimestamp || 0) - (a.rawTimestamp || 0));
      if (items.length > 0) {
        onUpdate(items);
      }
    }, (err) => {
      console.warn('[Firestore Transactions] Subscription notice:', err);
    });
  } catch (e) {
    return () => {};
  }
}

/**
 * Save and sync contracts directly in Firestore.
 */
export async function saveContractToFirestore(contract) {
  if (!db || !contract?.id) return null;
  try {
    const docRef = doc(db, 'contracts', contract.id);
    await setDoc(docRef, {
      ...contract,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return contract.id;
  } catch (e) {
    console.error('[Firestore Contracts] Save error:', e);
    return null;
  }
}

/**
 * Real-time listener for contracts from Firestore.
 */
export function subscribeToContractsFromFirestore(onUpdate) {
  if (!db) return () => {};
  try {
    const q = query(collection(db, 'contracts'), limit(50));
    return onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach(d => items.push({ id: d.id, ...d.data() }));
      onUpdate(items);
    }, (err) => {
      console.warn('[Firestore Contracts] Notice:', err);
    });
  } catch (e) {
    return () => {};
  }
}

/**
 * Record Escrow Payment & Deposit transaction into Firestore for both Brand and Creator.
 */
export async function recordEscrowPaymentInFirestore({
  brandOrgId,
  brandName = 'Acme Enterprise Corp',
  creatorId,
  creatorName = 'Creator',
  contractId,
  offerTitle = 'Custom Gig Package',
  amountCents = 0,
  platformFeeCents = 0,
  netCreatorCents = 0
}) {
  if (!db) return false;
  try {
    const now = Date.now();
    const isoNow = new Date().toISOString();
    const amountDollars = amountCents / 100;
    const netCreatorDollars = (netCreatorCents || (amountCents - platformFeeCents)) / 100;

    // 1. Transaction doc for Brand
    const brandTx = {
      userId: brandOrgId || 'brand_01',
      role: 'brand',
      type: 'escrow_deposit',
      isEscrow: true,
      currency: 'USD',
      amount: -amountDollars,
      amountCents: -amountCents,
      contractId,
      description: `Escrow Pre-funded: "${offerTitle}" with ${creatorName} (Contract #${contractId})`,
      timestamp: now,
      createdAt: isoNow
    };

    // 2. Transaction doc for Creator
    const creatorTx = {
      userId: creatorId || 'creator_01',
      role: 'creator',
      type: 'escrow_secured',
      isEscrow: true,
      currency: 'USD',
      amount: netCreatorDollars,
      amountCents: Math.round(netCreatorDollars * 100),
      contractId,
      description: `Escrow Secured: "${offerTitle}" from ${brandName} (Contract #${contractId})`,
      timestamp: now,
      createdAt: isoNow
    };

    await addDoc(collection(db, 'transactions'), brandTx);
    await addDoc(collection(db, 'transactions'), creatorTx);

    return true;
  } catch (err) {
    console.error('[Firestore Escrow] Transaction record error:', err);
    return false;
  }
}


