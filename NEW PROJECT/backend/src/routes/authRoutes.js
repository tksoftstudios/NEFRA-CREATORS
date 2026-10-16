import { Router } from 'express';
import { verifyYouTube } from '../controllers/authController.js';

const router = Router();

router.post('/verify-youtube', verifyYouTube);

export default router;
