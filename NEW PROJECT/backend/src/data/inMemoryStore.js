/**
 * In-memory Data Store initialized with verified mock data
 * Designed for immediate local operation and clean mapping to Firestore/MongoDB
 */

export const store = {
  creators: [
    {
      id: "creator_01",
      name: "Kaveen Tech Official",
      handle: "@kaveentech",
      email: "kaveen.tech@gmail.com",
      googleVerified: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      badge: "Top 1% Creator",
      category: "Technology & AI",
      residence: "Singapore",
      modalityPreference: ["online", "hybrid"],
      willingToTravel: true,
      bio: "Full-stack engineer & reviewer covering agentic AI, developer infrastructure, high-performance hardware, and consumer tech. 420K+ technical audience.",
      youtube: {
        channelId: "UC_kaveentech_real_yt_01",
        title: "Kaveen Tech Official",
        subscribers: "428,500",
        avgViews: "115,000",
        totalViews: "18,450,210",
        videoCount: "142",
        engagementRate: "8.6%",
        safetyScore: 98.4
      },
      metrics: {
        totalEarned: 48250,
        escrowLocked: 12450,
        activeContracts: 3,
        completedDeals: 24,
        proposalsSubmitted: 7,
        proposalWinRate: "78%"
      }
    }
  ],

  rateCards: [
    {
      id: "pkg_shorts",
      creatorId: "creator_01",
      type: "shorts",
      title: "YouTube Shorts (60s Vertical)",
      description: "High-retention 9:16 vertical video with motion graphics, sound design, and custom tracking link in pinned comment.",
      price: 850,
      turnaroundDays: 3,
      revisions: 1,
      modality: "online",
      badge: "Fast Turnaround",
      deliverables: [
        "1x 60s 4K 9:16 Vertical Video",
        "Pinned comment with tracking link",
        "Cross-posting to Shorts & Reels",
        "Custom CTA"
      ],
      status: "active"
    },
    {
      id: "pkg_integration",
      creatorId: "creator_01",
      type: "integration",
      title: "Sponsored Mid-Roll Integration (60-90s)",
      description: "Organic product walkthrough inserted during peak retention window of regular technical video.",
      price: 2400,
      turnaroundDays: 7,
      revisions: 2,
      modality: "online",
      badge: "Most Popular",
      deliverables: [
        "60-90s natural talking-point demo",
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
      title: "Dedicated Showcase Video (8-15 Mins)",
      description: "Comprehensive architectural deep dive or benchmark test entirely focused on your product.",
      price: 6500,
      turnaroundDays: 14,
      revisions: 3,
      modality: "hybrid",
      badge: "Maximum Impact",
      deliverables: [
        "10-15 minute cinematic 4K production",
        "Custom A/B tested thumbnail",
        "Script outline review & signoff",
        "Perpetual digital usage license for marketing",
        "YouTube Community post & Discord mention"
      ],
      status: "active"
    }
  ],

  campaigns: [
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
      description: "Looking for verified tech creators to build a full-stack real-time app in 15 minutes showcasing new agentic refactoring features.",
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
      description: "Deep dive into vector search embeddings and real-time multiplayer presence.",
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
      description: "Physical unit shipped directly to creator. Creator will benchmark local LLM token inference speeds.",
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
      description: "Physical presence required in Tokyo, Japan for 3 days. Flight + luxury hotel covered by organizer.",
      deliverableType: "On-site Attendance + 2x Vlogs + 4x Shorts",
      bidsCount: 2
    }
  ],

  proposals: [],

  escrowContracts: [
    {
      id: "esc_101",
      creatorId: "creator_01",
      campaignTitle: "PowerCore 240W GaN Studio Review",
      brand: "Anker Innovations",
      packageType: "Dedicated Full Video",
      amount: 4500,
      platformFee: 450,
      netPayout: 4050,
      status: "DELIVERED",
      currentStepIndex: 2,
      deadline: "Oct 18, 2026",
      deliverableUrl: "https://youtube.com/watch?v=unlisted_mock_anker_preview",
      modality: "online",
      history: [
        { from: null, to: "FUNDED", timestamp: "2026-10-08T10:00:00Z", note: "$4,500 locked in escrow" },
        { from: "FUNDED", to: "IN_PROGRESS", timestamp: "2026-10-10T14:30:00Z", note: "Talking points approved" },
        { from: "IN_PROGRESS", to: "DELIVERED", timestamp: "2026-10-12T16:00:00Z", note: "Unlisted 4K preview uploaded" }
      ]
    },
    {
      id: "esc_102",
      creatorId: "creator_01",
      campaignTitle: "Meshnet & Cyber Threat Defense Integration",
      brand: "Nord Security",
      packageType: "Mid-Roll Integration (90s)",
      amount: 2200,
      platformFee: 220,
      netPayout: 1980,
      status: "IN_PROGRESS",
      currentStepIndex: 1,
      deadline: "Oct 22, 2026",
      deliverableUrl: null,
      modality: "online",
      history: [
        { from: null, to: "FUNDED", timestamp: "2026-10-11T09:00:00Z", note: "$2,200 deposited into vault" },
        { from: "FUNDED", to: "IN_PROGRESS", timestamp: "2026-10-12T11:00:00Z", note: "Script under review" }
      ]
    },
    {
      id: "esc_103",
      creatorId: "creator_01",
      campaignTitle: "Developer Day Keynote & VIP Studio Interview",
      brand: "SingaCloud Infra",
      packageType: "Hybrid Live Event + Video",
      amount: 5750,
      platformFee: 575,
      netPayout: 5175,
      status: "FUNDED",
      currentStepIndex: 0,
      deadline: "Oct 26, 2026",
      deliverableUrl: null,
      modality: "physical",
      history: [
        { from: null, to: "FUNDED", timestamp: "2026-10-13T08:00:00Z", note: "$5,750 deposited in platform escrow" }
      ]
    }
  ],

  aiAudit: {
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
  }
};
