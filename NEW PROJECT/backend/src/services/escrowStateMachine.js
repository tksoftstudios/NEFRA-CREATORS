/**
 * Escrow State Machine
 * States:
 * 1. FUNDED: Brand deposited 100% of contract budget into vault.
 * 2. IN_PROGRESS: Creator confirmed kickoff / script outline submitted.
 * 3. DELIVERED: Creator uploaded draft video deliverable (unlisted link).
 * 4. APPROVED: Brand reviewed and signed off on video.
 * 5. RELEASED: Escrow funds disbursed to creator payout wallet.
 * Exceptional: DISPUTED, REFUNDED
 */

export const ESCROW_STATES = {
  FUNDED: 'FUNDED',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  APPROVED: 'APPROVED',
  RELEASED: 'RELEASED',
  DISPUTED: 'DISPUTED',
  REFUNDED: 'REFUNDED'
};

const VALID_TRANSITIONS = {
  [ESCROW_STATES.FUNDED]: [ESCROW_STATES.IN_PROGRESS, ESCROW_STATES.DISPUTED, ESCROW_STATES.REFUNDED],
  [ESCROW_STATES.IN_PROGRESS]: [ESCROW_STATES.DELIVERED, ESCROW_STATES.DISPUTED],
  [ESCROW_STATES.DELIVERED]: [ESCROW_STATES.APPROVED, ESCROW_STATES.REVISION_REQUESTED, ESCROW_STATES.DISPUTED],
  [ESCROW_STATES.REVISION_REQUESTED]: [ESCROW_STATES.DELIVERED, ESCROW_STATES.DISPUTED],
  [ESCROW_STATES.APPROVED]: [ESCROW_STATES.RELEASED, ESCROW_STATES.DISPUTED],
  [ESCROW_STATES.RELEASED]: [], // Terminal state
  [ESCROW_STATES.DISPUTED]: [ESCROW_STATES.APPROVED, ESCROW_STATES.REFUNDED, ESCROW_STATES.IN_PROGRESS],
  [ESCROW_STATES.REFUNDED]: [] // Terminal state
};

export function canTransition(currentState, nextState) {
  const allowed = VALID_TRANSITIONS[currentState] || [];
  return allowed.includes(nextState);
}

export function transitionContract(contract, nextState, metadata = {}) {
  const currentState = contract.status || ESCROW_STATES.FUNDED;

  if (!canTransition(currentState, nextState)) {
    throw new Error(
      `Invalid escrow state transition from "${currentState}" to "${nextState}". Allowed: [${(VALID_TRANSITIONS[currentState] || []).join(', ')}]`
    );
  }

  const logEntry = {
    from: currentState,
    to: nextState,
    timestamp: new Date().toISOString(),
    ...metadata
  };

  return {
    ...contract,
    status: nextState,
    history: [...(contract.history || []), logEntry],
    updatedAt: new Date().toISOString()
  };
}
