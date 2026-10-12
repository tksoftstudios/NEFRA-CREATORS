/**
 * High-fidelity Seed Creators Dataset for Nefra Platform
 * Realistically represents creators across 6 main categories in JAPAC & Global
 */

export const CATEGORIES = [
  { id: 'tech', name: 'Tech & AI', icon: 'Cpu', color: '#00F0FF' },
  { id: 'music', name: 'Music & Singing', icon: 'Music', color: '#F43F5E' },
  { id: 'education', name: 'Education & Careers', icon: 'GraduationCap', color: '#38BDF8' },
  { id: 'travel', name: 'Travel & Culinary', icon: 'Compass', color: '#F59E0B' },
  { id: 'gaming', name: 'Gaming & Esports', icon: 'Gamepad2', color: '#EC4899' },
  { id: 'lifestyle', name: 'Lifestyle & Fashion', icon: 'Sparkles', color: '#A855F7' },
  { id: 'business', name: 'Business & Finance', icon: 'TrendingUp', color: '#10B981' },
];

export const SEED_CREATORS = [
  // TECH & AI
  {
    id: 'creator-tech-1',
    channelId: 'UCvjgXvBlbQiydffZU7m1_aw',
    handle: '@TheCodingTrain',
    title: 'The Coding Train',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 1680000,
    subscribersFormatted: '1.68M',
    totalViews: '185M',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    subCategory: 'Generative AI & Creative Code',
    nefraScore: 96,
    verified: true,
    country: 'Global / JAPAC',
    tags: ['#CreativeCoding', '#MachineLearning', '#JavaScript', '#GenerativeArt', '#WebDev', '#P5js'],
    aiSummary: 'High-energy coding educator specializing in algorithmic art, generative AI concepts, and interactive JavaScript programming.',
    audience: {
      demographic: '18-34 Developers, CS Students, Creative Coders',
      primaryRegions: ['India', 'Singapore', 'Australia', 'United States'],
      avgEngagementRate: '6.4%'
    },
    recentVideos: [
      {
        id: 'vid-tech-1a',
        title: 'Building a Neural Network from Scratch in JavaScript',
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 days ago',
        views: '142K',
        description: 'In this video, we explore backpropagation and activation functions with an interactive visual canvas.'
      },
      {
        id: 'vid-tech-1b',
        title: 'Gemini 2.0 Multimodal API: Live Visual Experiment',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
        publishedAt: '5 days ago',
        views: '210K',
        description: 'Connecting webcam video frames directly to Google Gemini Flash for real-time physics simulation commentary.'
      },
      {
        id: 'vid-tech-1c',
        title: 'Autonomous Boids & Flocking Simulation with Vector Math',
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '188K',
        description: 'Simulating complex collective bird flocking behavior using Craig Reynolds algorithm in Canvas API.'
      }
    ]
  },
  {
    id: 'creator-tech-2',
    channelId: 'UCW5YeuERMmlnqo4oq8vwUpg',
    handle: '@TechLeadPro',
    title: 'Kavindu Tech Insights',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 420000,
    subscribersFormatted: '420K',
    totalViews: '38M',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    subCategory: 'Cloud Architecture & DevOps',
    nefraScore: 92,
    verified: true,
    country: 'Sri Lanka / Singapore',
    tags: ['#CloudComputing', '#GCP', '#SystemDesign', '#DevOps', '#Kubernetes'],
    aiSummary: 'Architect-level breakdown of distributed systems, cloud migrations, and real-world tech career roadmaps.',
    audience: {
      demographic: '22-40 Software Engineers, Cloud Architects, Tech Leads',
      primaryRegions: ['Sri Lanka', 'India', 'Singapore', 'UK'],
      avgEngagementRate: '5.2%'
    },
    recentVideos: [
      {
        id: 'vid-tech-2a',
        title: 'Google Cloud vs AWS in 2026: Cost & AI Tooling Compared',
        thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80',
        publishedAt: '3 days ago',
        views: '85K',
        description: 'Deep dive into serverless pricing models, Vertex AI vs Bedrock, and cold start latency metrics.'
      },
      {
        id: 'vid-tech-2b',
        title: 'Microservices Anti-Patterns That Will Crash Production',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '124K',
        description: 'Analyzing distributed transaction failures, circular dependencies, and event bus bottlenecks.'
      },
      {
        id: 'vid-tech-2c',
        title: 'How We Deployed 100K Requests/sec on Cloud Run',
        thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '97K',
        description: 'Practical tuning guide for container concurrency, gRPC connections, and memory limits.'
      }
    ]
  },
  {
    id: 'creator-tech-3',
    channelId: 'UC8butISFwT-Wl7EV0hUK0BQ',
    handle: '@FreeCodeHQ',
    title: 'CodeCraft Asia',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 890000,
    subscribersFormatted: '890K',
    totalViews: '92M',
    category: 'tech',
    categoryLabel: 'Tech & AI',
    subCategory: 'Full-Stack React & Next.js',
    nefraScore: 94,
    verified: true,
    country: 'Malaysia / JAPAC',
    tags: ['#FullStack', '#React', '#Nextjs', '#TypeScript', '#Tailwind'],
    aiSummary: 'Hands-on project tutorials building enterprise web and mobile apps with clean architectural patterns.',
    audience: {
      demographic: '18-30 Junior to Mid Full-Stack Developers',
      primaryRegions: ['Malaysia', 'Indonesia', 'Philippines', 'India'],
      avgEngagementRate: '4.8%'
    },
    recentVideos: [
      {
        id: 'vid-tech-3a',
        title: 'Full Stack AI SaaS in 4 Hours with React 19 & Gemini',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
        publishedAt: '4 days ago',
        views: '194K',
        description: 'Building authentication, stripe billing, vector database search, and streaming LLM chat.'
      },
      {
        id: 'vid-tech-3b',
        title: 'Mastering TypeScript Generics with 10 Real Examples',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '110K',
        description: 'Conditional types, infer keyword, mapped types, and type-safe schema validation.'
      },
      {
        id: 'vid-tech-3c',
        title: 'Stop Using Redux: Modern State Management in 2026',
        thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '160K',
        description: 'Comparing Zustand, TanStack Query, and native React Server Actions for real world apps.'
      }
    ]
  },

  // TRAVEL & CULINARY
  {
    id: 'creator-travel-1',
    channelId: 'UCtravel123_wander',
    handle: '@IslandEatsTravel',
    title: 'Ceylon Flavor Trails',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 650000,
    subscribersFormatted: '650K',
    totalViews: '54M',
    category: 'travel',
    categoryLabel: 'Travel & Culinary',
    subCategory: 'Island Culinary & Heritage Recipes',
    nefraScore: 95,
    verified: true,
    country: 'Sri Lanka / Maldives',
    tags: ['#StreetFood', '#IslandTravel', '#CulinaryHeritage', '#SlowFood', '#Backpacking'],
    aiSummary: 'Cinematic sensory documentation of coastal food markets, mountain village recipes, and hidden tropical travel gems.',
    audience: { demographic: '20-45 Foodies, Backpackers, Cultural Travelers', primaryRegions: ['Sri Lanka', 'Australia', 'UK', 'Singapore'], avgEngagementRate: '7.8%' },
    recentVideos: [
      {
        id: 'vid-tr-1a',
        title: 'Midnight Seafood Feast in Galle Fort Market',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 days ago',
        views: '180K',
        description: 'Tasting black pepper mud crab, fresh roti, and clay-pot fish curry with local fishermen.'
      },
      {
        id: 'vid-tr-1b',
        title: 'Hidden High-Altitude Tea Estates of Ella',
        thumbnail: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=400&auto=format&fit=crop&q=80',
        publishedAt: '6 days ago',
        views: '240K',
        description: 'Trekking through misty ridge tea plantations and learning the artisanal hand-rolling tea secret.'
      },
      {
        id: 'vid-tr-1c',
        title: '$15 Island Hop: Surviving 48 Hours in Jaffna on Street Snacks',
        thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '310K',
        description: 'Exploring traditional Jaffna sweets, mutton rolls, and spicy vadai on a shoestring budget.'
      }
    ]
  },
  {
    id: 'creator-travel-2',
    channelId: 'UCtokyo_bites',
    handle: '@BKKStreetScout',
    title: 'Bangkok Night Bites',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 1120000,
    subscribersFormatted: '1.12M',
    totalViews: '110M',
    category: 'travel',
    categoryLabel: 'Travel & Culinary',
    subCategory: 'Night Markets & Street Food',
    nefraScore: 97,
    verified: true,
    country: 'Thailand / JAPAC',
    tags: ['#NightMarkets', '#ThaiFood', '#StreetVendors', '#WokHei', '#FoodVlog'],
    aiSummary: 'Ultra-high-definition nocturnal food walk-throughs capturing street vendor mastery and hidden alleyway stalls.',
    audience: { demographic: '18-40 Global Foodies, Travelers', primaryRegions: ['Thailand', 'Singapore', 'USA', 'Japan'], avgEngagementRate: '8.2%' },
    recentVideos: [
      {
        id: 'vid-tr-2a',
        title: 'The Legendary 50-Year Soup Master in Chinatown',
        thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 day ago',
        views: '420K',
        description: 'Behind the counter of a multi-generational broth cauldron bubbling constantly since 1974.'
      },
      {
        id: 'vid-tr-2b',
        title: 'Eating Everything at Chatuchak Weekend Market Under $20',
        thumbnail: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&auto=format&fit=crop&q=80',
        publishedAt: '5 days ago',
        views: '510K',
        description: 'Crispy pork belly, mango sticky rice, grilled skewers, and giant coconut ice cream.'
      },
      {
        id: 'vid-tr-2c',
        title: 'Secret Floating Market Far Away from Tourists',
        thumbnail: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&auto=format&fit=crop&q=80',
        publishedAt: '10 days ago',
        views: '380K',
        description: 'Taking a longtail wooden boat down rural canals to meet grandmother noodle vendors.'
      }
    ]
  },

  // EDUCATION & CAREERS
  {
    id: 'creator-edu-1',
    channelId: 'UCcareer_compass',
    handle: '@CareerLaunchpad',
    title: 'Ananya Sharma Careers',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 780000,
    subscribersFormatted: '780K',
    totalViews: '64M',
    category: 'education',
    categoryLabel: 'Education & Careers',
    subCategory: 'Tech Career & Resume Coaching',
    nefraScore: 93,
    verified: true,
    country: 'India / JAPAC',
    tags: ['#ResumeMastery', '#TechInterviews', '#StudyAbroad', '#ProductManagement', '#Productivity'],
    aiSummary: 'Empowering young graduates and mid-career professionals with practical interview playbooks and salary negotiation strategies.',
    audience: { demographic: '19-32 University Students, Tech Job Seekers', primaryRegions: ['India', 'Singapore', 'UAE', 'Canada'], avgEngagementRate: '6.9%' },
    recentVideos: [
      {
        id: 'vid-ed-1a',
        title: 'How I Passed the Google Product Manager Interview in 2026',
        thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80',
        publishedAt: '3 days ago',
        views: '230K',
        description: 'System design questions, metric definition frameworks, and behavioral questions.'
      },
      {
        id: 'vid-ed-1b',
        title: 'The Only Resume Template You Need (ATS Friendly)',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '410K',
        description: 'Live teardown of 5 real resumes that landed $120k+ remote tech roles.'
      },
      {
        id: 'vid-ed-1c',
        title: '5 AI Tools Every College Student Must Use to Save 15 Hours/Week',
        thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '350K',
        description: 'Automating literature reviews, LaTeX formatting, and smart flashcard generation.'
      }
    ]
  },

  // GAMING & ESPORTS
  {
    id: 'creator-game-1',
    channelId: 'UCgaming_nexus',
    handle: '@NexusStriker',
    title: 'Nexus Striker Gaming',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 1450000,
    subscribersFormatted: '1.45M',
    totalViews: '160M',
    category: 'gaming',
    categoryLabel: 'Gaming & Esports',
    subCategory: 'Esports Tactical Guides & Meta',
    nefraScore: 94,
    verified: true,
    country: 'Philippines / JAPAC',
    tags: ['#Valorant', '#MobileLegends', '#EsportsGuides', '#GamingRigs', '#CompetitiveMeta'],
    aiSummary: 'Fast-paced tactical esports commentary, meta tier-lists, and competitive gaming hardware benchmark reviews.',
    audience: { demographic: '16-28 Esports Enthusiasts & Gamers', primaryRegions: ['Philippines', 'Indonesia', 'Malaysia', 'Vietnam'], avgEngagementRate: '8.5%' },
    recentVideos: [
      {
        id: 'vid-gm-1a',
        title: 'NEW Controller Meta Will Break Competitive Valorant',
        thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 day ago',
        views: '290K',
        description: 'In-depth breakdown of patch 10.2 changes and line-up executions.'
      },
      {
        id: 'vid-gm-1b',
        title: 'Testing the 540Hz OLED Gaming Monitor: Is It Worth $1200?',
        thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop&q=80',
        publishedAt: '5 days ago',
        views: '340K',
        description: 'Motion clarity tests, input lag osciloscope measurements, and competitive impressions.'
      },
      {
        id: 'vid-gm-1c',
        title: 'I Competed in the SEA Regional Tournament (Behind The Scenes)',
        thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '480K',
        description: 'Vlog from the arena stage, team comms breakdown, and clutch moments.'
      }
    ]
  },

  // BUSINESS & FINANCE
  {
    id: 'creator-biz-1',
    channelId: 'UCfin_wealth',
    handle: '@MacroFinAdvisor',
    title: 'FinEdge Insights',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 520000,
    subscribersFormatted: '520K',
    totalViews: '42M',
    category: 'business',
    categoryLabel: 'Business & Finance',
    subCategory: 'Macroeconomics & Wealth Strategy',
    nefraScore: 91,
    verified: true,
    country: 'Singapore / JAPAC',
    tags: ['#IndexFunds', '#FinTech', '#MacroEconomics', '#RealEstate', '#Startups'],
    aiSummary: 'Analytical breakdown of regional Asian markets, private equity trends, personal portfolio asset allocation, and fintech innovations.',
    audience: { demographic: '25-45 Investors, Founders, Working Professionals', primaryRegions: ['Singapore', 'Hong Kong', 'Australia', 'Malaysia'], avgEngagementRate: '5.6%' },
    recentVideos: [
      {
        id: 'vid-bz-1a',
        title: 'Why Global Tech Capitals Are Moving to Singapore & Tokyo',
        thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 days ago',
        views: '115K',
        description: 'Tax incentives, talent migrations, and venture capital flows in 2026.'
      },
      {
        id: 'vid-bz-1b',
        title: 'How to Build an All-Weather Portfolio with Just 3 ETFs',
        thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop&q=80',
        publishedAt: '6 days ago',
        views: '220K',
        description: 'Global equity, bond hedges, and commodity allocations backtested over 40 years.'
      },
      {
        id: 'vid-bz-1c',
        title: 'The AI Bubble vs Dot-Com: What the Data Actually Shows',
        thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&auto=format&fit=crop&q=80',
        publishedAt: '12 days ago',
        views: '180K',
        description: 'Comparing revenue multiples, CAPEX spending, and free cash flows across mega-caps.'
      }
    ]
  },

  // LIFESTYLE & FASHION
  {
    id: 'creator-life-1',
    channelId: 'UClife_minimal',
    handle: '@TaraAesthetic',
    title: 'Tara Living',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 810000,
    subscribersFormatted: '810K',
    totalViews: '72M',
    category: 'lifestyle',
    categoryLabel: 'Lifestyle & Fashion',
    subCategory: 'Minimalist Living & Slow Aesthetics',
    nefraScore: 93,
    verified: true,
    country: 'Sri Lanka / Dubai',
    tags: ['#SustainableFashion', '#MinimalistHome', '#WellnessVlog', '#SkincareRoutine', '#MorningRituals'],
    aiSummary: 'Calm, high-aesthetic cinematography focusing on slow living, capsule wardrobe styling, and clean beauty practices.',
    audience: { demographic: '20-38 Women & Young Professionals', primaryRegions: ['Sri Lanka', 'UAE', 'UK', 'Australia'], avgEngagementRate: '7.4%' },
    recentVideos: [
      {
        id: 'vid-lf-1a',
        title: 'My 15-Piece Tropical Capsule Wardrobe for All Seasons',
        thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 days ago',
        views: '165K',
        description: 'Breathable linen staples, ethical local tailoring, and versatile neutral layering.'
      },
      {
        id: 'vid-lf-1b',
        title: 'Resetting My Living Space for Mental Clarity (Studio Tour)',
        thumbnail: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '280K',
        description: 'Warm lighting principles, decluttering systems, and artisanal terracotta accents.'
      },
      {
        id: 'vid-lf-1c',
        title: '5 Habits That Changed My Energy in 30 Days',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '210K',
        description: 'Morning sunlight exposure, herbal infusions, digital sunsets, and grounding.'
      }
    ]
  },

  // MUSIC & SINGING
  {
    id: 'creator-music-1',
    channelId: 'UCvocal_serenade',
    handle: '@AriaVocalAcoustic',
    title: 'Aria Jayawardena Music',
    avatar: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 920000,
    subscribersFormatted: '920K',
    totalViews: '88M',
    category: 'music',
    categoryLabel: 'Music & Singing',
    subCategory: 'Acoustic Singer-Songwriter & Vocals',
    nefraScore: 97,
    verified: true,
    country: 'Sri Lanka / JAPAC',
    tags: ['#Vocalist', '#SingerSongwriter', '#AcousticCovers', '#OriginalMusic', '#LiveStudio', '#SoulfulVocals'],
    aiSummary: 'Virtuosic singer-songwriter known for resonant live acoustic sessions, emotional vocal control, and bilingual indie folk compositions.',
    audience: { demographic: '16-35 Music Lovers, Indie Fans, Young Professionals', primaryRegions: ['Sri Lanka', 'India', 'UK', 'Australia'], avgEngagementRate: '9.1%' },
    recentVideos: [
      {
        id: 'vid-mu-1a',
        title: 'Original Song: "Midnight Rain" (Live Acoustic Studio Session)',
        thumbnail: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 days ago',
        views: '340K',
        description: 'Live one-take vocal and fingerstyle guitar performance captured with vintage tube microphones in Colombo.'
      },
      {
        id: 'vid-mu-1b',
        title: 'Bilingual Soul Cover: "Somewhere Only We Know" (Acoustic)',
        thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '620K',
        description: 'Melodic cover blending English lyrics with traditional Sinhala melodic ornamentation and grand piano.'
      },
      {
        id: 'vid-mu-1c',
        title: 'Behind the Vocals: My Vocal Warmup Routine & Studio Mic Setup',
        thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '190K',
        description: 'Diaphragmatic breathing exercises, resonance drills, and comparing Shure SM7B vs Neumann U87 for live singing.'
      }
    ],
    videoReviews: [
      {
        videoIndex: 1,
        title: 'Original Song: "Midnight Rain" (Live Acoustic Studio Session)',
        format: 'Live Solo Vocal Performance',
        aiFeedback: 'Exceptional breath control and emotional range in the upper register. Intimate live room acoustics create high audience intimacy and repeat listening retention.',
        brandOpportunity: 'High-end audio gear, studio microphones, acoustic instruments, music streaming endorsements.'
      },
      {
        videoIndex: 2,
        title: 'Bilingual Soul Cover: "Somewhere Only We Know" (Acoustic)',
        format: 'Bilingual Cross-Cultural Cover',
        aiFeedback: 'Superb cross-cultural crossover arrangement. The melodic ornamentation demonstrates high technical vocal agility and drove 620K organic views.',
        brandOpportunity: 'Lifestyle brands, live concert festivals, beverage and fashion integrations.'
      },
      {
        videoIndex: 3,
        title: 'Behind the Vocals: My Vocal Warmup Routine & Studio Mic Setup',
        format: 'Creator Breakdown / Educational',
        aiFeedback: 'Shows authority beyond just singing; articulates technical audio production and vocal health clearly, establishing deep creator credibility.',
        brandOpportunity: 'Audio interfaces, vocal health supplements, music education software.'
      }
    ]
  },
  {
    id: 'creator-music-2',
    channelId: 'UCindie_strum',
    handle: '@LiamEchoes',
    title: 'Liam Vance Acoustic',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    subscriberCount: 460000,
    subscribersFormatted: '460K',
    totalViews: '41M',
    category: 'music',
    categoryLabel: 'Music & Singing',
    subCategory: 'Indie Folk & Live Acoustic Looping',
    nefraScore: 93,
    verified: true,
    country: 'Australia / Singapore',
    tags: ['#IndieFolk', '#AcousticGuitar', '#Vocalist', '#Songwriting', '#LiveLooping'],
    aiSummary: 'Intimate indie folk singer and multi-instrumentalist performing live looping, fingerpicking ballads, and heartfelt lyricism.',
    audience: { demographic: '18-40 Folk, Indie Rock, and Acoustic Enthusiasts', primaryRegions: ['Australia', 'Singapore', 'USA', 'NZ'], avgEngagementRate: '7.6%' },
    recentVideos: [
      {
        id: 'vid-mu-2a',
        title: 'Live Looping "Golden Hour" on Ocean Pier (Vocals + Guitar)',
        thumbnail: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400&auto=format&fit=crop&q=80',
        publishedAt: '3 days ago',
        views: '280K',
        description: 'Building harmonies and percussive beats on guitar live as the sun sets over the ocean.'
      },
      {
        id: 'vid-mu-2b',
        title: 'Writing a Song in 1 Hour from Fan Comments',
        thumbnail: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&auto=format&fit=crop&q=80',
        publishedAt: '1 week ago',
        views: '310K',
        description: 'Challenging myself to compose chords, melody, and lyrics in 60 minutes inspired by top YouTube comments.'
      },
      {
        id: 'vid-mu-2c',
        title: 'Folk Song: "Take Me to the Hills" (Official Studio Track)',
        thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80',
        publishedAt: '2 weeks ago',
        views: '195K',
        description: 'Warm analog tape mix of my latest folk ballad featuring cello and harmonium.'
      }
    ],
    videoReviews: [
      {
        videoIndex: 1,
        title: 'Live Looping "Golden Hour" on Ocean Pier (Vocals + Guitar)',
        format: 'Outdoor Ambient Live Performance',
        aiFeedback: 'Strong visual aesthetic combined with flawless live pedal looping. Warm vocal timbre fits acoustic and nature-inspired brand campaigns.',
        brandOpportunity: 'Travel apparel, portable audio recorders, guitar pedal manufacturers.'
      },
      {
        videoIndex: 2,
        title: 'Writing a Song in 1 Hour from Fan Comments',
        format: 'Interactive Community Co-Creation',
        aiFeedback: 'High audience engagement mechanic with 2,400+ comments. Demonstrates rapid musical improvisation and strong rapport with subscribers.',
        brandOpportunity: 'SaaS creative apps, headphones, digital music distribution platforms.'
      },
      {
        videoIndex: 3,
        title: 'Folk Song: "Take Me to the Hills" (Official Studio Track)',
        format: 'Studio Masterpiece / Official Audio',
        aiFeedback: 'Rich instrumentation with organic folk textures. Strong potential for soundtrack sync licensing and brand commercial spots.',
        brandOpportunity: 'Film production, streaming playlists, travel tourism boards.'
      }
    ]
  }
];
