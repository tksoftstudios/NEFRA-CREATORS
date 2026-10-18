/**
 * YouTube OAuth & Cloud Firestore Service
 * Genuine Google OAuth 2.0 flow with youtube.readonly scope.
 * Directly links the user's authentic YouTube channel associated with their Google account.
 * No manual handle entry to prevent spoofing or unauthorized claims.
 * No fake data.
 */

import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { 
  doc, 
  setDoc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import { app, db } from '../config/firebaseConfig.js';
import { getApiUrl } from '../config/apiClient.js';


const auth = getAuth(app);

/**
 * Configure Google Auth Provider requesting view-only YouTube Data API access
 */
export function getYouTubeAuthProvider() {
  const provider = new GoogleAuthProvider();
  // Request view-only permission to the user's YouTube channel
  provider.addScope('https://www.googleapis.com/auth/youtube.readonly');
  provider.setCustomParameters({
    prompt: 'select_account consent',
    access_type: 'offline'
  });
  return provider;
}

/**
 * Sign in with Google, grant YouTube permission, and verify ownership on the server
 */
export async function connectYouTubeWithServer({ creatorId = null } = {}) {
  const targetId = creatorId || auth.currentUser?.uid || 'creator_01';
  // 1. Google OAuth Sign-In Popup with youtube.readonly scope
  const provider = getYouTubeAuthProvider();
  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (err) {
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      throw new Error('Google Sign-In was cancelled. Please authorize with your Google Account to connect your channel.');
    }
    if (err.code === 'auth/configuration-not-found') {
      throw new Error('Firebase Authentication is configured, but Google Sign-In is not enabled in Firebase Console. To enable it: Go to Firebase Console -> Authentication -> Sign-in method tab -> Click "Google" -> Toggle "Enable" -> Set Support Email -> Click Save.');
    }
    if (err.code === 'auth/unauthorized-domain') {
      throw new Error(`This domain (${window.location.hostname}) is not authorized in your Firebase Console. Please add it under Firebase Console -> Authentication -> Settings -> Authorized domains.`);
    }
    throw new Error(`Google Authentication failed: ${err.message}`);
  }

  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken;
  const user = result.user;

  if (!accessToken) {
    throw new Error('No Google OAuth access token was returned. Please ensure you granted permission to access your YouTube account.');
  }

  const googleUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };

  // 2. Call Server Endpoint for Google YouTube Data API Verification & Firestore Persistence
  const response = await fetch(getApiUrl('/api/youtube/connect'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      creatorId: targetId,
      accessToken,
      googleUser
    })
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Server failed to verify YouTube channel with Google Data API.');
  }

  const channel = data.channel;

  // 3. Client-side Cloud Firestore update (confirmation write)
  try {
    const creatorRef = doc(db, 'creators', targetId);
    await setDoc(creatorRef, {
      youtubeConnected: true,
      verified: true,
      name: channel.title,
      handle: channel.handle,
      avatar: channel.avatar || undefined,
      subscribers: channel.subscribers,
      subscribersFormatted: channel.subscribersFormatted,
      youtube: {
        channelId: channel.channelId,
        title: channel.title,
        handle: channel.handle,
        subscribers: channel.subscribers,
        subscribersFormatted: channel.subscribersFormatted,
        viewCount: channel.viewCount,
        videoCount: channel.videoCount,
        recentUploads: channel.recentUploads,
        scope: channel.scope,
        serverVerified: true,
        verifiedAt: channel.verifiedAt
      },
      googleAccount: {
        email: googleUser.email,
        displayName: googleUser.displayName,
        uid: googleUser.uid
      },
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (fsErr) {
    console.warn('[YouTube Service] Client Firestore confirmation note:', fsErr.message);
  }

  return {
    success: true,
    channel,
    googleUser,
    firestoreSaved: data.firestoreSaved
  };
}

/**
 * Disconnect YouTube Channel on Server & Cloud Firestore
 */
export async function disconnectYouTubeWithServer({ creatorId = null } = {}) {
  const targetId = creatorId || auth.currentUser?.uid || 'creator_01';
  const res = await fetch(getApiUrl('/api/youtube/disconnect'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creatorId: targetId })
  });

  // Client Firestore sync
  try {
    const creatorRef = doc(db, 'creators', targetId);
    await setDoc(creatorRef, {
      youtubeConnected: false,
      youtube: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('[YouTube Disconnect] Client Firestore note:', e.message);
  }

  return res.json().catch(() => ({ success: true }));
}

/**
 * Fetch creator data from Cloud Firestore with server API fallback
 */
export async function fetchCreatorProfile(creatorId = 'creator_01') {
  // 1. First attempt direct Cloud Firestore read
  if (db) {
    try {
      const creatorRef = doc(db, 'creators', creatorId);
      const snap = await getDoc(creatorRef);
      if (snap.exists()) {
        const data = snap.data();
        return data;
      }
    } catch (err) {
      console.warn('[YouTube Service] Direct Firestore fetch note:', err.message);
    }
  }

  // 2. Fallback to Server API endpoint
  try {
    const res = await fetch(getApiUrl(`/api/creator?creatorId=${encodeURIComponent(creatorId)}`));
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.creator) {
        return json.creator;
      }
    }
  } catch (err) {
    console.warn('[YouTube Service] Server API fallback fetch note:', err.message);
  }

  return null;
}

/**
 * Subscribe to real-time Cloud Firestore updates for a creator
 */
export function subscribeToCreatorProfile(creatorId = 'creator_01', onUpdate) {
  if (!db) return () => {};
  try {
    const creatorRef = doc(db, 'creators', creatorId);
    const unsubscribe = onSnapshot(
      creatorRef,
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data());
        }
      },
      (err) => {
        console.warn('[YouTube Service] Firestore real-time listener notice:', err.message);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('[YouTube Service] subscribeToCreatorProfile notice:', err.message);
    return () => {};
  }
}

