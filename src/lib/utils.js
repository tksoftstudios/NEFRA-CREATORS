/**
 * Common formatting and class utilities
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Format integer cents into USD currency string
 * e.g., 250000 -> "$2,500.00", 85000 -> "$850.00"
 */
export function formatCents(cents, includeDecimals = false) {
  const value = (Number(cents) || 0) / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  }).format(value);
}

/**
 * Format raw numbers into compact or readable notation
 * e.g., 428500 -> "428.5K", 18450210 -> "18.5M"
 */
export function formatNumber(num) {
  const n = Number(num) || 0;
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return n.toLocaleString();
}

/**
 * Format ISO dates into readable timestamps
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  } catch (e) {
    return dateString;
  }
}

/**
 * Robust creator deduplication helper
 * Deduplicates creators by matching:
 * 1. Matching id
 * 2. Matching handle (e.g. @elenacodes or elenacodes)
 * 3. Matching YouTube channelId
 * 4. Matching email
 * 5. Matching exact full name (ignoring generic 'Creator Account')
 * Merges duplicate entries preserving verified status and highest quality data.
 */
export function deduplicateCreators(list = []) {
  if (!Array.isArray(list)) return [];

  const seenIds = new Set();
  const seenHandles = new Set();
  const seenChannelIds = new Set();
  const seenEmails = new Set();
  const seenNames = new Set();

  const unique = [];

  for (const c of list) {
    if (!c) continue;

    const id = c.id ? String(c.id).trim() : null;
    const cleanHandle = c.handle ? String(c.handle).toLowerCase().replace(/^@/, '').trim() : null;
    const channelId = c.youtube?.channelId || c.channelId ? String(c.youtube?.channelId || c.channelId).trim() : null;
    const email = c.email ? String(c.email).toLowerCase().trim() : null;
    const cleanName = c.name && c.name.toLowerCase() !== 'creator account' ? String(c.name).toLowerCase().trim() : null;

    const isDuplicate =
      (id && seenIds.has(id)) ||
      (cleanHandle && seenHandles.has(cleanHandle)) ||
      (channelId && seenChannelIds.has(channelId)) ||
      (email && seenEmails.has(email)) ||
      (cleanName && seenNames.has(cleanName));

    if (!isDuplicate) {
      if (id) seenIds.add(id);
      if (cleanHandle) seenHandles.add(cleanHandle);
      if (channelId) seenChannelIds.add(channelId);
      if (email) seenEmails.add(email);
      if (cleanName) seenNames.add(cleanName);
      unique.push(c);
    } else {
      // Find matching entry to enrich
      const existingIdx = unique.findIndex(u => {
        const uId = u.id ? String(u.id).trim() : null;
        const uHandle = u.handle ? String(u.handle).toLowerCase().replace(/^@/, '').trim() : null;
        const uChan = u.youtube?.channelId || u.channelId ? String(u.youtube?.channelId || u.channelId).trim() : null;
        const uMail = u.email ? String(u.email).toLowerCase().trim() : null;
        const uName = u.name && u.name.toLowerCase() !== 'creator account' ? String(u.name).toLowerCase().trim() : null;

        return (
          (id && uId && id === uId) ||
          (cleanHandle && uHandle && cleanHandle === uHandle) ||
          (channelId && uChan && channelId === uChan) ||
          (email && uMail && email === uMail) ||
          (cleanName && uName && cleanName === uName)
        );
      });

      if (existingIdx !== -1) {
        const existing = unique[existingIdx];
        const isBetter = (!existing.youtubeConnected && c.youtubeConnected) || 
                         (!existing.verified && c.verified) || 
                         ((c.aiScore || 0) > (existing.aiScore || 0)) ||
                         (c.audit && !existing.audit);
        unique[existingIdx] = isBetter ? { ...existing, ...c } : { ...c, ...existing };
      }
    }
  }

  return unique;
}
