/**
 * Seed Brand Campaigns Dataset for Nefra Opportunities Marketplace
 */

export const SEED_CAMPAIGNS = [
  {
    id: 'camp-music-1',
    title: 'Acoustic Soundtracks for JAPAC Eco-Resort Film',
    brandName: 'Aura Retreats & Hospitality',
    brandLogo: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=100&auto=format&fit=crop&q=80',
    targetCategory: 'music',
    targetCategoryLabel: 'Music & Singing',
    budget: 2400,
    budgetFormatted: '$2,400 USD',
    deliverable: 'Dedicated Video & Original Track',
    deliverableType: 'dedicated_video',
    timeline: '3 Weeks',
    verifiedBrand: true,
    description: 'We are seeking an authentic acoustic singer-songwriter to compose and perform an acoustic soundtrack piece for our brand launch across Southeast Asia and Sri Lanka.',
    targetPersona: 'Eco-conscious travelers, acoustic music fans, aged 22-38',
    requiredTags: ['#AcousticCover', '#OriginalMusic', '#Vocals', '#SingerSongwriter'],
    requirements: [
      '1 Dedicated performance video incorporating our resort backdrop or visual assets',
      'Original arrangement or license rights for promotional use',
      'Links & pinned comment in video description'
    ],
    compatibilityFactors: {
      categoryWeight: 0.5,
      engagementBonus: 10,
      tagsMatchBonus: 15
    },
    status: 'active',
    createdAt: '2026-03-28'
  },
  {
    id: 'camp-tech-1',
    title: 'Hands-on Developer Walkthrough of Cloud AI Studio',
    brandName: 'DevStack Cloud Systems',
    brandLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    targetCategory: 'tech',
    targetCategoryLabel: 'Tech & AI',
    budget: 3200,
    budgetFormatted: '$3,200 USD',
    deliverable: '1 Dedicated Video (10-14 mins) + 2 Shorts',
    deliverableType: 'dedicated_video',
    timeline: '2 Weeks',
    verifiedBrand: true,
    description: 'Looking for an experienced technical educator or coder to demonstrate building a production AI agent using modern cloud APIs. Must feature actual terminal coding and clean architecture.',
    targetPersona: 'Full-stack engineers, AI developers, CS students in JAPAC',
    requiredTags: ['#MachineLearning', '#WebDev', '#GenerativeAI', '#Python', '#JavaScript'],
    requirements: [
      '10-14 minute deep dive tutorial showing real code implementation',
      '2 YouTube Shorts breaking down the core architectural highlights',
      'GitHub repository link with sample starter files'
    ],
    status: 'active',
    createdAt: '2026-03-30'
  },
  {
    id: 'camp-travel-1',
    title: 'Boutique Culinary & Coastal Culture Series',
    brandName: 'Ceylon Horizon Tourism',
    brandLogo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&auto=format&fit=crop&q=80',
    targetCategory: 'travel',
    targetCategoryLabel: 'Travel & Culinary',
    budget: 1800,
    budgetFormatted: '$1,800 USD',
    deliverable: '1 Travel Vlog Integration (3-5 min segment)',
    deliverableType: 'integration',
    timeline: '4 Weeks',
    verifiedBrand: true,
    description: 'Seeking a travel and culinary storytelling creator to explore boutique heritage spots in South Asia, spotlighting local spices and farm-to-table coastal dining.',
    targetPersona: 'Food enthusiasts, slow travel nomads, aged 25-45',
    requiredTags: ['#TravelVlog', '#FoodStorytelling', '#StreetFood', '#Culture'],
    requirements: [
      'Mid-roll organic integration inside an authentic travel episode',
      'Instagram story cross-promotion on launch day',
      'Honest culinary review and cultural storytelling'
    ],
    status: 'active',
    createdAt: '2026-04-01'
  },
  {
    id: 'camp-gaming-1',
    title: 'Low-Latency Wireless Pro Gear Tournament Showcase',
    brandName: 'ViperStrike Esports Gear',
    brandLogo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&auto=format&fit=crop&q=80',
    targetCategory: 'gaming',
    targetCategoryLabel: 'Gaming & Esports',
    budget: 1500,
    budgetFormatted: '$1,500 USD',
    deliverable: '3 YouTube Shorts & Gameplay Segment',
    deliverableType: 'shorts',
    timeline: '10 Days',
    verifiedBrand: true,
    description: 'Competitive FPS or battle royale gamer needed to stress-test our ultra-lightweight 8000Hz gaming mouse during live ranked matches.',
    targetPersona: 'Competitive gamers, FPS enthusiasts, gear nerds aged 16-30',
    requiredTags: ['#GamingHighlights', '#Esports', '#FPS', '#GearReview'],
    requirements: [
      '3 high-octane YouTube Shorts showing flick shots & handcam',
      'Integration in standard ranked montage video',
      'Custom discount code link in pinned comment'
    ],
    status: 'active',
    createdAt: '2026-04-02'
  },
  {
    id: 'camp-edu-1',
    title: 'AI Resume & Mock Interview Tool Review for Grads',
    brandName: 'Pathfinder Career AI',
    brandLogo: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&auto=format&fit=crop&q=80',
    targetCategory: 'education',
    targetCategoryLabel: 'Education & Careers',
    budget: 2000,
    budgetFormatted: '$2,000 USD',
    deliverable: 'Dedicated Video & Community Post',
    deliverableType: 'dedicated_video',
    timeline: '2 Weeks',
    verifiedBrand: true,
    description: 'We help new university graduates ace technical and behavioral interviews. Looking for a trusted career educator to run a genuine live test of our AI mock interview coach.',
    targetPersona: 'College students, job seekers, career switchers',
    requiredTags: ['#CareerAdvice', '#TechInterviews', '#StudyWithMe', '#EdTech'],
    requirements: [
      'Dedicated 8-10 minute review walking through mock interview simulation',
      'Community tab post sharing student discount vouchers',
      'Honest feedback on resume scoring accuracy'
    ],
    status: 'active',
    createdAt: '2026-04-04'
  }
];
