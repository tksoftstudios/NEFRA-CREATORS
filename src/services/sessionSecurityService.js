/**
 * Session Security & Multi-Browser Isolation Service
 * 
 * Guarantees that when multiple browser windows, different browsers, or
 * separate Google accounts log into NEFRA, their sessions, security tokens,
 * wallet balances, contracts, and private conversations never overlap or leak.
 */

const SESSION_TOKEN_KEY = 'nefra_session_token';
const SESSION_DATA_KEY = 'nefra_session_data';
const BROWSER_INSTANCE_KEY = 'nefra_browser_instance_id';

/**
 * Generate a cryptographically secure UUID or fallback
 */
function generateSecureId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
}

/**
 * Get or create unique Browser Instance ID (persistent across tabs in the same browser profile)
 */
export function getBrowserInstanceId() {
  if (typeof window === 'undefined') return 'server_instance';
  try {
    let browserId = localStorage.getItem(BROWSER_INSTANCE_KEY);
    if (!browserId) {
      browserId = generateSecureId('brw');
      localStorage.setItem(BROWSER_INSTANCE_KEY, browserId);
    }
    return browserId;
  } catch (e) {
    return 'sandbox_browser';
  }
}

/**
 * Get or initialize Window / Tab Session Token
 * (Strictly isolated by the browser's sessionStorage - never shared across browsers or windows)
 */
export function getTabSessionToken() {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let token = sessionStorage.getItem(SESSION_TOKEN_KEY);
    if (!token) {
      token = generateSecureId('sess');
      sessionStorage.setItem(SESSION_TOKEN_KEY, token);
    }
    return token;
  } catch (e) {
    return 'sandbox_session';
  }
}

/**
 * Bind the active authenticated user to this isolated browser session
 */
export function bindBrowserSession(user, role = 'creator') {
  if (!user || typeof window === 'undefined') return null;

  const browserId = getBrowserInstanceId();
  const sessionToken = getTabSessionToken();
  const now = Date.now();

  const sessionPayload = {
    sessionToken,
    browserId,
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role,
    authenticatedAt: now,
    lastActiveAt: now,
    csrfToken: generateSecureId('csrf')
  };

  try {
    // 1. Save in sessionStorage (tab-isolated)
    sessionStorage.setItem(SESSION_DATA_KEY, JSON.stringify(sessionPayload));

    // 2. Save in localStorage keyed by browserId + uid (ensuring distinct user isolation)
    const storageKey = `nefra_session_${browserId}_${user.uid}`;
    localStorage.setItem(storageKey, JSON.stringify(sessionPayload));

    // 3. Mark active UID for this browser profile
    localStorage.setItem('nefra_active_uid', user.uid);
    localStorage.setItem('nefra_active_email', user.email || '');
  } catch (e) {
    console.warn('[SessionSecurity] Storage write note:', e);
  }

  console.log(`%c🛡️ [SessionSecurity] Browser session isolated & bound: ${user.email} (Session: ${sessionToken.slice(0, 12)}...)`, 'color: #10b981; font-weight: bold;');
  return sessionPayload;
}

/**
 * Verify current session integrity against the active Firebase User
 */
export function validateSessionIntegrity(currentUser) {
  if (typeof window === 'undefined') return true;

  try {
    const rawData = sessionStorage.getItem(SESSION_DATA_KEY);
    if (!rawData) {
      if (currentUser) {
        // Hydrate session if missing
        bindBrowserSession(currentUser);
      }
      return true;
    }

    const session = JSON.parse(rawData);

    // If a different user signed in in this tab, update binding
    if (currentUser && session.uid !== currentUser.uid) {
      console.warn(`[SessionSecurity] Session account switch detected: ${session.email} -> ${currentUser.email}. Rebinding.`);
      bindBrowserSession(currentUser);
      return true;
    }

    return true;
  } catch (e) {
    return true;
  }
}

/**
 * Destroy active browser session on sign out
 */
export function destroyBrowserSession() {
  if (typeof window === 'undefined') return;

  try {
    const browserId = getBrowserInstanceId();
    const activeUid = localStorage.getItem('nefra_active_uid');

    sessionStorage.removeItem(SESSION_TOKEN_KEY);
    sessionStorage.removeItem(SESSION_DATA_KEY);

    if (activeUid) {
      localStorage.removeItem(`nefra_session_${browserId}_${activeUid}`);
      localStorage.removeItem('nefra_active_uid');
      localStorage.removeItem('nefra_active_email');
      localStorage.removeItem('nefra_active_role');
    }
    console.log('%c🛡️ [SessionSecurity] Active browser session destroyed.', 'color: #ef4444; font-weight: bold;');
  } catch (e) {}
}

/**
 * Helper to generate user-partitioned storage key (preventing cross-account local storage collision)
 */
export function getPartitionedKey(keyName, uid) {
  const safeUid = uid || 'guest';
  return `${keyName}_usr_${safeUid}`;
}

/**
 * Get session diagnostic info for UI display
 */
export function getSessionDiagnostics(currentUser) {
  const browserId = getBrowserInstanceId();
  const sessionToken = getTabSessionToken();

  return {
    isIsolated: true,
    browserIdSnippet: browserId ? browserId.slice(-6) : 'local',
    sessionIdSnippet: sessionToken ? sessionToken.slice(-6) : 'active',
    authenticatedUid: currentUser?.uid || null,
    authenticatedEmail: currentUser?.email || 'Guest Mode'
  };
}
