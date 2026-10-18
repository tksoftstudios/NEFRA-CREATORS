/**
 * Rate Card Pricing Engine
 * Computes calibrated sponsorship rate cards derived dynamically from:
 * 1. Social Media Overall Reach (Subscriber count, total view velocity, average views per upload)
 * 2. Vertex AI Creator Score (Retention hooks, pacing, brand safety, audience engagement)
 */

export function calculateDynamicRateCards(creator = {}) {
  const subscribers = Number(creator.subscribers) || Number(creator.youtube?.subscribers) || 0;
  const totalViews = Number(creator.viewCount) || Number(creator.youtube?.viewCount) || 0;
  const videoCount = Number(creator.videoCount) || Number(creator.youtube?.videoCount) || 0;
  const aiScore = Number(creator.aiScore) || Number(creator.audit?.aiScore) || 90;

  // 1. Calculate Estimated Engaged Reach per Upload
  const avgViews = (videoCount > 0 && totalViews > 0) ? Math.round(totalViews / videoCount) : 0;
  
  // Baseline view expectations based on subscriber velocity
  let expectedViews = Math.max(avgViews, Math.round(subscribers * 0.12));
  if (expectedViews < 500) expectedViews = Math.max(500, subscribers * 2);

  // 2. Score Multiplier based on AI Audit (Hook + Pacing + Brand Safety)
  // Base index = 85. Scores above 85 earn a quality multiplier up to +25%.
  const scoreMultiplier = Math.max(0.85, Math.min(1.25, (aiScore / 85)));

  // 3. Category & CPM Modifiers
  // Standard market CPMs: Tech & AI: $35 CPM, Business/Education: $40 CPM, Gaming: $22 CPM, Lifestyle: $25 CPM
  const category = creator.category || 'Education & Science';
  let cpmRate = 35;
  if (category.includes('Education') || category.includes('Business') || category.includes('Finance')) {
    cpmRate = 42;
  } else if (category.includes('Technology') || category.includes('AI')) {
    cpmRate = 38;
  } else if (category.includes('Gaming')) {
    cpmRate = 24;
  } else {
    cpmRate = 30;
  }

  // 4. Calculate Deliverable Package Prices (in integer cents)
  // A. High-Impact Short / Reel (30-45s vertical format)
  const shortsBaseUsd = Math.max(120, Math.round((expectedViews * (cpmRate * 0.45) / 1000) * scoreMultiplier));
  const shortsCents = shortsBaseUsd * 100;

  // B. 60s Native Brand Mid-Roll Integration
  const integrationBaseUsd = Math.max(350, Math.round((expectedViews * (cpmRate * 1.0) / 1000) * scoreMultiplier));
  const integrationCents = integrationBaseUsd * 100;

  // C. Dedicated 4K In-Depth Product Review
  const dedicatedBaseUsd = Math.max(750, Math.round((expectedViews * (cpmRate * 2.2) / 1000) * scoreMultiplier));
  const dedicatedCents = dedicatedBaseUsd * 100;

  // D. 3-Month Strategic Ambassadorship Retainer (2 dedicated + 4 shorts + link in all descriptions)
  const ambassadorBaseUsd = Math.max(2200, Math.round((dedicatedBaseUsd * 2 + shortsBaseUsd * 4) * 0.85)); // 15% bundle incentive
  const ambassadorCents = ambassadorBaseUsd * 100;

  return [
    {
      id: `pkg_int_${Date.now()}`,
      creatorId: creator.id || 'creator_01',
      title: '60s Mid-Roll Brand Integration',
      type: 'integration',
      priceCents: integrationCents,
      turnaroundDays: 7,
      revisions: 2,
      modality: 'online',
      badge: 'Most Popular',
      reachBasis: `${expectedViews.toLocaleString()} estimated views • ${aiScore}/100 AI Score`,
      description: `High-retention 60-second sponsorship segment placed at prime retention window. Calibrated at $${cpmRate} CPM with AI pacing verification.`,
      deliverables: [
        '60s Native Sponsorship Segment within main upload',
        'Pinned comment with branded tracking link for 30 days',
        'Top description placement with UTM parameters',
        '2 rounds of edits prior to release'
      ],
      status: 'active'
    },
    {
      id: `pkg_shorts_${Date.now() + 1}`,
      creatorId: creator.id || 'creator_01',
      title: 'High-Impact YouTube Short / Reel',
      type: 'shorts',
      priceCents: shortsCents,
      turnaroundDays: 4,
      revisions: 1,
      modality: 'online',
      badge: 'Viral Hook',
      reachBasis: `Fast viral distribution • ${aiScore}/100 AI Score`,
      description: `Fast-paced 30-45s vertical video featuring dynamic captions and product hook. Calibrated for vertical algorithmic virality.`,
      deliverables: [
        '30–45s Vertical 9:16 Short/Reel',
        'Dynamic animated text subtitles & sound design',
        'Link sticker in bio & pinned comment'
      ],
      status: 'active'
    },
    {
      id: `pkg_ded_${Date.now() + 2}`,
      creatorId: creator.id || 'creator_01',
      title: 'Dedicated 4K Deep-Dive Review',
      type: 'dedicated',
      priceCents: dedicatedCents,
      turnaroundDays: 14,
      revisions: 3,
      modality: 'online',
      badge: 'Flagship Showcase',
      reachBasis: `Full dedicated video • 100% Share of Voice`,
      description: `Comprehensive 10-15 minute deep-dive review and walkthrough showcasing enterprise features, user workflows, and practical applications.`,
      deliverables: [
        '10-15 minute dedicated 4K production upload',
        'Custom branded thumbnail & SEO title optimization',
        'Advertiser digital ad usage rights (3 months)',
        'Community tab shoutout & pinned announcement'
      ],
      status: 'active'
    },
    {
      id: `pkg_amb_${Date.now() + 3}`,
      creatorId: creator.id || 'creator_01',
      title: '3-Month Strategic Ambassadorship',
      type: 'dedicated',
      priceCents: ambassadorCents,
      turnaroundDays: 90,
      revisions: 4,
      modality: 'hybrid',
      badge: 'Enterprise Tier',
      reachBasis: `Multi-touch ongoing exposure • Highest ROI`,
      description: `Quarterly brand ambassadorship bundle with recurring dedicated videos, monthly shorts, and permanent bio links.`,
      deliverables: [
        '2x Full Dedicated 4K Reviews over 3 months',
        '4x Vertical Shorts highlighting new feature releases',
        'Permanent branded link in all video descriptions',
        'Category exclusivity during partnership term'
      ],
      status: 'active'
    }
  ];
}
