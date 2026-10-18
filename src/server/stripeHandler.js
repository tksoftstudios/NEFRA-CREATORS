import fs from 'fs';
import path from 'path';

/**
 * Stripe Sandbox Backend Handler
 * Processes test payments for Creator Credit top-ups using Stripe REST API.
 */

function getStripeCredentials() {
  let secretKey = process.env.STRIPE_SECRET_KEY || '';
  let publishableKey = process.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  let accountId = process.env.STRIPE_ACCOUNT_ID || '';

  // Fallback to stripe.json in root if present
  try {
    const jsonPath = path.resolve(process.cwd(), 'stripe.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (!secretKey && data.secret_key) secretKey = data.secret_key;
      if (!publishableKey && data.publishable_key) publishableKey = data.publishable_key;
      if (!accountId && data.account_id) accountId = data.account_id;
    }
  } catch (e) {
    console.warn('[Stripe Handler] Notice reading stripe.json:', e.message);
  }

  return { secretKey, publishableKey, accountId };
}

export function handleGetStripeConfig() {
  const { publishableKey, accountId } = getStripeCredentials();
  return {
    success: true,
    publishableKey,
    accountId,
    environment: 'sandbox'
  };
}

export async function handleStripeTopup(payload = {}) {
  const { secretKey, accountId } = getStripeCredentials();
  const amountCents = parseInt(payload.amountCents, 10) || 1000; // $10.00
  const credits = parseInt(payload.credits, 10) || 50;
  const paymentMethod = payload.paymentMethod || 'pm_card_visa';

  if (!secretKey) {
    throw new Error('Stripe secret key not configured in stripe.json or .env');
  }

  console.log(`💳 [Stripe Sandbox] Processing payment for +${credits} Credits ($${(amountCents / 100).toFixed(2)} USD)...`);

  const params = new URLSearchParams();
  params.append('amount', String(amountCents));
  params.append('currency', 'usd');
  params.append('description', `NEFRA Creator Credits Top-Up: +${credits} Credits`);
  params.append('payment_method', paymentMethod);
  params.append('confirm', 'true');
  params.append('return_url', 'http://127.0.0.1:5173/wallet');
  params.append('metadata[credits]', String(credits));
  params.append('metadata[service]', 'nefra_creator_platform');

  const headers = {
    'Authorization': `Bearer ${secretKey}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  if (accountId) {
    headers['Stripe-Account'] = accountId;
  }

  const res = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers,
    body: params.toString()
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    const errMsg = data.error?.message || `Stripe API error (${res.status})`;
    console.error('❌ [Stripe Sandbox] Payment failed:', errMsg);
    throw new Error(errMsg);
  }

  console.log(`✅ [Stripe Sandbox] Payment Succeeded! Intent ID: ${data.id}, Status: ${data.status}`);

  return {
    success: true,
    paymentIntentId: data.id,
    amountCents: data.amount,
    currency: data.currency,
    creditsAdded: credits,
    status: data.status,
    chargeId: data.latest_charge || data.charges?.data?.[0]?.id || `ch_${Date.now()}`,
    receiptUrl: data.charges?.data?.[0]?.receipt_url || null,
    timestamp: new Date().toISOString()
  };
}
