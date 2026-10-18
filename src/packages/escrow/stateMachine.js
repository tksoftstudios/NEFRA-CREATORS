/**
 * NEFRA Escrow State Machine
 * Strictly implements the transition rules from Section 8 of the Build Guide
 */

export const ESCROW_STATES = {
  PENDING_PAYMENT: 'pending_payment',
  FUNDED: 'funded',
  IN_PRODUCTION: 'in_production',
  DRAFT_REVIEW: 'draft_review',
  REVISION_REQUESTED: 'revision_requested',
  APPROVED: 'approved',
  RELEASED: 'released',
  DISPUTED: 'disputed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

/**
 * Transition Table:
 * pending_payment -> funded
 * funded -> in_production | refunded | disputed
 * in_production -> draft_review | disputed
 * draft_review -> approved | revision_requested | disputed
 * revision_requested -> in_production | disputed
 * approved -> released | disputed
 * any active state -> disputed
 * disputed -> released | refunded | split
 */
export const ALLOWED_TRANSITIONS = {
  [ESCROW_STATES.PENDING_PAYMENT]: [
    ESCROW_STATES.FUNDED,
    ESCROW_STATES.CANCELLED
  ],
  [ESCROW_STATES.FUNDED]: [
    ESCROW_STATES.IN_PRODUCTION,
    ESCROW_STATES.REFUNDED,
    ESCROW_STATES.DISPUTED
  ],
  [ESCROW_STATES.IN_PRODUCTION]: [
    ESCROW_STATES.DRAFT_REVIEW,
    ESCROW_STATES.DISPUTED
  ],
  [ESCROW_STATES.DRAFT_REVIEW]: [
    ESCROW_STATES.APPROVED,
    ESCROW_STATES.REVISION_REQUESTED,
    ESCROW_STATES.DISPUTED
  ],
  [ESCROW_STATES.REVISION_REQUESTED]: [
    ESCROW_STATES.IN_PRODUCTION,
    ESCROW_STATES.DISPUTED
  ],
  [ESCROW_STATES.APPROVED]: [
    ESCROW_STATES.RELEASED,
    ESCROW_STATES.DISPUTED
  ],
  [ESCROW_STATES.RELEASED]: [], // Terminal state
  [ESCROW_STATES.REFUNDED]: [], // Terminal state
  [ESCROW_STATES.CANCELLED]: [], // Terminal state
  [ESCROW_STATES.DISPUTED]: [
    ESCROW_STATES.RELEASED,
    ESCROW_STATES.REFUNDED,
    ESCROW_STATES.IN_PRODUCTION
  ]
};

export function canTransition(currentState, nextState) {
  const allowed = ALLOWED_TRANSITIONS[currentState] || [];
  return allowed.includes(nextState);
}

export function transitionContract(contract, nextState, metadata = {}) {
  const currentState = contract.state || ESCROW_STATES.FUNDED;

  if (!canTransition(currentState, nextState)) {
    throw new Error(
      `Invalid escrow transition from "${currentState}" to "${nextState}". Allowed: [${(ALLOWED_TRANSITIONS[currentState] || []).join(', ')}]`
    );
  }

  const eventDoc = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    from: currentState,
    to: nextState,
    actor: metadata.actor || 'system',
    reason: metadata.reason || '',
    deliverableUrl: metadata.deliverableUrl || null,
    timestamp: new Date().toISOString()
  };

  const updatedRevisions = nextState === ESCROW_STATES.REVISION_REQUESTED 
    ? Math.max(0, (contract.revisionsLeft ?? 2) - 1)
    : (contract.revisionsLeft ?? 2);

  return {
    ...contract,
    state: nextState,
    revisionsLeft: updatedRevisions,
    deliverableUrl: metadata.deliverableUrl || contract.deliverableUrl,
    events: [...(contract.events || []), eventDoc],
    updatedAt: new Date().toISOString()
  };
}
