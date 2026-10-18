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
