/**
 * Firestore Service for Nefra Platform
 * Handles real-time cloud sync for:
 * 1. Enrolled Creators Directory (collection: 'creators')
 * 2. Campaign Job Cards (collection: 'campaign_jobs')
 * Seamlessly pairs with local fallback if Firestore database is being provisioned.
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';

const CREATORS_COLLECTION = 'creators';
const JOBS_COLLECTION = 'campaign_jobs';

/**
 * Saves or updates a creator profile in Firestore.
 */
export async function saveCreatorToFirestore(creator) {
  if (!creator) return false;
  const docId = creator.channelId || creator.id || `creator-${Date.now()}`;

  try {
    const creatorRef = doc(db, CREATORS_COLLECTION, docId);
    const dataToSave = {
      ...creator,
      id: docId,
      updatedAt: new Date().toISOString(),
      savedAt: serverTimestamp(),
    };

    await setDoc(creatorRef, dataToSave, { merge: true });
    console.log(`[Firestore] Creator '${creator.title}' saved to collection '${CREATORS_COLLECTION}'.`);
    return true;
  } catch (err) {
    console.warn(`[Firestore] Could not save creator to Firestore (${err.message}). Local storage active.`);
    return false;
  }
}

/**
 * Sets up a real-time listener for enrolled creators from Firestore.
 * Automatically notifies callback when new creators are added globally.
 */
export function subscribeToCreators(onUpdate, onError) {
  try {
    const colRef = collection(db, CREATORS_COLLECTION);
    const q = query(colRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cloudCreators = [];
        snapshot.forEach((docSnap) => {
          cloudCreators.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (onUpdate) {
          onUpdate(cloudCreators);
        }
      },
      (err) => {
        console.warn(`[Firestore] Real-time listener notice: ${err.message}`);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn(`[Firestore] subscribeToCreators initialization error: ${err.message}`);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetches all creators once from Firestore.
 */
export async function fetchCreatorsFromFirestore() {
  try {
    const colRef = collection(db, CREATORS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const creators = [];
    snapshot.forEach((docSnap) => {
      creators.push({ id: docSnap.id, ...docSnap.data() });
    });
    return creators;
  } catch (err) {
    console.warn(`[Firestore] fetchCreators error: ${err.message}`);
    return [];
  }
}

/**
 * Saves a generated Campaign Job Card to Firestore.
 */
export async function saveJobCardToFirestore(jobCard) {
  if (!jobCard) return false;
  const docId = jobCard.id || `job-${Date.now()}`;

  try {
    const jobRef = doc(db, JOBS_COLLECTION, docId);
    await setDoc(
      jobRef,
      {
        ...jobCard,
        id: docId,
        createdAt: new Date().toISOString(),
        serverTime: serverTimestamp()
      },
      { merge: true }
    );
    console.log(`[Firestore] Campaign Job '${jobCard.title}' saved to collection '${JOBS_COLLECTION}'.`);
    return true;
  } catch (err) {
    console.warn(`[Firestore] saveJobCard error: ${err.message}`);
    return false;
  }
}
