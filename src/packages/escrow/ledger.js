/**
 * Append-only financial ledger for escrow operations
 */

export const LEDGER_ENTRY_TYPES = {
  DEPOSIT: 'deposit',
  PAYOUT_CREATOR: 'payout_creator',
  FEE_PLATFORM: 'fee_platform',
  REFUND_BRAND: 'refund_brand',
  DISPUTE_SPLIT: 'dispute_split'
};

export function createLedgerEntry({
  contractId,
  account,
  amountCents,
  type,
  note = ''
}) {
  return {
    id: `led_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    contractId,
    account,
    amountCents: Math.round(Number(amountCents) || 0),
    type,
    note,
    createdAt: new Date().toISOString()
  };
}
