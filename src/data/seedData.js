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
  },
  {
    id: "creator_05",
    name: "Marcus Vance",
    handle: "@marcustech",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Technology & AI",
    country: "United States",
    residence: "United States",
    modalityPreference: ["online", "hybrid"],
    willingToTravel: true,
    subscribers: 580000,
    subscribersFormatted: "580K",
    avgViewsFormatted: "145K",
    aiScore: 96,
    tags: ["#ArtificialIntelligence", "#AutonomousAgents", "#Nextjs", "#LLMs"],
    startingPriceCents: 180000,
    bio: "AI researcher and full-stack software engineer unpacking autonomous agent architectures and production LLMs.",
    recentVideos: [
      { id: "v13", title: "Building Autonomous Agents with Local LLMs", views: "240K", url: "https://youtube.com/watch?v=mock13" },
      { id: "v14", title: "Next.js 15 Full Architecture Breakdown", views: "195K", url: "https://youtube.com/watch?v=mock14" }
    ],
    audit: { productionQuality: 97, hookRetention: 96, brandSafety: 99, tone: "High-authority, articulate, hands-on", audienceSummary: "Senior developers, technical founders & AI researchers in US & EU" }
  },
  {
    id: "creator_06",
    name: "Devina Patel",
    handle: "@devina_ai",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Technology & AI",
    country: "India",
    residence: "India",
    modalityPreference: ["online"],
    willingToTravel: false,
    subscribers: 290000,
    subscribersFormatted: "290K",
    avgViewsFormatted: "85K",
    aiScore: 94,
    tags: ["#Python", "#DataScience", "#MLOps", "#ComputerVision"],
    startingPriceCents: 110000,
    bio: "Machine learning engineer building production vision models and practical data pipelines.",
    recentVideos: [
      { id: "v15", title: "PyTorch 2.5 Real-Time Object Tracking", views: "115K", url: "https://youtube.com/watch?v=mock15" }
    ],
    audit: { productionQuality: 93, hookRetention: 92, brandSafety: 100, tone: "Instructive, pedagogical, crystal clear", audienceSummary: "Data scientists, university students, and software engineers" }
  },
  {
    id: "creator_07",
    name: "Robarosia Venture Labs",
    handle: "@robarosia",
    avatar: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Education & Science",
    country: "Sri Lanka",
    residence: "Sri Lanka",
    modalityPreference: ["online", "hybrid"],
    willingToTravel: true,
    subscribers: 450000,
    subscribersFormatted: "450K",
    avgViewsFormatted: "135K",
    aiScore: 96,
    tags: ["#Entrepreneurship", "#StartupIncubation", "#Leadership", "#BusinessStrategy"],
    startingPriceCents: 125000,
    bio: "Flagship entrepreneurship and startup accelerator platform mentoring emerging founders.",
    recentVideos: [
      { id: "v16", title: "From Seed to Series A: The Founder Playbook", views: "185K", url: "https://youtube.com/watch?v=mock16" }
    ],
    audit: { productionQuality: 96, hookRetention: 94, brandSafety: 100, tone: "Strategic, inspirational, founder-centric", audienceSummary: "22-45 founders, business leaders, and investors across South Asia & diaspora" }
  },
  {
    id: "creator_08",
    name: "Dr. Aris Thorne",
    handle: "@dr_thorne_sci",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Education & Science",
    country: "United Kingdom",
    residence: "United Kingdom",
    modalityPreference: ["online", "hybrid", "physical"],
    willingToTravel: true,
    subscribers: 610000,
    subscribersFormatted: "610K",
    avgViewsFormatted: "195K",
    aiScore: 97,
    tags: ["#Astrophysics", "#QuantumPhysics", "#ScienceDocumentary", "#Cosmology"],
    startingPriceCents: 190000,
    bio: "Theoretical physicist producing cinematic documentaries on quantum mechanics and astrophysics.",
    recentVideos: [
      { id: "v17", title: "The Geometry of Spacetime Explained", views: "340K", url: "https://youtube.com/watch?v=mock17" }
    ],
    audit: { productionQuality: 98, hookRetention: 97, brandSafety: 100, tone: "Cinematic, profound, intellectually rigorous", audienceSummary: "Global learners, educators, STEM professionals" }
  },
  {
    id: "creator_09",
    name: "Sarah Lin",
    handle: "@sarahfounder",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Education & Science",
    country: "Singapore",
    residence: "Singapore",
    modalityPreference: ["online", "hybrid"],
    willingToTravel: true,
    subscribers: 320000,
    subscribersFormatted: "320K",
    avgViewsFormatted: "88K",
    aiScore: 93,
    tags: ["#ProductManagement", "#UXStrategy", "#TechLeadership", "#GrowthHacking"],
    startingPriceCents: 95000,
    bio: "Ex-Google Product Director sharing growth frameworks and user retention strategies.",
    recentVideos: [
      { id: "v18", title: "How High-Growth Startups Structure PM Teams", views: "92K", url: "https://youtube.com/watch?v=mock18" }
    ],
    audit: { productionQuality: 94, hookRetention: 91, brandSafety: 100, tone: "Pragmatic, framework-driven, executive", audienceSummary: "Product managers, designers, growth leads in APAC & US" }
  },
  {
    id: "creator_10",
    name: "Nova Strike",
    handle: "@novastrike",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Gaming & Esports",
    country: "United States",
    residence: "United States",
    modalityPreference: ["online", "physical"],
    willingToTravel: true,
    subscribers: 890000,
    subscribersFormatted: "890K",
    avgViewsFormatted: "280K",
    aiScore: 95,
    tags: ["#Valorant", "#EsportsTournaments", "#FPSGaming", "#TwitchHighlights"],
    startingPriceCents: 220000,
    bio: "Championship FPS competitor and gaming hardware stress tester.",
    recentVideos: [
      { id: "v19", title: "Radiant Ranked 1v5 Clutch Compilation", views: "410K", url: "https://youtube.com/watch?v=mock19" }
    ],
    audit: { productionQuality: 95, hookRetention: 96, brandSafety: 96, tone: "High-adrenaline, humorous, elite competitive", audienceSummary: "16-28 gamers, PC hardware buyers in North America" }
  },
  {
    id: "creator_11",
    name: "Kaelen Vance",
    handle: "@kaelengames",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Gaming & Esports",
    country: "Canada",
    residence: "Canada",
    modalityPreference: ["online"],
    willingToTravel: false,
    subscribers: 410000,
    subscribersFormatted: "410K",
    avgViewsFormatted: "120K",
    aiScore: 91,
    tags: ["#SimRacing", "#FlightSimulator", "#VRGaming", "#HardwareRigs"],
    startingPriceCents: 115000,
    bio: "Immersive VR and simulation racing creator testing direct-drive wheels and motion rigs.",
    recentVideos: [
      { id: "v20", title: "Custom Hydraulic Sim Rig Tour & Nurburgring Lap", views: "165K", url: "https://youtube.com/watch?v=mock20" }
    ],
    audit: { productionQuality: 93, hookRetention: 90, brandSafety: 98, tone: "Detail-oriented, enthusiast, immersive", audienceSummary: "Simulation enthusiasts, automotive fans, VR hardware builders" }
  },
  {
    id: "creator_12",
    name: "Julian Strings",
    handle: "@julianacoustic",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Acoustic & Music",
    country: "Australia",
    residence: "Australia",
    modalityPreference: ["online", "hybrid", "physical"],
    willingToTravel: true,
    subscribers: 420000,
    subscribersFormatted: "420K",
    avgViewsFormatted: "130K",
    aiScore: 95,
    tags: ["#FingerstyleGuitar", "#AcousticArrangements", "#CustomGuitars", "#StudioMastering"],
    startingPriceCents: 135000,
    bio: "Virtuoso acoustic guitarist arranging cinematic soundtracks and testing boutique luthier guitars.",
    recentVideos: [
      { id: "v21", title: "Interstellar Theme — Solo Fingerstyle Guitar", views: "380K", url: "https://youtube.com/watch?v=mock21" }
    ],
    audit: { productionQuality: 96, hookRetention: 94, brandSafety: 100, tone: "Audiophile-grade, serene, masterclass", audienceSummary: "Audiophiles, guitarists, film score enthusiasts in AU, US, UK" }
  },
  {
    id: "creator_13",
    name: "Chloe Harmon",
    handle: "@chloevocals",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Acoustic & Music",
    country: "United Kingdom",
    residence: "United Kingdom",
    modalityPreference: ["online"],
    willingToTravel: false,
    subscribers: 260000,
    subscribersFormatted: "260K",
    avgViewsFormatted: "80K",
    aiScore: 93,
    tags: ["#VocalHarmonies", "#Acapella", "#VocalCoaching", "#SongProduction"],
    startingPriceCents: 80000,
    bio: "Studio session vocalist and harmony arranger dissecting vocal production techniques.",
    recentVideos: [
      { id: "v22", title: "Building a 16-Part Vocal Harmony Choir in Logic Pro", views: "110K", url: "https://youtube.com/watch?v=mock22" }
    ],
    audit: { productionQuality: 94, hookRetention: 92, brandSafety: 100, tone: "Harmonic, warm, encouraging", audienceSummary: "Singers, music producers, creative students across Europe" }
  },
  {
    id: "creator_14",
    name: "Victor Vance",
    handle: "@victorfinance",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Finance & Web3",
    country: "United States",
    residence: "United States",
    modalityPreference: ["online", "hybrid"],
    willingToTravel: true,
    subscribers: 510000,
    subscribersFormatted: "510K",
    avgViewsFormatted: "140K",
    aiScore: 94,
    tags: ["#ValueInvesting", "#MacroEconomics", "#IndexFunds", "#PersonalFinance"],
    startingPriceCents: 160000,
    bio: "Chartered Financial Analyst providing no-hype macroeconomic analyses and long-term portfolio strategies.",
    recentVideos: [
      { id: "v23", title: "Federal Reserve Interest Rate Forecast & Asset Allocation", views: "190K", url: "https://youtube.com/watch?v=mock23" }
    ],
    audit: { productionQuality: 95, hookRetention: 93, brandSafety: 99, tone: "Measured, objective, data-backed", audienceSummary: "25-50 investors, business professionals, wealth builders in US & Canada" }
  },
  {
    id: "creator_15",
    name: "Aisha Khan",
    handle: "@aishacrypto",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Finance & Web3",
    country: "United Arab Emirates",
    residence: "United Arab Emirates",
    modalityPreference: ["online", "hybrid", "physical"],
    willingToTravel: true,
    subscribers: 380000,
    subscribersFormatted: "380K",
    avgViewsFormatted: "105K",
    aiScore: 92,
    tags: ["#DeFiProtocols", "#Web3Infrastructure", "#Layer2Rollups", "#SmartContracts"],
    startingPriceCents: 120000,
    bio: "Web3 systems researcher covering decentralised infrastructure and layer-2 scaling solutions.",
    recentVideos: [
      { id: "v24", title: "Zero Knowledge Rollups Technical Architecture", views: "140K", url: "https://youtube.com/watch?v=mock24" }
    ],
    audit: { productionQuality: 93, hookRetention: 91, brandSafety: 97, tone: "Analytical, technical, forward-looking", audienceSummary: "Web3 developers, blockchain protocol engineers, tech investors in MEA & EU" }
  },
  {
    id: "creator_16",
    name: "Liam O'Connor",
    handle: "@liammarkets",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Finance & Web3",
    country: "Ireland",
    residence: "Ireland",
    modalityPreference: ["online"],
    willingToTravel: false,
    subscribers: 295000,
    subscribersFormatted: "295K",
    avgViewsFormatted: "78K",
    aiScore: 91,
    tags: ["#Fintech", "#ETFs", "#DividendGrowth", "#TaxOptimization"],
    startingPriceCents: 95000,
    bio: "Fintech analyst breaking down automated investing tools and global equity dividends.",
    recentVideos: [
      { id: "v25", title: "Building a Defensive Dividend Portfolio for 2026", views: "98K", url: "https://youtube.com/watch?v=mock25" }
    ],
    audit: { productionQuality: 92, hookRetention: 89, brandSafety: 99, tone: "Clear, sober, educational", audienceSummary: "European retail investors, finance enthusiasts" }
  },
  {
    id: "creator_17",
    name: "Maya Visuals",
    handle: "@mayadesign",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Design & Creative",
    country: "France",
    residence: "France",
    modalityPreference: ["online", "hybrid", "physical"],
    willingToTravel: true,
    subscribers: 370000,
    subscribersFormatted: "370K",
    avgViewsFormatted: "110K",
    aiScore: 96,
    tags: ["#DesignSystems", "#FigmaTutorials", "#MotionDesign", "#DesignTokens"],
    startingPriceCents: 115000,
    bio: "Lead product designer demonstrating design systems, micro-interactions, and visual typography.",
    recentVideos: [
      { id: "v26", title: "Design Systems in 2026: Variables & Multi-Brand Themes", views: "155K", url: "https://youtube.com/watch?v=mock26" }
    ],
    audit: { productionQuality: 98, hookRetention: 95, brandSafety: 100, tone: "Aesthetic, inspiring, masterclass", audienceSummary: "Product designers, creative directors, frontend engineers worldwide" }
  },
  {
    id: "creator_18",
    name: "Kenji Sato",
    handle: "@kenjianimates",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Design & Creative",
    country: "Japan",
    residence: "Japan",
    modalityPreference: ["online"],
    willingToTravel: false,
    subscribers: 520000,
    subscribersFormatted: "520K",
    avgViewsFormatted: "165K",
    aiScore: 94,
    tags: ["#Blender3D", "#AnimationCurves", "#StylizedVFX", "#Shaders"],
    startingPriceCents: 170000,
    bio: "3D animator and Blender artist showcasing stylized shader development and character rigging.",
    recentVideos: [
      { id: "v27", title: "Real-Time Anime Shading in Blender 4.2", views: "260K", url: "https://youtube.com/watch?v=mock27" }
    ],
    audit: { productionQuality: 97, hookRetention: 93, brandSafety: 100, tone: "Visual feast, tutorial-packed, cinematic", audienceSummary: "3D animators, game artists, VFX creators across Asia & US" }
  },
  {
    id: "creator_19",
    name: "Sophia Rae",
    handle: "@sophiacreates",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    verified: true,
    status: "active",
    category: "Design & Creative",
    country: "United States",
    residence: "United States",
    modalityPreference: ["online", "hybrid"],
    willingToTravel: true,
    subscribers: 240000,
    subscribersFormatted: "240K",
    avgViewsFormatted: "75K",
    aiScore: 92,
    tags: ["#BrandIdentity", "#Typography", "#PackagingDesign", "#Illustrator"],
    startingPriceCents: 75000,
    bio: "Brand designer crafting visual identities and sustainable packaging for DTC startups.",
    recentVideos: [
      { id: "v28", title: "Rebranding a Luxury Coffee Startup in 48 Hours", views: "92K", url: "https://youtube.com/watch?v=mock28" }
    ],
    audit: { productionQuality: 94, hookRetention: 91, brandSafety: 100, tone: "Chic, polished, commercial", audienceSummary: "Brand strategists, agency designers, DTC founders" }
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

export const INITIAL_BIDS = [
  {
    id: "bid_seed_1",
    campaignId: "camp_01",
    creatorId: "creator_03",
    creatorName: "Elena Rostova",
    creatorHandle: "@elenacodes",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    creatorAiScore: 93,
    creatorCategory: "Technology & AI",
    amountCents: 350000,
    turnaroundDays: 6,
    pitch: "I will live-code a full-stack real-time collaborative workspace from scratch in 15 minutes, highlighting Cursor's agentic refactoring and multi-file reasoning capabilities.\n\nCreative Angle: 'Building a production Slack alternative with AI in 15 minutes'.\n\nDelivery Commitment: 4K unlisted review draft in 6 business days with 2 revision cycles.",
    status: "pending_brand_review",
    submittedAt: "2026-10-16T14:30:00Z"
  },
  {
    id: "bid_seed_2",
    campaignId: "camp_01",
    creatorId: "creator_05",
    creatorName: "Priya Sharma",
    creatorHandle: "@priyatech",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorAiScore: 94,
    creatorCategory: "Technology & AI",
    amountCents: 320000,
    turnaroundDays: 5,
    pitch: "I'll demonstrate how our engineering team replaced 4 separate legacy plugins with this agentic workflow, cutting debug cycle time by 60%.\n\nCreative Angle: Benchmark comparison on complex legacy microservice repos.\n\nDelivery Commitment: 5 days turnaround, pinned discount link, and dual-format YouTube Shorts companion.",
    status: "pending_brand_review",
    submittedAt: "2026-10-17T09:15:00Z"
  },
  {
    id: "bid_seed_3",
    campaignId: "camp_02",
    creatorId: "creator_03",
    creatorName: "Elena Rostova",
    creatorHandle: "@elenacodes",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    creatorAiScore: 93,
    creatorCategory: "Technology & AI",
    amountCents: 450000,
    turnaroundDays: 7,
    pitch: "Comprehensive architectural deep dive on Supabase Vector & Realtime Postgres. Benchmarking pgvector query latency against standalone vector databases.\n\nDelivery Commitment: 4K production video + GitHub companion repo with 1-click deploy.",
    status: "pending_brand_review",
    submittedAt: "2026-10-17T11:00:00Z"
  }
];

export const INITIAL_CONVERSATIONS = [
  {
    id: "conv_elena_cursor",
    creatorId: "creator_03",
    creatorName: "Elena Rostova",
    creatorHandle: "@elenacodes",
    creatorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80",
    creatorCategory: "Technology & AI",
    creatorAiScore: 93,
    brandOrgId: "brand_acme",
    brandName: "Cursor / Anysphere",
    brandAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
    campaignId: "camp_01",
    campaignTitle: "AI-Assisted Full Stack Build with Modern Tooling",
    gigTitle: "Dedicated 4K Technical Architecture Review + 2x Shorts",
    unreadForBrand: 1,
    unreadForCreator: 0,
    lastActivity: "2026-10-18T09:30:00Z",
    messages: [
      {
        id: "msg_1",
        senderRole: "brand",
        senderName: "Cursor / Anysphere",
        text: "Hi Elena! We reviewed your YouTube channel telemetry and loved your recent Zero Trust Architecture video. We would love to partner with you for our launch of agentic multi-file refactoring.",
        timestamp: "Yesterday, 02:15 PM"
      },
      {
        id: "msg_2",
        senderRole: "creator",
        senderName: "Elena Rostova",
        text: "Hey Cursor team! Thanks for reaching out. I've actually been using your editor for my daily Rust and TypeScript workflows. I'd love to showcase a real-time collaborative workspace build using the new features.",
        timestamp: "Yesterday, 02:40 PM"
      },
      {
        id: "msg_3",
        senderRole: "creator",
        senderName: "Elena Rostova",
        type: "custom_offer",
        offer: {
          id: "offer_101",
          title: "Dedicated 4K Technical Deep Dive + 2x High-Velocity Shorts",
          deliverables: [
            "1x 12-minute 4K deep-dive tutorial with companion GitHub repo",
            "2x YouTube Shorts highlighting agentic refactor workflow",
            "Permanent unlisted preview with 2 revision cycles"
          ],
          priceCents: 120000,
          turnaroundDays: 6,
          status: "pending"
        },
        text: "I've structured a custom gig package tailored for your developer acquisition target. You can review the deliverables and lock the pre-funded escrow below:",
        timestamp: "Yesterday, 03:00 PM"
      }
    ]
  },
  {
    id: "conv_marcus_supa",
    creatorId: "creator_01",
    creatorName: "Marcus Vance",
    creatorHandle: "@marcustech",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    creatorCategory: "Technology & AI",
    creatorAiScore: 89,
    brandOrgId: "brand_supa",
    brandName: "Supabase",
    brandAvatar: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=80&q=80",
    campaignId: "camp_02",
    campaignTitle: "Launch Week Coverage: Realtime Postgres & Vector Search",
    gigTitle: "Dedicated Hands-on Vector Teardown",
    unreadForBrand: 0,
    unreadForCreator: 0,
    lastActivity: "2026-10-18T08:15:00Z",
    messages: [
      {
        id: "msg_m1",
        senderRole: "brand",
        senderName: "Supabase",
        text: "Hi Marcus, are you open to covering our new pgvector benchmark in your DevOps weekly roundup?",
        timestamp: "Today, 08:00 AM"
      },
      {
        id: "msg_m2",
        senderRole: "creator",
        senderName: "Marcus Vance",
        text: "Yes, definitely! I can run local benchmark tests against standalone vector DBs and demonstrate the hybrid search query speeds. Shall I submit a custom package?",
        timestamp: "Today, 08:15 AM"
      }
    ]
  },
  {
    id: "conv_priya_acme",
    creatorId: "creator_05",
    creatorName: "Priya Sharma",
    creatorHandle: "@priyatech",
    creatorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    creatorCategory: "Technology & AI",
    creatorAiScore: 94,
    brandOrgId: "brand_acme",
    brandName: "Acme Enterprise Corp",
    brandAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&q=80",
    campaignId: "camp_01",
    campaignTitle: "AI-Assisted Full Stack Build with Modern Tooling",
    gigTitle: "Production Benchmark Breakdown",
    unreadForBrand: 0,
    unreadForCreator: 1,
    lastActivity: "2026-10-17T18:00:00Z",
    messages: [
      {
        id: "msg_p1",
        senderRole: "creator",
        senderName: "Priya Sharma",
        text: "Hi Acme team! I submitted a proposal for your full-stack developer showcase. We can integrate your tool into our real microservice testbed.",
        timestamp: "Oct 17, 05:30 PM"
      },
      {
        id: "msg_p2",
        senderRole: "brand",
        senderName: "Acme Enterprise Corp",
        text: "We received your proposal Priya! The 5-day turnaround looks great. Could you confirm if we can get 4K ProRes deliverables?",
        timestamp: "Oct 17, 06:00 PM"
      }
    ]
  }
];


