import { Router } from 'express';
import {
  getContracts,
  getContractById,
  uploadDeliverable,
  advanceState,
  previewFees
} from '../controllers/escrowController.js';

const router = Router();

router.get('/contracts', getContracts);
router.get('/contracts/:id', getContractById);
router.post('/contracts/:id/deliverable', uploadDeliverable);
router.post('/contracts/:id/transition', advanceState);
router.get('/fees/calculate', previewFees);

export default router;
