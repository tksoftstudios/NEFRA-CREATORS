export const CURRENT_CREATOR = {
  id: "creator_01",
  name: "Kaveen Tech",
  handle: "@kaveentech",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
  verified: true,
  badge: "Top 1% Creator",
  category: "Technology & AI",
  residence: "Singapore",
  modalityPreference: ["online", "hybrid"], // online, hybrid, physical
  willingToTravel: true,
  passportReady: true,
  bio: "Full-stack developer & tech reviewer covering modern AI agents, developer tooling, high-performance hardware, and consumer tech. 420K+ tech-savvy builders and engineers.",
  youtube: {
    channelId: "UC_kaveentech_official",
    subscribers: "428,500",
    avgViews: "115,000",
    monthlyImpressions: "3,850,000",
    engagementRate: "8.6%",
    safetyScore: 98,
    primaryAudience: "US (42%), UK (18%), DE (12%), JP (9%), Other (19%)"
  },
  metrics: {
    totalEarned: 48250,
    escrowLocked: 12450,
    activeContracts: 3,
    completedDeals: 24,
    proposalsSubmitted: 7,
    proposalWinRate: "78%"
  }
};

export const INITIAL_RATE_CARDS = [
  {
    id: "pkg_shorts",
    type: "shorts",
    title: "YouTube Shorts (60s Vertical)",
    description: "High-retention 9:16 vertical video with animated motion graphics, dynamic sound design, and custom link in pinned comment.",
    price: 850,
    turnaroundDays: 3,
    revisions: 1,
    deliverables: [
      "1x 60s 4K 9:16 Vertical Video",
      "Pinned comment with tracking link",
      "Organic cross-posting to YouTube Shorts & IG Reels",
      "Raw caption file & custom CTA"
    ],
    modality: "online",
    badge: "Fast Turnaround",
    status: "active"
  },
  {
    id: "pkg_integration",
    type: "integration",
    title: "Sponsored Mid-Roll Integration (60-90s)",
    description: "Seamless contextual product integration placed between minutes 2 and 4 of a regular long-form technical video. High viewer retention.",
    price: 2400,
    turnaroundDays: 7,
    revisions: 2,
    deliverables: [
      "60-90s natural talking-point demo",
      "On-screen logo watermark & custom lower-third",
      "Top 3 lines in video description with UTM link",
      "Pinned comment with tracked discount voucher",
      "60-day YouTube exclusivity in niche"
    ],
    modality: "online",
    badge: "Most Popular",
    status: "active"
  },
  {
    id: "pkg_dedicated",
    type: "dedicated",
    title: "Dedicated Showcase Video (8-15 Mins)",
    description: "Complete deep-dive video entirely centered on your software, API, hardware, or AI product. Full architectural walkthrough and honest test.",
    price: 6500,
    turnaroundDays: 14,
    revisions: 3,
    deliverables: [
      "10-15 minute cinematic 4K production",
      "Dedicated custom thumbnail A/B tested with Gemini AI",
      "Script outline review & collaborative approval",
      "Perpetual digital usage license for brand marketing",
      "Dedicated YouTube Community post & Discord mention"
    ],
    modality: "hybrid",
    badge: "Maximum Impact",
    status: "active"
  }
];

