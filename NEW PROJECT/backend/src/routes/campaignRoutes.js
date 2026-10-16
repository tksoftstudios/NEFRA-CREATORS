import { Router } from 'express';
import { getCampaigns, createCampaign, submitProposal } from '../controllers/campaignController.js';

const router = Router();

router.get('/', getCampaigns);
router.post('/', createCampaign);
router.post('/proposals', submitProposal);

export default router;
