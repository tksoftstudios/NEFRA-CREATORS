/**
 * Complete Seed Data for the NEFRA Platform MVP
 * All financial amounts stored in integer cents (e.g. 85000 = $850.00)
 */

export const INITIAL_CREATORS = [
  {
    id: "creator_01",
    name: "Creator Account",
    handle: "@creator",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: false,
    youtubeConnected: false,
    youtube: null,
    status: "active",
    category: "Education & Science",
    country: "Sri Lanka",
    residence: "Sri Lanka",
    modalityPreference: ["online", "hybrid"],
    willingToTravel: true,
    subscribers: 0,
    subscribersFormatted: "0",
    avgViewsFormatted: "N/A",
    aiScore: 0,
    tags: [],
    startingPriceCents: 85000,
    bio: "",
    recentVideos: [],
    audit: null
  },
  {
    id: "creator_02",
    name: "Amaya Singer",
    handle: "@amayatunes",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Acoustic & Music",
    country: "Sri Lanka",
    residence: "Sri Lanka",
    modalityPreference: ["online"],
    willingToTravel: false, // Cannot travel abroad without visa
    subscribers: 185000,
    subscribersFormatted: "185K",
    avgViewsFormatted: "65K",
    aiScore: 91,
    tags: ["#AcousticSinger", "#Vocalist", "#Songwriting", "#Covers"],
    startingPriceCents: 65000, // $650.00
    bio: "Soulful acoustic vocalist and songwriter creating intimate musical storytelling and travel soundscapes.",
    recentVideos: [
      { id: "v4", title: "Midnight Acoustic Session — Live from Colombo", views: "142K", url: "https://youtube.com/watch?v=mock4" },
      { id: "v5", title: "Original Song: Coastal Memories", views: "88K", url: "https://youtube.com/watch?v=mock5" },
      { id: "v6", title: "Fingerstyle Guitar & Vocal Harmonies", views: "54K", url: "https://youtube.com/watch?v=mock6" }
    ],
    audit: {
      productionQuality: 90,
      hookRetention: 92,
      brandSafety: 100,
      tone: "Soulful, acoustic, emotionally resonant",
      audienceSummary: "18–34 years, music enthusiasts, lifestyle travelers across Asia & Europe"
    }
  },
  {
    id: "creator_03",
    name: "Elena Rostova",
    handle: "@elenacodes",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Technology & AI",
    country: "Germany",
    residence: "Germany",
    modalityPreference: ["online", "hybrid", "physical"],
    willingToTravel: true,
    subscribers: 340000,
    subscribersFormatted: "340K",
    avgViewsFormatted: "92K",
    aiScore: 93,
    tags: ["#DevOps", "#Kubernetes", "#RustLang", "#CloudSecurity"],
    startingPriceCents: 120000, // $1,200.00
    bio: "Cloud native security engineer and backend systems architect.",
    recentVideos: [
      { id: "v7", title: "Zero Trust Architecture in 20 Minutes", views: "110K", url: "https://youtube.com/watch?v=mock7" },
      { id: "v8", title: "Rust for High-Frequency Systems", views: "98K", url: "https://youtube.com/watch?v=mock8" },
      { id: "v9", title: "Kubernetes Cluster Hardening Guide", views: "74K", url: "https://youtube.com/watch?v=mock9" }
    ],
    audit: {
      productionQuality: 94,
      hookRetention: 88,
      brandSafety: 98,
      tone: "Rigorous, technical, educational",
      audienceSummary: "Enterprise engineers, systems architects in EU & US"
    }
  },
  {
    id: "creator_04",
    name: "Pixel Samurai",
    handle: "@samuraigames",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Gaming & Esports",
    country: "Japan",
    residence: "Japan",
    modalityPreference: ["online", "hybrid", "physical"],
    willingToTravel: true,
    subscribers: 620000,
    subscribersFormatted: "620K",
    avgViewsFormatted: "190K",
    aiScore: 92,
    tags: ["#Esports", "#GamingPeripherals", "#Speedrunning", "#ApexLegends"],
    startingPriceCents: 150000, // $1,500.00
    bio: "Pro-tier competitive gamer testing high-refresh monitors and low-latency peripherals.",
    recentVideos: [
      { id: "v10", title: "Testing 540Hz OLED Gaming Monitor", views: "340K", url: "https://youtube.com/watch?v=mock10" },
      { id: "v11", title: "Ranked 1 Apex Legends Playthrough", views: "280K", url: "https://youtube.com/watch?v=mock11" },
      { id: "v12", title: "Sub-40g Mouse Teardown & Review", views: "165K", url: "https://youtube.com/watch?v=mock12" }
    ],
    audit: {
      productionQuality: 96,
      hookRetention: 95,
      brandSafety: 97,
      tone: "Energetic, competitive, benchmark-driven",
      audienceSummary: "16–30 years gamers, hardware enthusiasts across JAPAC & US"
    }
  }
];

