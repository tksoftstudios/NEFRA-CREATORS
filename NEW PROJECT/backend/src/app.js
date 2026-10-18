import express from 'express';
import cors from 'cors';
import { config } from './config/config.js';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyBqECg338_YVo1KHGeT1iAvuqfbCMj8ScQ",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "nefra-creators-x.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "nefra-creators-x",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "nefra-creators-x.firebasestorage.app",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "194521973902",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:194521973902:web:20aa32af9f94ce240bb5df",
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZWY7QLDQWS"
};

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json());

// API Health Check & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NEFRA Creator & Escrow Platform Backend',
    version: '1.2.0',
    mode: 'strict-oauth-verification',
    port: config.port,
    platformTakeRate: `${config.platformFeePercentage}%`,
    timestamp: new Date().toISOString()
  });
});

async function verifyYouTubeWithGoogle(accessToken) {
  if (!accessToken) {
    throw new Error('Google OAuth access token is required.');
  }

  const response = await fetch(
    'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,contentDetails&mine=true',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    let errJson;
    try { errJson = JSON.parse(errorText); } catch(e) {}
    throw new Error(errJson?.error?.message || `Google API error (Status ${response.status})`);
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error('No YouTube channel found associated with this Google account.');
  }

  const item = data.items[0];
  const rawSubs = parseInt(item.statistics?.subscriberCount || '0', 10);
  const rawViews = parseInt(item.statistics?.viewCount || '0', 10);
  const rawVideos = parseInt(item.statistics?.videoCount || '0', 10);

  return {
    verified: true,
    serverVerified: true,
    channelId: item.id,
    title: item.snippet?.title || 'YouTube Channel',
    handle: item.snippet?.customUrl || `@${(item.snippet?.title || 'channel').replace(/\s+/g, '').toLowerCase()}`,
    avatar: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url,
    description: item.snippet?.description || '',
    subscribers: rawSubs,
    subscribersFormatted: rawSubs.toLocaleString(),
    videoCount: rawVideos,
    viewCount: rawViews,
    viewsFormatted: rawViews.toLocaleString(),
    recentUploads: [],
    scope: 'https://www.googleapis.com/auth/youtube.readonly',
    verifiedAt: new Date().toISOString()
  };
}

// POST /api/youtube/connect
app.post('/api/youtube/connect', async (req, res) => {
  try {
    const { 
      creatorId = 'creator_01', 
      accessToken, 
      googleUser = {}
    } = req.body;

    const channelData = await verifyYouTubeWithGoogle(accessToken);

    const creatorRef = doc(db, 'creators', creatorId);
    const connectionRef = doc(db, 'youtube_connections', creatorId);

    const updatePayload = {
      youtubeConnected: true,
      verified: true,
      name: channelData.title,
      handle: channelData.handle,
      subscribers: channelData.subscribers,
      subscribersFormatted: channelData.subscribersFormatted,
      youtube: {
        channelId: channelData.channelId,
        title: channelData.title,
        handle: channelData.handle,
        subscribers: channelData.subscribers,
        subscribersFormatted: channelData.subscribersFormatted,
        viewCount: channelData.viewCount,
        videoCount: channelData.videoCount,
        recentUploads: channelData.recentUploads,
        scope: channelData.scope,
        serverVerified: true,
        verifiedAt: channelData.verifiedAt
      },
      googleAccount: {
        email: googleUser.email || null,
        displayName: googleUser.displayName || null,
        uid: googleUser.uid || null
      },
      updatedAt: new Date().toISOString()
    };

    let firestoreSaved = false;
    try {
      await setDoc(creatorRef, updatePayload, { merge: true });
      await setDoc(connectionRef, {
        creatorId,
        channelId: channelData.channelId,
        channelTitle: channelData.title,
        handle: channelData.handle,
        subscribers: channelData.subscribers,
        googleEmail: googleUser.email || null,
        status: 'active',
        connectedAt: new Date().toISOString()
      }, { merge: true });
      firestoreSaved = true;
    } catch (fsErr) {
      console.warn('[Server] Firestore write warning:', fsErr.message);
    }

    return res.json({
      success: true,
      message: 'YouTube channel verified by server and saved to Cloud Firestore',
      channel: channelData,
      firestoreSaved
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/youtube/disconnect
app.post('/api/youtube/disconnect', async (req, res) => {
  try {
    const { creatorId = 'creator_01' } = req.body;
    const creatorRef = doc(db, 'creators', creatorId);
    await setDoc(creatorRef, {
      youtubeConnected: false,
      youtube: null,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return res.json({
      success: true,
      message: 'YouTube channel disconnected and updated in Cloud Firestore'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default app;
