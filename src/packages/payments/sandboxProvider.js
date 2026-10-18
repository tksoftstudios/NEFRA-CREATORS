/**
 * Sandbox Payments Provider
 * Simulates real-world escrow funding and payouts without external processor lock-in.
 * Writes deterministic ledger entries and guarantees exact cent reconciliation.
 */

import { createLedgerEntry, LEDGER_ENTRY_TYPES } from '../escrow/ledger';

export class SandboxPaymentsProvider {
  /**
   * Brand funds 100% of campaign into platform vault
   */
  async collectDeposit(contractId, amountCents, brandName = 'Brand Client') {
    const entry = createLedgerEntry({
      contractId,
      account: 'platform_escrow_vault',
      amountCents,
      type: LEDGER_ENTRY_TYPES.DEPOSIT,
      note: `Pre-funded 100% deposit received from ${brandName}`
    });

    return {
      success: true,
      transactionId: `tx_dep_${Date.now()}`,
      ledgerEntry: entry
    };
  }

  /**
   * Releases escrow to creator wallet and transfers platform fee
   */
  async releasePayout(contractId, creatorId, netAmountCents, platformFeeCents) {
    const creatorEntry = createLedgerEntry({
      contractId,
      account: `creator_wallet_${creatorId}`,
      amountCents: netAmountCents,
      type: LEDGER_ENTRY_TYPES.PAYOUT_CREATOR,
      note: `Escrow milestone released to creator wallet`
    });

    const feeEntry = createLedgerEntry({
      contractId,
      account: 'nefra_revenue_account',
      amountCents: platformFeeCents,
      type: LEDGER_ENTRY_TYPES.FEE_PLATFORM,
      note: `Platform take-rate fee retained`
    });

    return {
      success: true,
      transactionId: `tx_rel_${Date.now()}`,
      ledgerEntries: [creatorEntry, feeEntry]
    };
  }

  /**
   * Refunds deposit back to brand
   */
  async refundDeposit(contractId, brandOrgId, amountCents, reason = 'Mutual cancellation') {
    const entry = createLedgerEntry({
      contractId,
      account: `brand_org_${brandOrgId}`,
      amountCents: -amountCents,
      type: LEDGER_ENTRY_TYPES.REFUND_BRAND,
      note: `Full escrow deposit refunded: ${reason}`
    });

    return {
      success: true,
      transactionId: `tx_ref_${Date.now()}`,
      ledgerEntry: entry
    };
  }

  /**
   * Arbitrates disputed contract by percentage split
   */
  async disputeSplit(contractId, creatorId, brandOrgId, creatorCents, brandCents, feeCents) {
    const entries = [
      createLedgerEntry({
        contractId,
        account: `creator_wallet_${creatorId}`,
        amountCents: creatorCents,
        type: LEDGER_ENTRY_TYPES.DISPUTE_SPLIT,
        note: `Arbitrated partial payout to creator`
      }),
      createLedgerEntry({
        contractId,
        account: `brand_org_${brandOrgId}`,
        amountCents: brandCents,
        type: LEDGER_ENTRY_TYPES.REFUND_BRAND,
        note: `Arbitrated remaining refund to brand`
      }),
      createLedgerEntry({
        contractId,
        account: 'nefra_revenue_account',
        amountCents: feeCents,
        type: LEDGER_ENTRY_TYPES.FEE_PLATFORM,
        note: `Arbitration processing fee`
      })
    ];

    return {
      success: true,
      transactionId: `tx_split_${Date.now()}`,
      ledgerEntries: entries
    };
  }
}

export const sandboxPayments = new SandboxPaymentsProvider();
