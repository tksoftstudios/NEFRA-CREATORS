import { https } from "firebase-functions/v1";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleYouTubeConnect, handleYouTubeDisconnect, handleGetCreator } from "./server/apiHandler.js";
import { hackathonAiShieldMiddleware, getHackathonShieldMetrics } from "./server/hackathonShield.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-client-session', 'x-csrf-token', 'Accept']
}));
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

// Normalize double /api prefixes from Firebase Hosting rewrites
app.use((req, res, next) => {
  while (req.url.startsWith('/api/api')) {
    req.url = req.url.slice(4);
  }
  next();
});

const router = express.Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NEFRA Creator Intelligence & Escrow Backend API (Cloud Functions)',
    version: '1.2.0',
    mode: 'firebase-cloud-functions',
    timestamp: new Date().toISOString()
  });
});

// YouTube Connect Endpoint (Real Google OAuth verification)
router.post('/youtube/connect', async (req, res) => {
  try {
    const result = await handleYouTubeConnect(req.body);
    return res.json(result);
  } catch (err) {
    console.error('[Functions] YouTube connect error:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to verify YouTube channel'
    });
  }
});

// YouTube Disconnect Endpoint
router.post('/youtube/disconnect', async (req, res) => {
  try {
    const result = await handleYouTubeDisconnect(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Get Creator Profile from Cloud Firestore
router.get('/creator', async (req, res) => {
  try {
    const creatorId = req.query.creatorId || 'creator_01';
    const result = await handleGetCreator(creatorId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Stripe Sandbox Config
router.get('/stripe/config', async (req, res) => {
  try {
    const { handleGetStripeConfig } = await import('./server/stripeHandler.js');
    return res.json(handleGetStripeConfig());
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Stripe Sandbox Credit Top-Up
router.post('/stripe/topup', async (req, res) => {
  try {
    const { handleStripeTopup } = await import('./server/stripeHandler.js');
    const result = await handleStripeTopup(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Cloud Firestore Credits Balance Endpoint
router.get('/credits', async (req, res) => {
  try {
    const { getFirestoreDb } = await import('./server/apiHandler.js');
    const db = getFirestoreDb();
    if (!db) return res.status(503).json({ success: false, error: 'Cloud Firestore is not initialized' });
    const { doc, getDoc } = await import('firebase/firestore');

    const userId = req.query.userId || 'creator_01';
    const role = req.query.role || 'creator';
    const col = role === 'brand' ? 'brands' : 'creators';

    const docSnap = await getDoc(doc(db, col, userId));
    const data = docSnap.exists() ? docSnap.data() : {};

    return res.json({
      success: true,
      userId,
      role,
      credits: typeof data.credits === 'number' ? data.credits : 50,
      brandCredits: typeof data.brandCredits === 'number' ? data.brandCredits : (data.credits ?? 250)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Cloud Firestore Credits Deduct Endpoint
router.post('/credits/deduct', async (req, res) => {
  try {
    const { getFirestoreDb } = await import('./server/apiHandler.js');
    const db = getFirestoreDb();
    if (!db) return res.status(503).json({ success: false, error: 'Cloud Firestore is not initialized' });
    const { doc, getDoc, setDoc, addDoc, collection } = await import('firebase/firestore');

    const { userId = 'creator_01', role = 'creator', amount = 1, description = 'Feature usage' } = req.body;
    const col = role === 'brand' ? 'brands' : 'creators';
    const docRef = doc(db, col, userId);

    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    const currentBalance = role === 'brand'
      ? (typeof data.brandCredits === 'number' ? data.brandCredits : 250)
      : (typeof data.credits === 'number' ? data.credits : 50);

    const remainingCredits = Math.max(0, currentBalance - Number(amount));
    const payload = role === 'brand'
      ? { brandCredits: remainingCredits, credits: remainingCredits, updatedAt: new Date().toISOString() }
      : { credits: remainingCredits, creatorCredits: remainingCredits, updatedAt: new Date().toISOString() };

    await setDoc(docRef, payload, { merge: true });

    // Record in Firestore transactions collection
    await addDoc(collection(db, 'transactions'), {
      userId,
      role,
      amount: -Number(amount),
      description,
      remainingCredits,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      remainingCredits,
      deducted: Number(amount)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Cloud Firestore Credits Refill Endpoint
router.post('/credits/refill', async (req, res) => {
  try {
    const { getFirestoreDb } = await import('./server/apiHandler.js');
    const db = getFirestoreDb();
    if (!db) return res.status(503).json({ success: false, error: 'Cloud Firestore is not initialized' });
    const { doc, getDoc, setDoc, addDoc, collection } = await import('firebase/firestore');

    const { userId = 'creator_01', role = 'creator', amount = 50, receipt = null } = req.body;
    const col = role === 'brand' ? 'brands' : 'creators';
    const docRef = doc(db, col, userId);

    const docSnap = await getDoc(docRef);
    const data = docSnap.exists() ? docSnap.data() : {};
    const currentBalance = role === 'brand'
      ? (typeof data.brandCredits === 'number' ? data.brandCredits : 250)
      : (typeof data.credits === 'number' ? data.credits : 50);

    const remainingCredits = currentBalance + Number(amount);
    const payload = role === 'brand'
      ? { brandCredits: remainingCredits, credits: remainingCredits, updatedAt: new Date().toISOString() }
      : { credits: remainingCredits, creatorCredits: remainingCredits, updatedAt: new Date().toISOString() };

    await setDoc(docRef, payload, { merge: true });

    const txDesc = receipt?.paymentIntentId
      ? `Stripe Sandbox Top-up (+${amount} credits • Tx: ${receipt.paymentIntentId.slice(-8)})`
      : `Credit refill bonus (+${amount} credits)`;

    await addDoc(collection(db, 'transactions'), {
      userId,
      role,
      amount: Number(amount),
      description: txDesc,
      remainingCredits,
      receipt,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    });

    return res.json({
      success: true,
      remainingCredits,
      added: Number(amount)
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Vertex AI Status
router.get('/vertex/status', async (req, res) => {
  try {
    const { handleGetVertexStatus } = await import('./server/vertexHandler.js');
    return res.json(handleGetVertexStatus());
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Save Vertex AI Credentials
router.post('/vertex/credentials', async (req, res) => {
  try {
    const { handleSaveVertexCredentials } = await import('./server/vertexHandler.js');
    const result = await handleSaveVertexCredentials(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Vertex AI generateContent Proxy (Protected by Hackathon Anti-Abuse Shield)
router.post('/vertex/generateContent', hackathonAiShieldMiddleware, async (req, res) => {
  try {
    const { handleVertexGenerateContent } = await import('./server/vertexHandler.js');
    const result = await handleVertexGenerateContent(req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Server-Side AI Image Generation Proxy (Protected by Hackathon Anti-Abuse Shield)
router.post('/ai/generateImage', hackathonAiShieldMiddleware, async (req, res) => {
  try {
    const { handleGenerateImage } = await import('./server/imageHandler.js');
    const result = await handleGenerateImage(req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Hackathon Shield Metrics
router.get('/shield/metrics', (req, res) => {
  return res.json({
    success: true,
    metrics: getHackathonShieldMetrics(),
    timestamp: new Date().toISOString()
  });
});

// Mount router at /api/api, /api, and / to guarantee match regardless of rewrite prefixing
app.use('/api/api', router);
app.use('/api', router);
app.use('/', router);

export const api = https.onRequest(app);
