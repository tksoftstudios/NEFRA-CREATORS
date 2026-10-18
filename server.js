import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleYouTubeConnect, handleYouTubeDisconnect, handleGetCreator } from './src/server/apiHandler.js';

dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 5001;

const app = express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true
}));

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'NEFRA Creator Intelligence & Escrow Backend API',
    version: '1.2.0',
    mode: 'production-strict-oauth',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// YouTube Connect Endpoint (Real Google OAuth verification)
app.post('/api/youtube/connect', async (req, res) => {
  try {
    const result = await handleYouTubeConnect(req.body);
    return res.json(result);
  } catch (err) {
    console.error('[Server] YouTube connect error:', err.message);
    return res.status(400).json({
      success: false,
      error: err.message || 'Failed to verify YouTube channel'
    });
  }
});

// YouTube Disconnect Endpoint
app.post('/api/youtube/disconnect', async (req, res) => {
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
app.get('/api/creator', async (req, res) => {
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
app.get('/api/stripe/config', async (req, res) => {
  try {
    const { handleGetStripeConfig } = await import('./src/server/stripeHandler.js');
    return res.json(handleGetStripeConfig());
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Stripe Sandbox Credit Top-Up
app.post('/api/stripe/topup', async (req, res) => {
  try {
    const { handleStripeTopup } = await import('./src/server/stripeHandler.js');
    const result = await handleStripeTopup(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Google Cloud Vertex AI Status
app.get('/api/vertex/status', async (req, res) => {
  try {
    const { handleGetVertexStatus } = await import('./src/server/vertexHandler.js');
    return res.json(handleGetVertexStatus());
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Save Google Cloud Vertex AI Credentials
app.post('/api/vertex/credentials', async (req, res) => {
  try {
    const { handleSaveVertexCredentials } = await import('./src/server/vertexHandler.js');
    const result = await handleSaveVertexCredentials(req.body);
    return res.json(result);
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// Google Cloud Vertex AI generateContent Proxy
app.post('/api/vertex/generateContent', async (req, res) => {
  try {
    const { handleVertexGenerateContent } = await import('./src/server/vertexHandler.js');
    const result = await handleVertexGenerateContent(req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`🚀 NEFRA Backend Service is running on http://127.0.0.1:${PORT}`);
  console.log(`🩺 Health: http://127.0.0.1:${PORT}/api/health`);
  console.log(`📺 Real YouTube Data API v3 Verification Active (Strict OAuth)`);
  console.log(`===============================================`);
});

export default app;
