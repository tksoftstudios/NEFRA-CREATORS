/**
 * Stripe Sandbox Frontend Service
 * Connects Creator Credit Wallet to Stripe REST API.
 */

export const CREDIT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Creator Pack',
    credits: 50,
    bonusCredits: 0,
    amountDollars: 10,
    amountCents: 1000,
    description: 'Ideal for running 5 deep channel audits or 10 AI campaign proposals.',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro Growth Pack',
    credits: 150,
    bonusCredits: 15,
    amountDollars: 25,
    amountCents: 2500,
    description: 'Most popular for active creators bidding on enterprise brand escrow campaigns.',
    popular: true
  },
  {
    id: 'agency',
    name: 'Agency Scale Pack',
    credits: 500,
    bonusCredits: 50,
    amountDollars: 70,
    amountCents: 7000,
    description: 'Unlimited multimodal video audits, job card drafts, and priority matching.',
    popular: false
  }
];

export async function fetchStripeConfig() {
  try {
    const res = await fetch('/api/stripe/config');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[Stripe Service] Config fetch notice:', e.message);
  }
  return {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    environment: 'sandbox'
  };
}

export async function topupCreditsWithStripe({ amountCents, credits, paymentMethod = 'pm_card_visa' }) {
  console.log(`💳 [Stripe Client] Requesting top-up of +${credits} Credits ($${(amountCents / 100).toFixed(2)} USD)...`);
  
  const res = await fetch('/api/stripe/topup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amountCents,
      credits,
      paymentMethod
    })
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to complete Stripe payment');
  }

  return data;
}