export const INITIAL_RATE_CARDS = [
  {
    id: "pkg_shorts",
    creatorId: "creator_01",
    type: "shorts",
    title: "YouTube Shorts (60s Vertical)",
    description: "High-retention 9:16 vertical video with motion graphics, sound design, and custom tracking link in pinned comment.",
    priceCents: 85000, // $850.00
    turnaroundDays: 3,
    revisions: 1,
    modality: "online",
    badge: "Fast Turnaround",
    deliverables: [
      "1x 60s 4K 9:16 Vertical Video",
      "Pinned comment with tracking link",
      "Cross-posting to Shorts & Reels",
      "Custom Call to Action"
    ],
    status: "active"
  },
  {
    id: "pkg_integration",
    creatorId: "creator_01",
    type: "integration",
    title: "Sponsored Mid-Roll Integration (60–90s)",
    description: "Organic product walkthrough inserted during peak audience retention window of regular technical video.",
    priceCents: 240000, // $2,400.00
    turnaroundDays: 7,
    revisions: 2,
    modality: "online",
    badge: "Most Popular",
    deliverables: [
      "60–90s natural talking-point demo",
      "Top 3 lines in description with tracking link",
      "Pinned comment with discount code",
      "60-day YouTube niche exclusivity"
    ],
    status: "active"
  },
  {
    id: "pkg_dedicated",
    creatorId: "creator_01",
    type: "dedicated",
    title: "Dedicated Showcase Video (8–15 Mins)",
    description: "Comprehensive architectural deep dive or benchmark test entirely focused on your product.",
    priceCents: 650000, // $6,500.00
    turnaroundDays: 14,
    revisions: 3,
    modality: "hybrid",
    badge: "Maximum Impact",
    deliverables: [
      "10–15 minute cinematic 4K production",
      "Custom A/B tested thumbnail",
      "Script outline review & signoff",
      "Perpetual digital usage license for marketing",
      "Community tab post & Discord mention"
    ],
    status: "active"
  }
];

export const INITIAL_CAMPAIGNS = [
  {
    id: "camp_01",
    brandOrgId: "brand_acme",
    brandName: "Cursor / Anysphere",
    brandLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
    title: "AI-Assisted Full Stack Build with Modern Tooling",
    category: "Technology & AI",
    modality: "online",
    budgetCents: 350000, // $3,500.00
    escrowGuaranteed: true,
    deadline: "2026-11-25",
    targetCountries: ["US", "UK", "Canada", "Singapore"],
    description: "Looking for verified tech creators to build a full-stack real-time app in 15 minutes showcasing new agentic refactoring features.",
    deliverableType: "Dedicated Video or 90s Integration",
    bidsCount: 3,
    status: "open"
  },
  {
    id: "camp_02",
    brandOrgId: "brand_supa",
    brandName: "Supabase",
    brandLogo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=80&q=80",
    title: "Launch Week Coverage: Realtime Postgres & Vector Search",
    category: "Technology & AI",
    modality: "online",
    budgetCents: 450000, // $4,500.00
    escrowGuaranteed: true,
    deadline: "2026-11-30",
    targetCountries: ["Global", "US", "EU"],
    description: "Deep dive into vector search embeddings and real-time multiplayer presence.",
    deliverableType: "Dedicated Video",
    bidsCount: 5,
    status: "open"
  },
  {
    id: "camp_03",
    brandOrgId: "brand_framework",
    brandName: "Framework Computer",
    brandLogo: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=80&q=80",
    title: "Framework Laptop 16 AI Expansion Bay Hands-on & Teardown",
    category: "Technology & AI",
    modality: "hybrid",
    budgetCents: 750000, // $7,500.00
    escrowGuaranteed: true,
    deadline: "2026-12-05",
    targetCountries: ["US", "Europe", "Singapore"],
    description: "Physical unit shipped directly to creator. Creator will benchmark local LLM token inference speeds.",
    deliverableType: "Dedicated Video + Shorts",
    bidsCount: 2,
    status: "open"
  },
  {
    id: "camp_04",
    brandOrgId: "brand_tokyodev",
    brandName: "Tokyo DevCon",
    brandLogo: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=80&q=80",
    title: "On-site Creator Vlogger & Keynote Panel Host (Tokyo)",
    category: "Technology & AI",
    modality: "physical", // Requires on-site travel
    budgetCents: 950000, // $9,500.00
    escrowGuaranteed: true,
    deadline: "2026-12-15",
    targetCountries: ["Japan (Tokyo)"],
    description: "Physical presence required in Tokyo for 3 days. Flight and accommodation covered. Creator must be able to travel to Japan.",
    deliverableType: "On-site Attendance + 2x Vlogs + 4x Shorts",
    bidsCount: 1,
    status: "open"
  }
];

