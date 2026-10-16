import { store } from '../data/inMemoryStore.js';
import { transitionContract, ESCROW_STATES } from '../services/escrowStateMachine.js';
import { calculateEscrowFees } from '../services/feeCalculator.js';

export function getContracts(req, res) {
  res.json({
    success: true,
    totalEscrowLocked: store.escrowContracts.reduce((acc, c) => acc + (c.status !== 'RELEASED' ? c.amount : 0), 0),
    contracts: store.escrowContracts
  });
}

export function getContractById(req, res) {
  const { id } = req.params;
  const contract = store.escrowContracts.find(c => c.id === id);

  if (!contract) {
    return res.status(404).json({ error: 'Escrow contract not found' });
  }

  res.json({ success: true, contract });
}

export function uploadDeliverable(req, res) {
  const { id } = req.params;
  const { previewUrl, timestampNotes } = req.body;

  if (!previewUrl) {
    return res.status(400).json({ error: 'Deliverable video URL is required' });
  }

  const contract = store.escrowContracts.find(c => c.id === id);
  if (!contract) {
    return res.status(404).json({ error: 'Escrow contract not found' });
  }

  try {
    const updated = transitionContract(contract, ESCROW_STATES.DELIVERED, {
      note: 'Creator submitted video deliverable for review',
      deliverableUrl: previewUrl,
      timestampNotes: timestampNotes || ''
    });

    updated.deliverableUrl = previewUrl;
    updated.currentStepIndex = 2; // Delivered

    const idx = store.escrowContracts.findIndex(c => c.id === id);
    store.escrowContracts[idx] = updated;

    res.json({
      success: true,
      message: 'Deliverable submitted! Brand notified for signoff.',
      contract: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export function advanceState(req, res) {
  const { id } = req.params;
  const { nextState, note } = req.body;

  const contract = store.escrowContracts.find(c => c.id === id);
  if (!contract) {
    return res.status(404).json({ error: 'Escrow contract not found' });
  }

  try {
    const updated = transitionContract(contract, nextState, { note: note || `Transition to ${nextState}` });

    if (nextState === ESCROW_STATES.APPROVED) {
      updated.currentStepIndex = 3;
    } else if (nextState === ESCROW_STATES.RELEASED) {
      updated.currentStepIndex = 4;
      // Credit to creator metrics
      if (store.creators[0]) {
        store.creators[0].metrics.totalEarned += updated.netPayout;
        store.creators[0].metrics.escrowLocked = Math.max(0, store.creators[0].metrics.escrowLocked - updated.amount);
      }
    }

    const idx = store.escrowContracts.findIndex(c => c.id === id);
    store.escrowContracts[idx] = updated;

    res.json({
      success: true,
      message: `Contract transitioned to ${nextState}`,
      contract: updated
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export function previewFees(req, res) {
  const amount = req.query.amount || 1000;
  const takeRate = req.query.takeRate || null;

  const fees = calculateEscrowFees(amount, takeRate);
  res.json({ success: true, fees });
}