export const BRAND_CAMPAIGNS = [
  {
    id: "camp_01",
    brandName: "Cursor / Anysphere",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
    title: "AI-Assisted Full Stack Build with Modern Tooling",
    category: "Developer Tools & AI",
    modality: "online",
    budget: 3500,
    escrowGuaranteed: true,
    deadline: "2026-10-25",
    targetCountries: ["US", "UK", "Canada", "Germany"],
    description: "Looking for verified tech creators to build a full-stack real-time app in 15 minutes showcasing new agentic refactoring features. Creator will highlight developer speedups.",
    deliverableType: "Dedicated Video or 90s Integration",
    bidsCount: 4
  },
  {
    id: "camp_02",
    brandName: "Supabase",
    brandLogo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=80&q=80",
    title: "Launch Week Coverage: Realtime Postgres & Vector Search",
    category: "Cloud Infrastructure",
    modality: "online",
    budget: 4500,
    escrowGuaranteed: true,
    deadline: "2026-10-30",
    targetCountries: ["Global", "US", "EU"],
    description: "Deep dive into vector search embeddings and real-time multiplayer presence. Must have demonstrated background in backend development or AI pipelines.",
    deliverableType: "Dedicated Video",
    bidsCount: 6
  },
  {
    id: "camp_03",
    brandName: "Framework Computer",
    brandLogo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80",
    title: "Framework Laptop 16 AI Expansion Bay Hands-on & Teardown",
    category: "Hardware & Tech",
    modality: "hybrid",
    budget: 7500,
    escrowGuaranteed: true,
    deadline: "2026-11-05",
    targetCountries: ["US", "Europe", "Singapore"],
    description: "Physical unit shipped directly to creator. Creator will benchmark local LLM token inference speeds and test hot-swappable GPU modules.",
    deliverableType: "Dedicated Video + Shorts",
    bidsCount: 3
  },
  {
    id: "camp_04",
    brandName: "Tokyo DevCon / Global Tech Summit",
    brandLogo: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=80&q=80",
    title: "On-site Creator Vlogger & Keynote Panel Host (Tokyo)",
    category: "Event & Keynote",
    modality: "physical",
    budget: 9500,
    escrowGuaranteed: true,
    deadline: "2026-11-15",
    targetCountries: ["Japan (Tokyo)"],
    description: "Physical presence required in Tokyo, Japan for 3 days. Flight + luxury hotel covered by organizer in addition to contract budget. Creator will conduct backstage dev interviews.",
    deliverableType: "On-site Attendance + 2x Vlogs + 4x Shorts",
    bidsCount: 2
  }
];

export const ACTIVE_ESCROW_CONTRACTS = [
  {
    id: "esc_101",
    campaignTitle: "PowerCore 240W GaN Studio Review",
    brand: "Anker Innovations",
    packageType: "Dedicated Full Video",
    amount: 4500,
    platformFee: 450, // 10%
    netPayout: 4050,
    currentStep: 2, // 0: Funded, 1: Script Approved, 2: Draft Review, 3: Revisions, 4: Released
    steps: [
      { title: "Escrow Funded", desc: "$4,500 secured in vault", date: "Oct 08, 2026" },
      { title: "Script Approved", desc: "Talking points signed off", date: "Oct 10, 2026" },
      { title: "Draft Under Review", desc: "Unlisted 4K preview uploaded", date: "Oct 12, 2026" },
      { title: "Client Signoff", desc: "Awaiting final approval", date: "Pending" },
      { title: "Funds Released", desc: "Instant payout to wallet", date: "Pending" }
    ],
    deadline: "Oct 18, 2026",
    deliverableUrl: "https://youtube.com/watch?v=unlisted_mock_anker_preview",
    modality: "online"
  },
  {
    id: "esc_102",
    campaignTitle: "Meshnet & Cyber Threat Defense Integration",
    brand: "Nord Security",
    packageType: "Mid-Roll Integration (90s)",
    amount: 2200,
    platformFee: 220,
    netPayout: 1980,
    currentStep: 1,
    steps: [
      { title: "Escrow Funded", desc: "$2,200 locked", date: "Oct 11, 2026" },
      { title: "Script Outline", desc: "Under review with brand marketing", date: "Oct 12, 2026" },
      { title: "Video Draft", desc: "Due Oct 19, 2026", date: "Pending" },
      { title: "Signoff", desc: "Verification check", date: "Pending" },
      { title: "Released", desc: "Auto release on publish", date: "Pending" }
    ],
    deadline: "Oct 22, 2026",
    deliverableUrl: null,
    modality: "online"
  },
  {
    id: "esc_103",
    campaignTitle: "Developer Day Keynote & VIP Studio Interview",
    brand: "SingaCloud Infra",
    packageType: "Hybrid Live Event + Video",
    amount: 5750,
    platformFee: 575,
    netPayout: 5175,
    currentStep: 0,
    steps: [
      { title: "Escrow Funded", desc: "$5,750 deposited in platform escrow", date: "Oct 13, 2026" },
      { title: "Travel Logistics", desc: "Flight & badge confirmed", date: "Oct 14, 2026" },
      { title: "Event Day", desc: "On-site shoot Marina Bay", date: "Oct 24, 2026" },
      { title: "Post-Production", desc: "48-hr highlight reel", date: "Pending" },
      { title: "Released", desc: "Immediate payout", date: "Pending" }
    ],
    deadline: "Oct 26, 2026",
    deliverableUrl: null,
    modality: "physical"
  }
];

