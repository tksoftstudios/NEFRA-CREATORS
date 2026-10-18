import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function nefraApiPlugin() {
  return {
    name: 'nefra-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api')) {
          return next();
        }

        // Parse JSON body for POST requests
        let body = {};
        if (req.method === 'POST') {
          const buffers = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString();
          if (raw) {
            try {
              body = JSON.parse(raw);
            } catch (e) {
              console.warn('[Vite API] Could not parse JSON body:', e.message);
            }
          }
        }

        res.setHeader('Content-Type', 'application/json');

        // Health endpoint
        if (req.url === '/api/health') {
          return res.end(JSON.stringify({
            status: 'healthy',
            service: 'NEFRA Creator Intelligence & Escrow Backend API',
            version: '1.1.0',
            firestoreProject: 'nefra-creators-x',
            mode: 'vite-dev-middleware',
            timestamp: new Date().toISOString()
          }));
        }

        // YouTube Connect
        if (req.url === '/api/youtube/connect') {
          try {
            const { handleYouTubeConnect } = await import('./src/server/apiHandler.js');
            const result = await handleYouTubeConnect(body);
            return res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // YouTube Disconnect
        if (req.url === '/api/youtube/disconnect') {
          try {
            const { handleYouTubeDisconnect } = await import('./src/server/apiHandler.js');
            const result = await handleYouTubeDisconnect(body);
            return res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // Get Creator from Firestore
        if (req.url && req.url.startsWith('/api/creator')) {
          try {
            const parsedUrl = new URL(req.url, 'http://127.0.0.1');
            const creatorId = parsedUrl.searchParams.get('creatorId') || 'creator_01';
            const { handleGetCreator } = await import('./src/server/apiHandler.js');
            const result = await handleGetCreator(creatorId);
            return res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // Stripe Sandbox Config
        if (req.url === '/api/stripe/config') {
          try {
            const { handleGetStripeConfig } = await import('./src/server/stripeHandler.js');
            const result = handleGetStripeConfig();
            return res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // Stripe Sandbox Credit Top-Up
        if (req.url === '/api/stripe/topup') {
          try {
            const { handleStripeTopup } = await import('./src/server/stripeHandler.js');
            const result = await handleStripeTopup(body);
            return res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // Google Cloud Vertex AI Status
        if (req.url === '/api/vertex/status') {
          try {
            const { handleGetVertexStatus } = await import('./src/server/vertexHandler.js');
            return res.end(JSON.stringify(handleGetVertexStatus()));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // Save Google Cloud Vertex AI Credentials
        if (req.url === '/api/vertex/credentials') {
          try {
            const { handleSaveVertexCredentials } = await import('./src/server/vertexHandler.js');
            const result = await handleSaveVertexCredentials(body);
            return res.end(JSON.stringify(result));
          } catch (err) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ success: false, error: err.message }));
          }
        }

        // Google Cloud Vertex AI generateContent Proxy
        if (req.url === '/api/vertex/generateContent') {
          try {
            const { handleVertexGenerateContent } = await import('./src/server/vertexHandler.js');
            const result = await handleVertexGenerateContent(body);
            res.statusCode = result.status;
            return res.end(JSON.stringify(result.data));
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      nefraApiPlugin(),
      tailwindcss(),
      react()
    ],
    server: {
      host: '127.0.0.1',
      port: 5173
    }
  };
});

