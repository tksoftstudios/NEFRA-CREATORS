/**
 * Hackathon Anti-Abuse AI Shield
 * 
 * Protects Google Cloud Vertex AI & Gemini API credits from being drained
 * by malicious external actors, automated scrapers, bot loops, or curl attacks
 * while keeping the hackathon MVP publicly testable for judges.
 */

// Global daily safety counter for anonymous demo requests
let globalDemoCallsToday = 0;
let lastResetDate = new Date().toDateString();

// In-memory per-IP and per-session trackers: { count, firstSeen, dailyCount }
const ipTracker = new Map();
const sessionTracker = new Map();

// Configuration
const SHIELD_CONFIG = {
  GLOBAL_ANONYMOUS_DAILY_CAP: 200,      // Max total demo AI calls per day for the entire app
  PER_IP_WINDOW_MS: 15 * 60 * 1000,     // 15-minute sliding window
  PER_IP_WINDOW_MAX: 5,                 // Max 5 calls per IP per 15 minutes for demo
  PER_IP_DAILY_MAX: 10,                 // Max 10 calls per IP per day for demo
  MAX_DEMO_PROMPT_CHARS: 2500,          // Prevent giant token-drain prompts
  MAX_DEMO_OUTPUT_TOKENS: 450           // Enforce cost-effective generation on demo calls
};

/**
 * Resets daily counters at midnight UTC
 */
function checkDailyReset() {
  const currentDate = new Date().toDateString();
  if (currentDate !== lastResetDate) {
    globalDemoCallsToday = 0;
    ipTracker.clear();
    sessionTracker.clear();
    lastResetDate = currentDate;
    console.log('[HackathonShield] Daily counters successfully reset.');
  }
}

/**
 * Extract client IP address safely behind proxies (Vercel, Render, Railway, Fly.io, Cloudflare)
 */
export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || '127.0.0.1';
}

/**
 * Express Middleware to shield Vertex AI endpoints
 */
export function hackathonAiShieldMiddleware(req, res, next) {
  checkDailyReset();

  const clientIp = getClientIp(req);
  const sessionToken = req.headers['x-nefra-session-token'] || req.body?.sessionToken;
  const userUid = req.headers['x-user-uid'] || req.body?.userUid || req.body?.userId;

  const isAuthenticatedUser = Boolean(userUid && userUid !== 'creator_01' && userUid !== 'brand_01' && userUid !== 'guest');

  // Authenticated Google accounts have full access to their granted credits
  if (isAuthenticatedUser) {
    return next();
  }

  // -------------------------------------------------------------
  // ANONYMOUS / DEMO USERS PROTECTION LAYER
  // -------------------------------------------------------------

  // 1. Global Daily Circuit Breaker
  if (globalDemoCallsToday >= SHIELD_CONFIG.GLOBAL_ANONYMOUS_DAILY_CAP) {
    console.warn(`🚨 [HackathonShield] Global daily demo cap reached (${globalDemoCallsToday}/${SHIELD_CONFIG.GLOBAL_ANONYMOUS_DAILY_CAP}). Blocking anonymous call from ${clientIp}.`);
    return res.status(429).json({
      error: 'The public demo allowance has reached its daily safety cap. Please sign in with your Google account to evaluate the platform using your personal credits.',
      code: 'GLOBAL_DEMO_DAILY_CAP_REACHED',
      status: 429
    });
  }

  const now = Date.now();

  // 2. IP-based Rate Limiting (Sliding Window)
  const ipData = ipTracker.get(clientIp) || { count: 0, windowStart: now, dailyTotal: 0 };
  
  // Reset 15-min window if elapsed
  if (now - ipData.windowStart > SHIELD_CONFIG.PER_IP_WINDOW_MS) {
    ipData.count = 0;
    ipData.windowStart = now;
  }

  if (ipData.count >= SHIELD_CONFIG.PER_IP_WINDOW_MAX || ipData.dailyTotal >= SHIELD_CONFIG.PER_IP_DAILY_MAX) {
    console.warn(`🛑 [HackathonShield] Rate limit exceeded for IP: ${clientIp} (${ipData.count}/${SHIELD_CONFIG.PER_IP_WINDOW_MAX} window, ${ipData.dailyTotal}/${SHIELD_CONFIG.PER_IP_DAILY_MAX} daily).`);
    return res.status(429).json({
      error: 'Demo trial limit reached for this session (5 free evaluations per 15 min). Please sign in with Google to unlock full hackathon evaluator credits!',
      code: 'HACKATHON_DEMO_LIMIT_EXCEEDED',
      remainingWaitSeconds: Math.ceil((SHIELD_CONFIG.PER_IP_WINDOW_MS - (now - ipData.windowStart)) / 1000),
      status: 429
    });
  }

  // 3. Prompt Payload Flood Guard
  try {
    const rawPayload = JSON.stringify(req.body);
    if (rawPayload.length > SHIELD_CONFIG.MAX_DEMO_PROMPT_CHARS * 3) {
      console.warn(`⚠️ [HackathonShield] Blocked oversized payload from ${clientIp} (${rawPayload.length} bytes).`);
      return res.status(400).json({
        error: 'Demo prompts are capped at 2,500 characters to prevent resource exhaustion. Please sign in with Google for unrestricted model access.',
        code: 'PROMPT_TOO_LARGE',
        status: 400
      });
    }
  } catch (e) {}

  // 4. Force token-efficient generation config for demo callers
  if (req.body && typeof req.body === 'object') {
    if (!req.body.generationConfig) {
      req.body.generationConfig = {};
    }
    // Cap maxOutputTokens so an attacker cannot request 8,000 output tokens
    req.body.generationConfig.maxOutputTokens = Math.min(
      req.body.generationConfig.maxOutputTokens || SHIELD_CONFIG.MAX_DEMO_OUTPUT_TOKENS,
      SHIELD_CONFIG.MAX_DEMO_OUTPUT_TOKENS
    );
  }

  // Increment counters
  ipData.count += 1;
  ipData.dailyTotal += 1;
  ipTracker.set(clientIp, ipData);

  if (sessionToken) {
    const sessCount = (sessionTracker.get(sessionToken) || 0) + 1;
    sessionTracker.set(sessionToken, sessCount);
  }

  globalDemoCallsToday += 1;

  console.log(`🛡️ [HackathonShield] Allowed demo AI call (IP: ${clientIp}, Daily Anonymous Total: ${globalDemoCallsToday}/${SHIELD_CONFIG.GLOBAL_ANONYMOUS_DAILY_CAP})`);
  next();
}

/**
 * Expose current shield metrics for Admin monitoring
 */
export function getHackathonShieldMetrics() {
  checkDailyReset();
  return {
    globalDemoCallsToday,
    globalCap: SHIELD_CONFIG.GLOBAL_ANONYMOUS_DAILY_CAP,
    activeIpsTracked: ipTracker.size,
    isCircuitBreakerActive: globalDemoCallsToday >= SHIELD_CONFIG.GLOBAL_ANONYMOUS_DAILY_CAP
  };
}
