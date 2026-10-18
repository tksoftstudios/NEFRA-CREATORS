/**
 * NefraSense AI History Service
 * Persists and retrieves strategic advisory sessions strictly via Cloud Firestore.
 * Does NOT use localStorage, sessionStorage, or hardcoded RAM mock data.
 */

import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const HISTORY_COLLECTION = 'nefrasense_history';

/**
 * Save a completed NefraSense session directly to Cloud Firestore.
 * 
 * @param {Object} session
 * @param {string} session.query - User prompt
 * @param {string} session.answer - Markdown response from Vertex AI / Grounded model
 * @param {string} session.portal - 'creator' | 'brand'
 * @param {string} [session.userId] - Current user UID (or 'guest')
 * @param {string} [session.userEmail] - Current user email
 * @returns {Promise<string>} Created Firestore document ID
 */
export async function saveNefraSenseHistoryToFirestore({
  query: userQuery,
  answer,
  portal = 'creator',
  userId = 'anonymous',
  userEmail = null
}) {
  if (!db) {
    console.warn('[NefraSense History] Firestore db not initialized');
    return null;
  }

  if (!userQuery || !answer) return null;

  try {
    const historyRef = collection(db, HISTORY_COLLECTION);
    const docData = {
      query: String(userQuery).trim(),
      answer: String(answer).trim(),
      portal: portal || 'creator',
      userId: userId || 'anonymous',
      userEmail: userEmail || null,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      firestoreTimestamp: serverTimestamp()
    };

    const docRef = await addDoc(historyRef, docData);
    return docRef.id;
  } catch (error) {
    console.error('[NefraSense History] Error saving session to Firestore:', error);
    return null;
  }
}

/**
 * Fetch NefraSense session history directly from Cloud Firestore.
 * Always fetches from the live Firestore collection (no localStorage or RAM cache).
 * 
 * @param {Object} options
 * @param {string} [options.portal] - Optional filter by portal ('creator' | 'brand')
 * @param {string} [options.userId] - Optional filter by user ID
 * @param {number} [options.limitCount=40] - Max documents to fetch
 * @returns {Promise<Array>} List of history sessions sorted newest first
 */
export async function fetchNefraSenseHistoryFromFirestore({
  portal = null,
  userId = null,
  limitCount = 40
} = {}) {
  if (!db) {
    console.warn('[NefraSense History] Firestore db not initialized');
    return [];
  }

  try {
    const historyRef = collection(db, HISTORY_COLLECTION);
    // Order by timestamp descending directly from Firestore
    let q = query(historyRef, orderBy('timestamp', 'desc'), limit(limitCount));

    const snapshot = await getDocs(q);
    const results = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Filter in memory if specific portal or userId requested, ensuring we don't trip missing composite index requirements
      if (portal && data.portal !== portal) return;
      if (userId && userId !== 'anonymous' && data.userId && data.userId !== userId && data.userId !== 'anonymous') {
        return;
      }

      results.push({
        id: docSnap.id,
        ...data
      });
    });

    return results;
  } catch (error) {
    console.error('[NefraSense History] Error fetching sessions from Firestore:', error);
    // Fallback: try querying without order if index is building
    try {
      const historyRef = collection(db, HISTORY_COLLECTION);
      const snapshot = await getDocs(query(historyRef, limit(limitCount)));
      const results = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (portal && data.portal !== portal) return;
        results.push({ id: docSnap.id, ...data });
      });
      return results.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (fallbackError) {
      console.error('[NefraSense History] Fallback fetch failed:', fallbackError);
      return [];
    }
  }
}

/**
 * Real-time subscription to NefraSense session history straight from Cloud Firestore.
 * 
 * @param {Function} onUpdate - Callback invoked with fresh Firestore items
 * @param {Object} options
 * @returns {Function} Unsubscribe function
 */
export function subscribeToNefraSenseHistoryFromFirestore(onUpdate, {
  portal = null,
  userId = null,
  limitCount = 40
} = {}) {
  if (!db) {
    onUpdate([]);
    return () => {};
  }

  try {
    const historyRef = collection(db, HISTORY_COLLECTION);
    const q = query(historyRef, orderBy('timestamp', 'desc'), limit(limitCount));

    return onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (portal && data.portal !== portal) return;
          if (userId && userId !== 'anonymous' && data.userId && data.userId !== userId && data.userId !== 'anonymous') {
            return;
          }
          items.push({
            id: docSnap.id,
            ...data
          });
        });
        onUpdate(items);
      },
      (error) => {
        console.warn('[NefraSense History] Real-time subscription notice:', error);
      }
    );
  } catch (error) {
    console.error('[NefraSense History] Subscription failed:', error);
    return () => {};
  }
}

/**
 * Delete a specific history session from Cloud Firestore.
 * 
 * @param {string} historyId - Document ID in Firestore
 * @returns {Promise<boolean>}
 */
export async function deleteNefraSenseHistoryItemFromFirestore(historyId) {
  if (!db || !historyId) return false;

  try {
    const docRef = doc(db, HISTORY_COLLECTION, historyId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('[NefraSense History] Error deleting document from Firestore:', error);
    return false;
  }
}
