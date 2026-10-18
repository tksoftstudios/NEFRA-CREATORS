/**
 * Escrow Fee Calculation & Milestone Math
 * All calculations performed in integer cents to eliminate floating-point drift
 */

export const DEFAULT_FEE_PERCENT = 10; // 10% standard take rate

/**
 * Calculates platform fee, net creator payout, and escrow lock amount in integer cents.
 * @param {number} amountCents - Total contract budget in cents
 * @param {number} feePercent - Platform fee percentage (10 to 15)
 */
export function calculateContractFees(amountCents, feePercent = DEFAULT_FEE_PERCENT) {
  const gross = Math.round(Number(amountCents) || 0);
  const percent = Math.min(15, Math.max(10, Number(feePercent) || DEFAULT_FEE_PERCENT));
  
  const platformFeeCents = Math.round(gross * (percent / 100));
  const netCreatorCents = gross - platformFeeCents;

  return {
    grossAmountCents: gross,
    feePercent: percent,
    platformFeeCents,
    netCreatorCents,
    escrowHeldCents: gross
  };
}

/**
 * Calculates 3-stage milestone breakdown (30% Script, 50% Draft, 20% Final)
 * Any remainder cents are added to the final milestone.
 */
export function calculateMilestones(totalAmountCents) {
  const total = Math.round(Number(totalAmountCents) || 0);

  const m1 = Math.floor(total * 0.30); // 30% Outline / Script
  const m2 = Math.floor(total * 0.50); // 50% Video Draft
  const m3 = total - m1 - m2;          // 20% + remainder cents

  return [
    {
      index: 1,
      title: "Script & Outline Sign-off",
      percent: 30,
      amountCents: m1,
      status: "pending"
    },
    {
      index: 2,
      title: "Unlisted Video Draft Review",
      percent: 50,
      amountCents: m2,
      status: "pending"
    },
    {
      index: 3,
      title: "Final 4K Delivery & Live Upload",
      percent: 20,
      amountCents: m3,
      status: "pending"
    }
  ];
}