export const INITIAL_CONTRACTS = [
  {
    id: "cnt_101",
    brandOrgId: "brand_anker",
    brandName: "Anker Innovations",
    creatorId: "creator_01",
    creatorName: "Kaveen Tech Official",
    campaignTitle: "PowerCore 240W GaN Studio Review",
    packageType: "Dedicated Video",
    amountCents: 450000, // $4,500.00
    feePercent: 10,
    platformFeeCents: 45000, // $450.00
    netCreatorCents: 405000, // $4,050.00
    state: "draft_review",
    revisionsLeft: 2,
    deadline: "2026-11-18",
    deliverableUrl: "https://youtube.com/watch?v=unlisted_mock_anker_preview",
    modality: "online",
    milestones: [
      { index: 1, title: "Script & Outline Sign-off", percent: 30, amountCents: 135000, status: "approved" },
      { index: 2, title: "Unlisted Video Draft Review", percent: 50, amountCents: 225000, status: "pending" },
      { index: 3, title: "Final 4K Delivery & Live Upload", percent: 20, amountCents: 90000, status: "pending" }
    ],
    events: [
      { id: "e1", from: "pending_payment", to: "funded", actor: "brand", reason: "$4,500 deposited into escrow vault", timestamp: "2026-10-10T10:00:00Z" },
      { id: "e2", from: "funded", to: "in_production", actor: "creator", reason: "Creator accepted brief and started production", timestamp: "2026-10-12T14:30:00Z" },
      { id: "e3", from: "in_production", to: "draft_review", actor: "creator", reason: "Unlisted 4K draft uploaded for brand sign-off", deliverableUrl: "https://youtube.com/watch?v=unlisted_mock_anker_preview", timestamp: "2026-10-14T16:00:00Z" }
    ]
  },
  {
    id: "cnt_102",
    brandOrgId: "brand_nord",
    brandName: "Nord Security",
    creatorId: "creator_01",
    creatorName: "Kaveen Tech Official",
    campaignTitle: "Meshnet & Cyber Threat Defense Integration",
    packageType: "Mid-Roll Integration",
    amountCents: 220000, // $2,200.00
    feePercent: 10,
    platformFeeCents: 22000,
    netCreatorCents: 198000,
    state: "in_production",
    revisionsLeft: 2,
    deadline: "2026-11-22",
    deliverableUrl: null,
    modality: "online",
    milestones: [
      { index: 1, title: "Talking Points Approval", percent: 30, amountCents: 66000, status: "approved" },
      { index: 2, title: "Draft Insertion", percent: 50, amountCents: 110000, status: "pending" },
      { index: 3, title: "Live Airing", percent: 20, amountCents: 44000, status: "pending" }
    ],
    events: [
      { id: "e4", from: "pending_payment", to: "funded", actor: "brand", reason: "$2,200 pre-funded in escrow", timestamp: "2026-10-11T09:00:00Z" },
      { id: "e5", from: "funded", to: "in_production", actor: "creator", reason: "Script drafting in progress", timestamp: "2026-10-12T11:00:00Z" }
    ]
  },
  {
    id: "cnt_103",
    brandOrgId: "brand_singacloud",
    brandName: "SingaCloud Infra",
    creatorId: "creator_01",
    creatorName: "Kaveen Tech Official",
    campaignTitle: "Developer Day Keynote & VIP Studio Interview",
    packageType: "Hybrid Live Event + Video",
    amountCents: 575000, // $5,750.00
    feePercent: 10,
    platformFeeCents: 57500,
    netCreatorCents: 517500,
    state: "funded",
    revisionsLeft: 2,
    deadline: "2026-11-26",
    deliverableUrl: null,
    modality: "physical",
    milestones: [
      { index: 1, title: "Outline Approval", percent: 30, amountCents: 172500, status: "pending" },
      { index: 2, title: "Keynote Delivery", percent: 50, amountCents: 287500, status: "pending" },
      { index: 3, title: "Edited Interview Upload", percent: 20, amountCents: 115000, status: "pending" }
    ],
    events: [
      { id: "e6", from: "pending_payment", to: "funded", actor: "brand", reason: "$5,750 deposited in platform escrow vault", timestamp: "2026-10-13T08:00:00Z" }
    ]
  }
];

export const INITIAL_PLATFORM_CONFIG = {
  feePercent: 10,
  startingCredits: 50,
  proposalCostCredits: 5,
  minSubscribers: 1000
};

export const INITIAL_AUDIT_LOG = [
  { id: "log_1", admin: "admin@nefra.com", action: "Approved Creator", target: "Kaveen Tech Official", timestamp: "2026-10-09 10:30 AM" },
  { id: "log_2", admin: "admin@nefra.com", action: "Verified Brand", target: "Cursor / Anysphere", timestamp: "2026-10-10 02:15 PM" },
  { id: "log_3", admin: "admin@nefra.com", action: "Updated Platform Fee", target: "Configured 10% standard take rate", timestamp: "2026-10-11 04:00 PM" }
];
