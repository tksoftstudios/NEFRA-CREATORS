import { Router } from 'express';
import { auditVideo, getChannelSafety } from '../controllers/aiController.js';

const router = Router();

router.post('/audit-video', auditVideo);
router.get('/channel-safety', getChannelSafety);

export default router;