export const AI_CHANNEL_AUDIT = {
  lastUpdated: "2026-10-13 11:30 AM",
  safetyScore: 98.4,
  safetyGrade: "AAA (Enterprise Grade)",
  flags: [
    { type: "success", text: "Zero copyright strikes or Content ID claims detected." },
    { type: "success", text: "100% advertiser-friendly vocabulary; zero demonetized historical uploads." },
    { type: "info", text: "Optimal sponsor retention segment is between minute 2:15 and 3:45." }
  ],
  pricingIntelligence: {
    recommendedShortsRate: "$850 - $1,100",
    recommendedIntegrationRate: "$2,200 - $2,800",
    recommendedDedicatedRate: "$6,200 - $7,400",
    marketDemand: "Very High (+34% YoY in Developer AI / Agents)"
  },
  recentCritiques: [
    {
      videoTitle: "I Built an Autonomous AI Developer in 48 Hours",
      views: "184,200",
      hookScore: 94,
      pacingScore: 91,
      sponsorReadiness: 96,
      critiqueText: "Outstanding retention curve in first 45 seconds. Visual coding demo retained 82% of technical audience through the middle segment. Sponsor insertion at 02:40 achieved 94% retention."
    },
    {
      videoTitle: "The M4 Max MacBook Pro for Machine Learning Engineers",
      views: "248,900",
      hookScore: 96,
      pacingScore: 89,
      sponsorReadiness: 98,
      critiqueText: "High conversion intent from hardware buyers. Excellent benchmark visualization. High click-through rate for affiliate and promo code links."
    }
  ]
};

export const TOP_10_CREATORS = [
  {
    rank: 1,
    name: "Alex Rivera",
    handle: "@alexriveratech",
    category: "AI & Full Stack",
    country: "United States",
    subscribers: "890K",
    avgViews: "240K",
    safetyScore: 99,
    startingPrice: "$3,200",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    specialties: ["Agentic AI", "Next.js", "Python"]
  },
  {
    rank: 2,
    name: "Kaveen Tech",
    handle: "@kaveentech",
    category: "Technology & AI",
    country: "Singapore",
    subscribers: "428K",
    avgViews: "115K",
    safetyScore: 98,
    startingPrice: "$2,400",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    specialties: ["Dev Tools", "Cloud Architecture", "Hardware"]
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
    startingPrice: "$1,800",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80",
    specialties: ["Zero Trust", "Kubernetes", "Rust"]
  },
  {
    rank: 4,
    name: "Kenji Sato",
    handle: "@kenjigadgets",
    category: "Consumer Hardware & Audio",
    country: "Japan",
    subscribers: "610K",
    avgViews: "180K",
    safetyScore: 99,
    startingPrice: "$2,900",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    specialties: ["Mechanical Keyboards", "Audio", "Displays"]
  },
  {
    rank: 5,
    name: "Maya Lin",
    handle: "@mayadesignui",
    category: "Design Systems & UX",
    country: "Canada",
    subscribers: "285K",
    avgViews: "76K",
    safetyScore: 99,
    startingPrice: "$1,500",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    specialties: ["Figma to Code", "Tailwind", "Motion"]
  }
];
