/**
 * Authentication & User Session Service
 * Handles Google OAuth, multi-account browser session binding,
 * and user/creator/business profile persistence in Cloud Firestore.
 */

import { 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

// Ensure browser local persistence for robust session management
try {
  setPersistence(auth, browserLocalPersistence).catch(() => {});
} catch (e) {}

/**
 * Configure Google Auth Provider.
 * Using prompt: 'select_account' forces Google to show the account picker,
 * allowing users to switch between multiple Google profiles without getting stuck on the old one.
 */
export function getGoogleAuthProvider() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  return provider;
}

import { 
  bindBrowserSession, 
  validateSessionIntegrity, 
  destroyBrowserSession 
} from './sessionSecurityService';

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle() {
  const provider = getGoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Bind this user to this isolated browser session
  bindBrowserSession(user);

  return user;
}

/**
 * Sign out of Google and clear session tokens
 */
export async function signOutUser() {
  destroyBrowserSession();
  await signOut(auth);
}

/**
 * Listen to Firebase Auth state changes
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Validate and bind session to this browser window
      validateSessionIntegrity(user);
      bindBrowserSession(user);
      
      // Fetch user profile from Firestore or initialize new Google evaluator profile
      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Google Evaluator',
          photoURL: user.photoURL || '',
          role: 'creator',
          credits: 50,
          creatorCredits: 50,
          brandCredits: 250,
          onboardingCompleted: false,
          isVerifiedGoogleUser: true,
          limitsLifted: true,
          createdAt: new Date().toISOString()
        };
        await saveUserProfile(user.uid, profile);
      }
      callback(user, profile);
    } else {
      destroyBrowserSession();
      callback(null, null);
    }
  });
}

/**
 * Fetch generic user profile document from Firestore
 */
export async function getUserProfile(uid) {
  if (!uid || !db) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[AuthService] Fetch user profile error:', err.message);
  }
  return null;
}

/**
 * Save user profile document
 */
export async function saveUserProfile(uid, data) {
  if (!uid || !db) return;
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('[AuthService] Save user profile error:', err.message);
  }
}

/**
 * Fetch creator-specific profile
 */
export async function getCreatorProfile(uid) {
  if (!uid || !db) return null;
  try {
    const creatorRef = doc(db, 'creators', uid);
    const snap = await getDoc(creatorRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('[AuthService] Fetch creator error:', err.message);
  }
  return null;
}

/**
 * Save creator profile and mark user onboarding as complete
 */
export async function saveCreatorProfile(uid, creatorData) {
  if (!uid || !db) return;
  try {
    const creatorRef = doc(db, 'creators', uid);
    const userRef = doc(db, 'users', uid);

    const payload = {
      ...creatorData,
      id: uid,
      role: 'creator',
      status: 'active',
      updatedAt: new Date().toISOString()
    };

    await setDoc(creatorRef, payload, { merge: true });
    await setDoc(userRef, {
      uid,
      role: 'creator',
      onboardingCompleted: true,
      creatorName: creatorData.name,
      country: creatorData.country,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return payload;
  } catch (err) {
    console.error('[AuthService] Save creator error:', err);
    throw err;
  }
}

/**
 * Save brand profile and mark user onboarding as complete
 */
export async function saveBrandProfile(uid, brandData) {
  if (!uid || !db) return;
  try {
    const brandRef = doc(db, 'brands', uid);
    const userRef = doc(db, 'users', uid);

    const payload = {
      ...brandData,
      id: uid,
      role: 'brand',
      status: 'active',
      updatedAt: new Date().toISOString()
    };

    await setDoc(brandRef, payload, { merge: true });
    await setDoc(userRef, {
      uid,
      role: 'brand',
      onboardingCompleted: true,
      companyName: brandData.companyName,
      country: brandData.country,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return payload;
  } catch (err) {
    console.error('[AuthService] Save brand error:', err);
    throw err;
  }
}

/**
 * Fetch all registered creators from Cloud Firestore
 */
export async function fetchAllRegisteredCreators() {
  if (!db) return [];
  try {
    const creatorsRef = collection(db, 'creators');
    const snap = await getDocs(creatorsRef);
    const list = [];
    snap.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() });
    });
    return list;
  } catch (err) {
    console.warn('[AuthService] Fetch all creators notice:', err.message);
    return [];
  }
}
