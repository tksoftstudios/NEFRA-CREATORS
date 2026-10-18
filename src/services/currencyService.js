/**
 * Multi-Currency Exchange & Formatting Service
 * Allows users to view all platform amounts in their preferred currency.
 */

export const SUPPORTED_CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, name: 'US Dollar (USD)', flag: '🇺🇸', locale: 'en-US' },
  LKR: { code: 'LKR', symbol: 'Rs', rate: 305.0, name: 'Sri Lankan Rupee (LKR)', flag: '🇱🇰', locale: 'en-LK' },
  INR: { code: 'INR', symbol: '₹', rate: 86.5, name: 'Indian Rupee (INR)', flag: '🇮🇳', locale: 'en-IN' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro (EUR)', flag: '🇪🇺', locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound (GBP)', flag: '🇬🇧', locale: 'en-GB' },
  SGD: { code: 'SGD', symbol: 'S$', rate: 1.34, name: 'Singapore Dollar (SGD)', flag: '🇸🇬', locale: 'en-SG' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.55, name: 'Australian Dollar (AUD)', flag: '🇦🇺', locale: 'en-AU' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.40, name: 'Canadian Dollar (CAD)', flag: '🇨🇦', locale: 'en-CA' },
  AED: { code: 'AED', symbol: 'AED', rate: 3.67, name: 'UAE Dirham (AED)', flag: '🇦🇪', locale: 'ar-AE' },
  JPY: { code: 'JPY', symbol: '¥', rate: 153.0, name: 'Japanese Yen (JPY)', flag: '🇯🇵', locale: 'ja-JP' }
};

/**
 * Get stored preferred currency from localStorage (defaults to USD)
 */
export function getSavedCurrency() {
  try {
    const saved = localStorage.getItem('nefra_preferred_currency');
    if (saved && SUPPORTED_CURRENCIES[saved]) {
      return saved;
    }
  } catch (e) {}
  return 'USD';
}

/**
 * Persist preferred currency to localStorage
 */
export function saveCurrency(currencyCode) {
  try {
    if (SUPPORTED_CURRENCIES[currencyCode]) {
      localStorage.setItem('nefra_preferred_currency', currencyCode);
    }
  } catch (e) {}
}

/**
 * Convert USD integer cents to target currency amount
 */
export function convertUsdCentsToTarget(usdCents, targetCurrency = 'USD') {
  const cents = Number(usdCents) || 0;
  const baseUsd = cents / 100;
  const curr = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  return baseUsd * curr.rate;
}

/**
 * Format USD cents into preferred currency string
 * e.g., formatCurrency(85000, 'LKR') -> "Rs 259,250"
 * e.g., formatCurrency(85000, 'USD') -> "$850"
 */
export function formatCurrency(usdCents, targetCurrency = 'USD', includeDecimals = false) {
  const curr = SUPPORTED_CURRENCIES[targetCurrency] || SUPPORTED_CURRENCIES.USD;
  const convertedValue = convertUsdCentsToTarget(usdCents, targetCurrency);

  // Currencies without sub-units in common use
  const isZeroDecimal = ['JPY', 'LKR'].includes(curr.code);

  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    minimumFractionDigits: (includeDecimals && !isZeroDecimal) ? 2 : 0,
    maximumFractionDigits: (includeDecimals && !isZeroDecimal) ? 2 : 0
  }).format(convertedValue);
}
