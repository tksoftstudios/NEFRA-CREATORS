import { store } from '../data/inMemoryStore.js';
import { calculateEscrowFees } from '../services/feeCalculator.js';

export function getCampaigns(req, res) {
  const { modality, category } = req.query;
  let results = [...store.campaigns];

  if (modality && modality !== 'all') {
    results = results.filter(c => c.modality === modality);
  }

  if (category) {
    results = results.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));
  }

  res.json({ success: true, count: results.length, campaigns: results });
}

export function createCampaign(req, res) {
  const { title, category, modality, budget, deadline, targetCountries, description, deliverableType } = req.body;

  if (!title || !budget) {
    return res.status(400).json({ error: 'Title and budget are required' });
  }

  const feeBreakdown = calculateEscrowFees(budget);

  const newCampaign = {
    id: `camp_${Date.now()}`,
    brandName: req.body.brandName || "Acme Enterprise Corp",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
    title,
    category: category || "Developer Tools & AI",
    modality: modality || "online",
    budget: Number(budget),
    escrowGuaranteed: true,
    escrowFees: feeBreakdown,
    deadline: deadline || "2026-11-20",
    targetCountries: Array.isArray(targetCountries) ? targetCountries : ["Global"],
    description: description || "",
    deliverableType: deliverableType || "Dedicated Video",
    bidsCount: 0,
    createdAt: new Date().toISOString()
  };

  store.campaigns.unshift(newCampaign);

  res.status(201).json({
    success: true,
    message: 'Campaign created and escrow deposit confirmed',
    campaign: newCampaign
  });
}

export function submitProposal(req, res) {
  const { campaignId, proposedBudget, turnaroundDays, pitch, milestones } = req.body;

  if (!campaignId || !proposedBudget) {
    return res.status(400).json({ error: 'Campaign ID and proposed budget are required' });
  }

  const campaign = store.campaigns.find(c => c.id === campaignId);
  if (!campaign) {
    return res.status(404).json({ error: 'Campaign not found' });
  }

  const feeBreakdown = calculateEscrowFees(proposedBudget);

  const proposal = {
    id: `prop_${Date.now()}`,
    campaignId,
    creatorId: 'creator_01',
    proposedBudget: Number(proposedBudget),
    turnaroundDays: Number(turnaroundDays) || 7,
    pitch: pitch || '',
    milestones: milestones || { outline: 30, draft: 50, final: 20 },
    fees: feeBreakdown,
    status: 'pending_brand_review',
    submittedAt: new Date().toISOString()
  };

  store.proposals.push(proposal);
  campaign.bidsCount = (campaign.bidsCount || 0) + 1;

  res.status(201).json({
    success: true,
    message: 'Proposal successfully submitted to brand',
    proposal
  });
}
