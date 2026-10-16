import { store } from '../data/inMemoryStore.js';
import { calculateEscrowFees } from '../services/feeCalculator.js';

export function getProfile(req, res) {
  const creator = store.creators[0];
  if (!creator) return res.status(404).json({ error: 'Creator not found' });
  res.json({ success: true, creator });
}

export function updateProfile(req, res) {
  const creator = store.creators[0];
  if (!creator) return res.status(404).json({ error: 'Creator not found' });

  const { name, bio, residence, modalityPreference, willingToTravel, category } = req.body;

  if (name) creator.name = name;
  if (bio) creator.bio = bio;
  if (residence) creator.residence = residence;
  if (modalityPreference) creator.modalityPreference = modalityPreference;
  if (willingToTravel !== undefined) creator.willingToTravel = willingToTravel;
  if (category) creator.category = category;

  res.json({
    success: true,
    message: 'Profile updated successfully',
    creator
  });
}

export function getRateCards(req, res) {
  res.json({
    success: true,
    rateCards: store.rateCards
  });
}

export function createRateCard(req, res) {
  const { title, type, price, turnaroundDays, revisions, modality, badge, description, deliverables } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: 'Title and price are required' });
  }

  const feeBreakdown = calculateEscrowFees(price);

  const newCard = {
    id: `pkg_${Date.now()}`,
    creatorId: 'creator_01',
    title,
    type: type || 'custom',
    price: Number(price),
    turnaroundDays: Number(turnaroundDays) || 7,
    revisions: Number(revisions) || 2,
    modality: modality || 'online',
    badge: badge || 'New Package',
    description: description || '',
    deliverables: Array.isArray(deliverables) ? deliverables : [],
    fees: feeBreakdown,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  store.rateCards.push(newCard);

  res.status(201).json({
    success: true,
    message: 'Rate Card package published',
    rateCard: newCard
  });
}

export function updateRateCard(req, res) {
  const { id } = req.params;
  const idx = store.rateCards.findIndex(c => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Rate card not found' });
  }

  const current = store.rateCards[idx];
  const updatedPrice = req.body.price ? Number(req.body.price) : current.price;
  const feeBreakdown = calculateEscrowFees(updatedPrice);

  store.rateCards[idx] = {
    ...current,
    ...req.body,
    price: updatedPrice,
    fees: feeBreakdown,
    updatedAt: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Rate card updated',
    rateCard: store.rateCards[idx]
  });
}

export function getLeaderboard(req, res) {
  // Returns top verified creators
  const leaderboard = [
    {
      rank: 1,
      name: "Alex Rivera",
      handle: "@alexriveratech",
      category: "AI & Full Stack",
      country: "United States",
      subscribers: "890K",
      avgViews: "240K",
      safetyScore: 99,
      startingPrice: 3200,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
    },
    {
      rank: 2,
      name: store.creators[0]?.name || "Kaveen Tech Official",
      handle: store.creators[0]?.handle || "@kaveentech",
      category: store.creators[0]?.category || "Technology & AI",
      country: store.creators[0]?.residence || "Singapore",
      subscribers: store.creators[0]?.youtube?.subscribers || "428K",
      avgViews: "115K",
      safetyScore: 98.4,
      startingPrice: 2400,
      avatar: store.creators[0]?.avatar
    },
    {
      rank: 3,
      name: "Elena Rostova",
      handle: "@elenacodes",
      category: "Cybersecurity & DevOps",
      country: "Germany",
      subscribers: "340K",
      avgViews: "92K",
      safetyScore: 97,
      startingPrice: 1800,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
    }
  ];

  res.json({ success: true, creators: leaderboard });
}
