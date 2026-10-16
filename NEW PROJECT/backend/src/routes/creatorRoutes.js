import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getRateCards,
  createRateCard,
  updateRateCard,
  getLeaderboard
} from '../controllers/creatorController.js';

const router = Router();

router.get('/me', getProfile);
router.put('/me', updateProfile);

router.get('/rate-cards', getRateCards);
router.post('/rate-cards', createRateCard);
router.put('/rate-cards/:id', updateRateCard);

router.get('/leaderboard', getLeaderboard);

export default router;
