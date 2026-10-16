import { config } from '../config/config.js';

/**
 * Fee Calculation Engine
 * Platform take-rate: 10% (standard) to 15% (VIP managed)
 */
export function calculateEscrowFees(grossAmount, customTakeRate = null) {
  const amount = Number(grossAmount) || 0;
  const takeRate = customTakeRate !== null ? Number(customTakeRate) : config.platformFeePercentage;
  
  const platformFee = Math.round(amount * (takeRate / 100));
  const netCreatorPayout = amount - platformFee;

  return {
    grossAmount: amount,
    takeRatePercent: takeRate,
    platformFee,
    netCreatorPayout,
    escrowVaultHold: amount, // 100% of gross is locked in escrow
    calculatedAt: new Date().toISOString()
  };
}
