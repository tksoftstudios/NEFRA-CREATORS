# NEFRA CREATORS — Complete Frontend Features Specification & Architecture Blueprint
> **Document Status:** Complete & Production-Ready  
> **Platform Version:** 2.0 (Global Startup Architecture)  
> **Target Audience:** Frontend Engineers, UI/UX Designers, Product Architects, and Hackathon/VC Reviewers  

---

## 1. Executive Overview & System Architecture

### 1.1 Platform Vision
**Nefra** is an AI-powered Creator Intelligence, Direct Booking, and Milestone Escrow Marketplace connecting verified YouTube content creators with global brands and enterprise clients. It solves two critical bottlenecks in the $250B creator economy:
1. **The Vetting & Discoverability Crisis:** Replaces predatory, slow talent agencies with multimodal Google Gemini AI that watches videos, audits authenticity, extracts niche tags, and calculates contextual campaign compatibility.
2. **The Payment & Delivery Trust Deficit:** Implements an automated Upwork/Fiverr hybrid model with **100% pre-funded Escrow Vaults**, fixed-deliverable Rate Cards, and AI proposal drafting.

### 1.2 The 3-Sided Marketplace Topology
The frontend operates on a dual-persona client with a centralized administrative backoffice:

```
                                  ┌────────────────────────────────┐
                                  │      NEFRA FRONTEND ROOT       │
                                  └───────────────┬────────────────┘
                                                  │
         ┌────────────────────────────────────────┼────────────────────────────────────────┐
         │                                        │                                        │
         ▼                                        ▼                                        ▼
┌──────────────────┐                     ┌──────────────────┐                     ┌──────────────────┐
│  CREATOR HUB     │                     │  BRAND PORTAL    │                     │  ADMIN / ESCROW  │
│  (Talent/Seller) │  ◄── Mode Switch ──►│  (Client/Buyer)  │                     │  BACKOFFICE      │
├──────────────────┤                     ├──────────────────┤                     ├──────────────────┤
│• Channel Verify  │                     │• AI Job Builder  │                     │• GMV & Take Rate │
│• 3-Video Audit   │                     │• Creator Match   │                     │• Escrow Controls │
│• Rate Card Gigs  │                     │• NefraSense Chat │                     │• Dispute Center  │
│• Opportunities   │                     │• Deal Pipeline   │                     │• Channel Approvals
│• Escrow Tracker  │                     │• Direct Hire     │                     │• Platform Config │
└────────┬─────────┘                     └────────┬─────────┘                     └──────────────────┘
         │                                        │
         └───────────────────┬────────────────────┘
                             │
                             ▼
              ┌─────────────────────────────┐
              │  PUBLIC DISCOVERY DIRECTORY │
              │  • Top 10 Category Leader   │
              │  • Creator Rate Cards       │
              │  • 3-Video AI Scorecards    │
              └─────────────────────────────┘
```

---

## 2. Design System, Theming & Aesthetic Standards

The frontend must evoke a **premium, futuristic, developer-grade aesthetic** combining the density of Linear/Raycast with the trustworthiness of modern fintech (Stripe/Mercury).

### 2.1 Color Palette & Design Tokens
```css
/* Core Base Layers */
--bg-void: #030712;         /* Pitch black root canvas */
--bg-card: #0b0f19;         /* Elevated container background */
--bg-card-hover: #111827;   /* Interactive card hover */
--border-subtle: rgba(255, 255, 255, 0.08);
--border-focus: rgba(99, 102, 241, 0.4);

/* Persona Color Accents */
--creator-primary: #6366f1; /* Indigo (Creator / Selling Mode) */
--creator-glow: rgba(99, 102, 241, 0.25);
--brand-primary: #10b981;   /* Emerald (Brand / Buying Mode) */
--brand-glow: rgba(16, 185, 129, 0.25);
--admin-primary: #f59e0b;   /* Amber / Gold (Platform & Escrow) */

/* Functional Accents */
--accent-cyan: #00f0ff;     /* AI Telemetry & Verification */
--accent-purple: #a855f7;   /* Gemini Multimodal Indicator */
--danger: #ef4444;          /* Dispute / Cancellation */
--warning: #f59e0b;         /* Action Required */
--success: #10b981;         /* Escrow Funded / Milestone Approved */
```

### 2.2 Typography & Iconography
- **Primary Font:** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace Font (for Currency, IDs & Metrics):** `'JetBrains Mono', 'Fira Code', monospace`
- **Component System:** **Ant Design 5.x (Dark Algorithm)** customized with tailored tokens.
- **Icons:** `@ant-design/icons` and `lucide-react` with uniform 18px–20px sizing and matching accent duotones.

---

## 3. Global Header & Dual-Persona Switcher

The top navigation bar is persistent across all routes and controls the platform's execution context.

### 3.1 Header Elements & Layout
1. **Brand Identity:**
   - Interactive Logo: Glowing neon icon + "NEFRA CREATORS" text with a subtitle badge (`Platform v2.0`).
   - Clicking returns to the active portal's default view.
2. **Mode Switcher (Fiverr-Style Dual Persona):**
   - **Seller Mode (Creator):** Displays Indigo theme accents, credit wallet counter, and talent management tabs.
   - **Buyer Mode (Brand):** Displays Emerald theme accents, active campaign count, and client management tabs.
   - Smooth animated pill transition toggle (`Switch to Buying` / `Switch to Selling`).
3. **Contextual Navigation Tabs:**
   - **When in Creator Mode:**
     - `Dashboard` (Overview & Telemetry)
     - `Rate Cards` (Custom Gig Packages)
     - `Opportunities` (Live Brand Campaign Board)
     - `Escrow Vault` (Active Deliverable Tracker)
     - `AI Audit` (3-Video Multimodal Diagnostics)
     - `Directory` (Global Top 10 Leaderboard)
   - **When in Brand Mode:**
     - `Campaign Workspace` (AI Job Builder & Pipeline)
     - `Creator Directory` (Talent Search & Direct Hiring)
     - `NefraSense AI` (Strategic Decision Advisor)
     - `Escrow Deposits` (Brand Fund Management)
4. **Header Utilities:**
   - **Creator Credit Badge:** Interactive badge showing current balance (e.g. `🪙 50 Credits`) with instant `+ Refill` click action.
   - **Settings / API Config Trigger:** Gear icon opening modal for Gemini API Key and Google Client ID.
   - **Judge / Sandbox Demo Button:** 1-click preset selector allowing immediate testing without manual login.
   - **User Profile Pill:** Verified YouTube channel badge or Brand avatar with dropdown menu.

---

## 4. Detailed Feature Specifications by Module

---

### Module 1: Universal Public Discovery & Top 10 Directory
*The public storefront showcasing top vetted YouTube talent across verified niches.*

#### 1.1 Category Selector Bar
- **Categories Supported:**
  - 💻 `Tech & AI`
  - 🎵 `Acoustic & Music`
  - 🎮 `Gaming & Esports`
  - ✈️ `Travel & Culinary`
  - 🎓 `Education & Career`
  - 🌿 `Fitness & Lifestyle`
  - 🤖 `Dynamic AI Categories` (Auto-created when newly audited creators enter unique niches, e.g. `#CloudDevOps` or `#SaaSGrowth`).
- Sticky horizontal category bar with active neon underglow and creator count tags.

#### 1.2 Creator Ranking Cards
Each card displays:
- **Rank Badge:** Gold (#1), Silver (#2), Bronze (#3), or Slate pill (#4–#10).
- **Verified Creator Avatar & Handle:** Live YouTube profile picture with YouTube red icon and verified checkmark.
- **Subscriber Count & Velocity:** Formatted count (e.g. `428.5K Subs`) pulled directly from verified OAuth.
- **Nefra AI Creator Score:** Radial or badge score (0–100) computed by Gemini based on production quality, engagement retention, and cadence.
- **Niche Tags:** 3–5 interactive tags (e.g. `#M4MacBook`, `#Vocalist`, `#AcousticCovers`).
- **Work Modality & Country Badges:**
  - `🌐 Online Only` | `📦 Hybrid` | `✈️ Physical On-Site`
  - Residence flag/name (e.g. 🇸🇬 Singapore, 🇱🇰 Sri Lanka, 🇺🇸 United States).
- **Rate Card Starting Price:** e.g. `From $850 / deliverable`.

#### 1.3 Interactive 3-Video AI Audit Modal
Clicking any creator opens the comprehensive deep-dive modal:
- **Embedded Video Previews:** Cards for the 3 analyzed YouTube uploads with unlisted/public playback.
- **Gemini Multimodal Telemetry Breakdown:**
  - Production Quality Index (0–100)
  - Audience Engagement & Hook Retention Rating (0–100)
  - Brand Safety & Content Neutrality Score (0–100)
  - Tone & Aesthetic Profile (e.g., "Warm, conversational, high-detail technical breakdown").
  - Target Demographic Inferences (Age distribution, primary geography, technical proficiency).
- **Package Selection & Direct Order Action:** Tabs displaying the creator's configured Rate Cards with instant "Hire via Escrow" button.

---

### Module 2: Creator Onboarding & YouTube Verification Wizard
*A frictionless 5-step wizard turning visitors into fully verified, escrow-ready creators.*

#### 2.1 Step 1: Real YouTube OAuth 2.0 Connection
- **Google Sign-In with OAuth Scope:** `https://www.googleapis.com/auth/youtube.readonly`
- **Zero-Friction Fallback (Sandbox Mode):** Pre-configured one-click demo personas (e.g. "Kaveen Tech - Tech & AI", "Amaya Tunes - Acoustic Music") for instant testing without personal YouTube accounts.
- **Telemetry Pull:** Live fetch from `youtube/v3/channels` querying channel title, custom handle, profile photo, verified subscriber count, and upload playlist.

#### 2.2 Step 2: Channel Profile & Modality Configuration
- **Channel Categorization Confirmation:** Primary category selection with AI suggested niche.
- **Base Country of Residence:** Dropdown of 150+ countries.
- **Work Modality Support:** Multi-select checkboxes:
  - `🌐 Online Deliverable` (Digital file upload, remote edit)
  - `📦 Hybrid Deliverable` (Physical hardware shipped to creator, remote video shoot)
  - `✈️ Physical On-Site Shoot` (Creator travels to event, store, or studio)
- **Travel & Visa Status:** Toggle switch (`Willing to travel internationally / Has active travel visas`).

#### 2.3 Step 3: Rate Card Package Setup (Fiverr Model)
Creators configure initial pricing for standardized deliverables:
- **YouTube Shorts (Vertical 60s):** Input for price ($USD) and turnaround days (default: $850 / 3 days).
- **Dedicated In-Video Integration (60s mid-roll):** Price & turnaround (default: $2,400 / 7 days).
- **Full Dedicated Feature Video:** Price & turnaround (default: $6,500 / 14 days).

#### 2.4 Step 4: Escrow & Payout Setup
- Payout provider selector (Stripe Connect, Bank Wire, Wise).
- Platform Fee Agreement: Transparent disclosure of 10–15% take-rate upon successful milestone payout release.

#### 2.5 Step 5: Activation & Reward
- Celebratory confetti explosion.
- **Welcome Bonus:** `+50 Nefra Credits` deposited into the creator's wallet.
- Direct redirection to the active Creator Dashboard.

---

### Module 3: Creator Hub — Rate Card & Digital Gig Packages
*The seller-side package builder allowing creators to sell fixed-scope deliverables without haggling.*

#### 3.1 Rate Card Grid & Package Cards
- Displays all published packages with live status pills (`Active`, `Draft`, `Paused`).
- **Deliverables Breakdown:** Bulleted checklist of what's included (e.g., "Includes 4K 60fps render", "Includes raw B-roll assets", "Includes 2 rounds of script revisions").
- **Turnaround & Revision Badges:** Clear tags displaying delivery SLA (e.g. `⏱️ 7 Days Delivery`, `🔄 2 Revisions Included`).
- **Platform Take-Rate Preview:** Real-time breakdown showing:
  - Gross Brand Price: `$2,400`
  - Platform Escrow Fee (10%): `-$240`
  - Creator Net Payout: `+$2,160` (Guaranteed in Escrow upon approval).

#### 3.2 Add / Edit Package Modal
- Form fields with real-time validation:
  - Package Title (e.g., "Premium 60s Mid-Roll Integration")
  - Deliverable Format Type (`Shorts`, `Mid-Roll Integration`, `Dedicated Video`, `Community Post`, `Raw UGC Footage`)
  - Price in USD (`InputNumber` with min $50)
  - Turnaround Time (Days)
  - Included Revisions Count
  - Work Modality (`online`, `hybrid`, `physical`)
  - Deliverable Checklist (Multi-line text area auto-split into checkable milestones).

---

### Module 4: Creator Hub — Brand Opportunities & Custom Bidding
*The marketplace job board where creators discover brand briefs and pitch custom offers (Upwork model).*

#### 4.1 Filterable Opportunities Feed
- **Modality Filter Bar:** Quick filter buttons (`All`, `🌐 Online`, `📦 Hybrid`, `✈️ Physical`).
- **Category & Budget Filter:** Sliders for budget ranges ($500 – $10,000+).
- **Job Card Previews:**
  - Brand Logo & Company Name (with `Escrow Guaranteed` shield).
  - Campaign Title & Category Tag.
  - Deliverable Type Tag.
  - Fixed Campaign Budget (e.g. `$2,500 Escrow Locked`).
  - Target Countries Allowed (e.g. `Target: US, UK, JAPAC`).
  - **Dynamic Match Compatibility Score:** Real-time percentage badge (e.g. `96% Match`) showing how well this creator's profile aligns with the brand's specifications.

#### 4.2 Custom Bidding Modal
When a creator chooses to bid on a campaign:
- **Campaign Recap:** Displays brand brief, required deliverable, and budget cap.
- **Custom Bid Amount:** Creator can bid at, above, or below the brand's estimated budget.
- **Custom Turnaround Time:** Estimated delivery date.
- **Milestone Payment Breakdown:**
  - Milestone 1: Script & Outline Approval (30%)
  - Milestone 2: Draft Video Review (50%)
  - Milestone 3: Final 4K Delivery & Live Upload (20%)
- **AI Proposal Integration:** Button to auto-generate a tailored pitch.

---

### Module 5: Creator Hub — AI Pitch & Proposal Generator
*Generative AI assistant crafting high-converting, personalized brand proposals in seconds.*

#### 5.1 Mechanics & Generation Pipeline
1. Creator clicks `"Draft with Nefra AI"` inside any job card.
2. System deducts **5 Credits** from the creator's wallet.
3. Gemini Flash is invoked with:
   - Creator's verified telemetry (sub count, audience tone, verified video topics).
   - Brand's campaign requirements, target demographics, and required deliverables.
4. Gemini generates a structured 3-part proposal:
   - **Hook:** Why the creator's audience specifically loves this product category.
   - **Creative Angle:** Concrete concept idea for the video (e.g., "A 45-second live benchmarking test comparing your developer tool against legacy workflows").
   - **Call-to-Action & Deliverable Commitment:** Strict adherence to turnaround and brand guidelines.

#### 5.2 Interactive Proposal Editor
- Creator can edit the markdown proposal directly inside a rich text area.
- One-click insertion of verified channel stats badge.
- Instant submission to the Brand's Campaign Pipeline.

---

### Module 6: Creator Hub — AI 3-Video Multimodal Audit & Channel Diagnostics
*Deep-dive analytics powered by Google Gemini multimodal video comprehension.*

#### 6.1 Diagnostic Metrics Panel
- **Production Quality Rating (0–100):** Lighting, resolution, audio clarity, and pacing analysis.
- **Audience Hook Retention Score (0–100):** Evaluation of first-30-second engagement and viewer retention signals.
- **Brand Safety & Compliance Score (0–100):** Detection of profanity, controversial claims, or copyright flags.
- **Tone & Persona Fingerprint:** Multi-tag radar (e.g., `Authoritative`, `Humorous`, `Cinematic`, `Fast-Paced`).
- **Channel Growth Recommendations:** 3 actionable tips generated by Gemini to improve sponsorship conversion.

#### 6.2 Video Critique Carousel
- Slide-by-slide inspection of the 3 latest uploads analyzed.
- Specific strengths and improvements noted by Gemini for each individual video.
- "Re-Analyze Channel" button to refresh audit when new videos are published.

---

### Module 7: Creator Hub — Credit Wallet & Economy
*The gamified economic engine governing platform usage and spam prevention.*

#### 7.1 Wallet Balance Card
- Displays current usable credits with glowing metallic styling.
- Visual breakdown:
  - Base Starting Allowance: `50 Credits`
  - Cost per Proposal Submission: `-5 Credits`
  - Daily Login Demo Refill: `+15 Credits`
- **Instant Demo Refill Trigger:** One-click button triggering confetti and resetting balance for seamless testing during reviews.

#### 7.2 Transaction Ledger Table
- Chronological table showing:
  - Date & Timestamp
  - Activity Type (`Campaign Application`, `Daily Demo Bonus`, `Profile Audit Refresh`)
  - Amount (`+15`, `-5`)
  - Running Balance
  - Linked Campaign Reference.

---

### Module 8: Brand Portal — AI Natural Language Campaign Job Builder
*Transforms unstructured business ideas into rigorous, agency-grade Campaign Job Cards.*

#### 8.1 Prompt Input & 1-Click Inspirations
- Natural language text area: *"Looking for 2 tech creators to do an in-depth review of our developer AI tool, budget $2,500, targeting young developers in JAPAC."*
- **1-Click Sample Prompts:** Pre-seeded prompts across Tech, Music, Travel, Gaming, and Education.

#### 8.2 Structured Job Card Generation
Gemini Flash parses the prompt and generates:
- **Campaign Title:** Polished, professional title.
- **Primary Category:** Categorical taxonomy assignment.
- **Target Audience Persona:** Demographics, tech stack, or interests.
- **Deliverables Required:** e.g. `1x Dedicated Video (8-12 min) + 2x YouTube Shorts`.
- **Target Budget ($USD):** Extracted budget amount.
- **Turnaround SLA:** Target deadline.
- **Key Message / Call to Action:** Specific tracking link or discount code requirements.

#### 8.3 Work Modality & Regional Whitelisting Controls
Brands configure explicit constraints:
- **Modality Selector:**
  - `🌐 Online Only` (Global remote digital file delivery)
  - `📦 Hybrid` (Physical hardware shipped to creator, remote shoot)
  - `✈️ Physical On-Site` (Requires creator presence at studio/location)
- **Target Countries Selector:** Multi-select country tagger (e.g. `US`, `UK`, `Singapore`, `Global`).
- **Physical Requirements Alert:** If physical on-site is selected, mandatory field for shoot city and travel/visa policy.

---

### Module 9: Brand Portal — Multimodal Creator Matchmaker & Regional Feasibility Engine
*Semantic matching algorithm ranking verified creators against brand job requirements.*

#### 9.1 Ranking Algorithm & Scoring Display
- Evaluates candidate creators in the category and assigns:
  - **Match Compatibility Score (0–100%):** Weighted combination of category alignment, video style fit, audience demographics, and budget match.
  - **Tactical Match Rationale:** 2-sentence explanation of why this creator is an optimal candidate.
  - **Ranked Match Cards:** Sorted by descending compatibility.

#### 9.2 Regional Feasibility Gatekeeper
- Automatically cross-checks campaign modality against creator location and travel willingness.
- **Ineligibility Warning / Auto-Filter:**
  - If a brand posts a `Physical Shoot in Los Angeles, CA` and a creator resides in Sri Lanka without a US travel visa, the system flags the creator with a `⚠️ Travel Ineligible` tag or filters them out of the primary recommendation list.
  - Prevents impossible logistical matches before contracts are formed.

---

### Module 10: Brand Portal — Interactive "NefraSense" AI Strategic Advisor
*An embedded conversational strategist empowering brands with real-time campaign intelligence.*

#### 10.1 Interactive Strategy Drawer / Chat
- A sleek side drawer or dedicated panel in the Brand Workspace.
- Natural language conversational interface with Gemini:
  - *"How should I allocate my $3,000 budget between a dedicated video vs 3 Shorts?"*
  - *"Compare Creator A and Creator B — who drives higher technical conversion?"*
  - *"Can you write 3 catchy 5-second video hooks tailored to this creator's style?"*

#### 10.2 1-Click Strategy Quick Pills
Preset prompt pills for instant business decisions:
- `⚡ Optimize Campaign ROI`: Recommends budget allocation and deliverable mix.
- `📊 Head-to-Head Comparison`: Side-by-side strengths, audience overlap, and risks.
- `💡 Creative Concept & Hooks`: Generates viral hooks matching the creator's voice.
- `🤝 Deliverable Checklist`: Best-practice contract guidelines and milestone suggestions.

---

### Module 11: Brand Portal — Direct Rate Card Ordering & Deal Pipeline
*End-to-end deal progression from initial proposal to locked contract.*

#### 11.1 Campaign Pipeline Dashboard
- Kanban or categorized table view of all posted campaigns:
  - `Draft` | `Active & Accepting Bids` | `In Review` | `In Escrow Production` | `Completed`
- **Incoming Proposals View:**
  - Review submitted creator bids.
  - Inspect creator's custom price, timeline, and AI pitch.
  - Side-by-side candidate comparison.
  - One-click `"Accept Bid & Fund Escrow"` or `"Decline"`.

#### 11.2 Direct Rate Card Ordering
- Brands browsing the Top 10 Directory can click `"Order Digital Gig"` directly on any creator's Rate Card.
- Direct checkout modal initializing a pre-funded escrow contract with fixed deliverables and timeline.

---

### Module 12: Escrow Vault & Milestone Deliverable Tracker
*Fintech-grade escrow engine providing mutual financial protection for both brands and creators.*

#### 12.1 The 5-Stage Escrow Lifecycle
Every campaign follows a deterministic, state-machine driven progression:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  STAGE 1     │     │  STAGE 2     │     │  STAGE 3     │     │  STAGE 4     │     │  STAGE 5     │
│  Pre-Funded  │ ──► │  In Progress │ ──► │  Draft Review│ ──► │  Approved   │ ──► │  Released    │
│  in Vault    │     │  Production  │     │  & Edits     │     │  by Brand    │     │  to Creator  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

1. **Stage 1: Pre-Funded in Vault:** Brand deposits 100% of agreed funds into Nefra Escrow before creator starts work. Funds are locked.
2. **Stage 2: In Progress Production:** Creator produces the agreed content following the creative brief.
3. **Stage 3: Draft Uploaded & Review:** Creator submits an unlisted YouTube preview link or draft video file via the portal. Brand is notified.
4. **Stage 4: Approved / Revisions:** Brand reviews the submission. Brand can request revision (if included in Rate Card) or approve.
5. **Stage 5: Funds Released:** Upon approval, platform automatically deducts take-rate (10–15%) and credits net payout to Creator Wallet.

#### 12.2 Deliverable Upload Modal
- Input for unlisted YouTube video URL or Google Drive preview link.
- Notes and timestamp submission.
- Instant status transition to `Draft Review`.

#### 12.3 Dispute Resolution Trigger
- If either party fails to meet deadlines or deliverables, either party can click `"Open Dispute"`, freezing escrow and escalating to the Admin Backoffice.

---

### Module 13: Admin Backoffice & Platform Control Room
*The centralized operator portal for financial oversight, escrow arbitration, and platform governance.*

#### 13.1 Platform Revenue & KPI Analytics
- **Gross Merchandise Value (GMV):** Cumulative transaction volume across all escrow contracts.
- **Platform Net Revenue:** 10–15% take-rate collected from completed campaigns.
- **Total Escrow in Vault:** Real-time volume of active funds currently locked in escrow.
- **Active Deals & Delivery Velocity:** Number of campaigns currently in production.

#### 13.2 Escrow Vault Control Center
- Full ledger of all active, delivered, and disputed contracts.
- Administrative overrides:
  - `Release Funds to Creator` (Manual payout override).
  - `Refund Deposit to Brand` (In case of creator non-delivery).
  - `Arbitrate Dispute` (Split escrow percentage based on partial deliverables).

#### 13.3 Creator Directory Moderation
- Approve or flag newly enrolled YouTube creators.
- Re-order or pin top performers in the public Top 10 Directory.
- Manual audit score overrides.

#### 13.4 System Configuration & Economic Parameters
- Adjustable Platform Take-Rate Percentage (default: 10% – 15%).
- Starting Credit Allowance for new creators (default: 50).
- Credit deduction cost per application (default: 5).

---

### Module 14: Judge & Sandbox Demo Experience (Zero-Auth Playground)
*Ensures hackathon judges, investors, and prospective users can test 100% of features in 60 seconds.*

#### 14.1 One-Click Sandbox Profiles
- Pre-configured demo profiles:
  - **Tech Creator:** "Kaveen Tech" (428K Subs, Singapore, Tech & AI, 3 pre-loaded video analyses).
  - **Music Creator:** "Amaya Tunes" (185K Subs, Sri Lanka, Acoustic Vocalist, 3 pre-loaded video analyses).
  - **Enterprise Brand:** "Acme Enterprise Corp" ($10K demo balance, pre-funded campaigns).
- Instant switching between profiles with zero Google login or API keys required.

#### 14.2 Interactive Guided Tour Mode
- Optional step-by-step banner guiding the evaluator through the complete platform loop:
  1. Inspect creator on the **Top 10 Directory**.
  2. Switch to **Creator Hub** -> Review Rate Cards & Escrow Vault.
  3. Switch to **Brand Portal** -> Generate AI Job Card -> Match with Creator.
  4. Submit Bid -> Simulate Escrow Lock -> Submit Deliverable -> Release Payout.

---

## 5. Frontend Component Hierarchy & File Structure

The frontend must follow a clean, modular structure organized by domain and persona:

```
src/
├── main.jsx                     # App entry point with AntD ConfigProvider
├── App.jsx                      # Root container, global mode state, persistence
├── index.css                    # Tailwind imports, custom CSS variables & animations
│
├── components/
│   ├── navbar/
│   │   ├── GlobalNavbar.jsx     # Persistent header with Mode Switcher & Wallet Pill
│   │   └── SettingsModal.jsx    # API Keys & Client ID configuration
│   │
│   ├── directory/
│   │   ├── Top10Directory.jsx   # Public category leaderboard & cards
│   │   ├── CreatorCard.jsx      # Individual creator preview card
│   │   └── VideoAuditModal.jsx  # 3-video multimodal critique scorecard
│   │
│   ├── creator/
│   │   ├── CreatorDashboard.jsx # Seller telemetry overview & quick stats
│   │   ├── RateCardManager.jsx  # Fiverr-style package editor & pricing
│   │   ├── JobOpportunities.jsx # Upwork-style brand campaign board
│   │   ├── CustomBidModal.jsx   # Custom proposal & milestone bidding
│   │   ├── ProposalGenerator.jsx# Gemini AI tailored pitch generator
│   │   ├── EscrowManager.jsx    # Deliverable submission & contract tracker
│   │   ├── ChannelDiagnostics.jsx# Multimodal AI 3-video critique view
│   │   └── CreatorWallet.jsx    # Credit balance & transaction history
│   │
│   ├── business/
│   │   ├── BusinessPortal.jsx   # Brand workspace container
│   │   ├── AIJobBuilder.jsx     # Natural language campaign generator
│   │   ├── CreatorMatchmaker.jsx# Ranked candidate list with rationales
│   │   ├── NefraSenseChat.jsx   # Conversational AI strategic decision drawer
│   │   └── CampaignPipeline.jsx # Active job tracker & incoming proposals
│   │
│   ├── onboarding/
│   │   └── OnboardingScreen.jsx # 5-step interactive creator setup wizard
│   │
│   └── common/
│       ├── YouTubeIcon.jsx      # Brand-compliant YouTube SVG
│       ├── ModalityBadge.jsx    # Online / Hybrid / Physical pill
│       ├── EscrowStatusBadge.jsx# Deterministic escrow stage indicator
│       └── SandboxBanner.jsx    # Demo mode indicator with 1-click profiles
│
├── services/
│   ├── geminiService.js         # Multimodal video analysis, job builder, matchmaker
│   ├── youtubeService.js        # YouTube Data API v3 integration & OAuth token client
│   ├── escrowService.js         # Escrow state machine & fee calculations
│   └── firestoreService.js      # Cloud Firestore real-time sync with local fallback
│
└── data/
    ├── seedCreators.js          # Pre-seeded verified YouTube talent
    ├── seedCampaigns.js         # Pre-seeded enterprise brand job cards
    └── mockData.js              # Fallback sandbox telemetry & active contracts
```

---

## 6. State Management, Real-Time Sync & Persistence

### 6.1 State Management Strategy
- **Global Portal State:** Managed in root `App.jsx` (`mode`: `'creator' | 'business' | 'admin'`, `activeTab`).
- **Real-Time Data Stores:**
  - `creators`: Synced with Firestore collection `creators` + `localStorage` fallback.
  - `campaigns`: Synced with Firestore collection `campaign_jobs`.
  - `escrowContracts`: Synced with Firestore collection `escrow_contracts`.
  - `wallet`: Managed with custom event emitter (`nefra_wallet_updated`) for instantaneous cross-component updates.

### 6.2 Offline / Resilient LocalStorage Schema
| Storage Key | Content Type | Purpose |
| :--- | :--- | :--- |
| `nefra_portal_mode` | `'creator'` \| `'business'` | Remembers last active persona |
| `nefra_enrolled_creators` | `JSON Array` | Cached verified creators list |
| `nefra_active_contracts` | `JSON Array` | Local escrow state machine |
| `nefra_creator_wallet` | `JSON Object` | Current credits balance & ledger |
| `nefra_gemini_key` | `String` | User-provided Google AI Studio key |
| `nefra_google_client_id`| `String` | OAuth 2.0 Web Client ID |

---

## 7. AI Service Layer & Prompt Specifications

All Generative AI capabilities utilize **Google Gemini 2.5 / 3 Flash** with deterministic JSON output schemas.

### 7.1 Multimodal 3-Video Creator Audit Prompt
- **Input:** Video titles, descriptions, view counts, and transcripts/audio signals.
- **Output Schema:**
```json
{
  "category": "Technology & AI",
  "categoryLabel": "Tech & AI",
  "aiScore": 94,
  "metrics": {
    "productionQuality": 92,
    "hookRetention": 89,
    "brandSafety": 98
  },
  "nicheTags": ["#M4MacBook", "#CloudDevOps", "#Nextjs15", "#AIAgents"],
  "tone": "Authoritative, concise, high-density practical demonstrations",
  "audienceDemographics": "78% 22-38 years, software developers, technical founders",
  "videoCritiques": [
    {
      "videoId": "vid_01",
      "title": "M4 Max MacBook Review for AI Engineers",
      "praise": "Exceptional benchmark testing and authentic developer workflow",
      "suggestion": "Include visual timestamp chapters in first 10 seconds"
    }
  ]
}
```

### 7.2 AI Campaign Job Card Builder Prompt
- **Input:** Brand's unstructured natural language requirements.
- **Output Schema:**
```json
{
  "title": "Senior AI Developer Tool Review & Live Integration Demo",
  "category": "tech",
  "targetCategory": "tech",
  "targetAudience": "Professional developers, enterprise architects in JAPAC",
  "budget": 2500,
  "deliverables": [
    "1x Dedicated 8-10 min YouTube technical deep dive",
    "2x YouTube Shorts featuring killer workflow hooks",
    "Persistent pinned link in description"
  ],
  "modality": "online",
  "deadline": "2026-11-25",
  "keyMessaging": "Demonstrate zero-latency code generation using Gemini 2.5 Flash SDK"
}
```

### 7.3 Multimodal Creator Matchmaker Prompt
- **Input:** Structured Job Card + Candidate Creator Profiles.
- **Output Schema:**
```json
[
  {
    "creatorId": "creator_kaveen_tech",
    "matchScore": 98,
    "rationale": "Perfect technical match. Creator's recent uploads focus directly on generative AI SDKs with exceptional developer engagement.",
    "modalityFeasible": true
  }
]
```

### 7.4 Creator AI Proposal / Pitch Prompt
- **Input:** Creator profile + Selected Brand Campaign.
- **Output Schema:**
```json
{
  "hook": "My 428K developer community actively seeks low-friction AI development workflows...",
  "concept": "A real-world benchmark challenge comparing manual implementation against your Gemini-powered API...",
  "timelineCommitment": "Full 4K draft delivered within 7 business days, including 2 rounds of script alignment."
}
```

---

## 8. Micro-Interactions, Animation & Feedback Matrix

To maintain high user engagement and delightful feedback:
1. **Canvas Confetti:**
   - Triggers on successful OAuth connection.
   - Triggers on Rate Card creation.
   - Triggers on Proposal submission.
   - Triggers on Escrow funds release.
2. **Deterministic Status Colors:**
   - Pre-Funded Escrow: `Cyan` glow.
   - In Production: `Amber` pulse.
   - Draft Uploaded: `Purple` badge.
   - Funds Released: `Emerald` checkmark.
3. **Skeleton Loading:**
   - Custom animated dark-shimmer skeletons for video audit cards, matchmaker rankings, and job board feeds while Gemini is computing.
4. **Toast Feedback:**
   - Glassmorphic top-right floating toasts with brand icons for every asynchronous event.

---

## 9. Error Handling, Validation & Edge Cases Matrix

| Potential Failure Point | Frontend Defense & Handling Mechanism |
| :--- | :--- |
| **No Google Client ID Configured** | Seamlessly falls back to pre-seeded Sandbox Creator profiles with instant 1-click evaluation. No hard crashes. |
| **No Gemini API Key Configured** | Prompts user via non-blocking notification; uses robust heuristic fallback algorithms for instant scores and cards. |
| **YouTube API Quota Exceeded** | Caches channel telemetry in `localStorage`; falls back to simulated video metadata without degrading UI. |
| **Geo-Modality Incompatibility** | Form validation automatically flags impossible bids (e.g. physical on-site requirements for international creators unable to travel). |
| **Insufficient Credits** | When creator reaches 0 credits, triggers the Refill Modal with a 1-click "+15 Demo Credits" refill button. |
| **Escrow Dispute** | Automatically locks the release button and renders the neutral mediation contact drawer. |

---

## 10. Summary & Implementation Verification Checklist

- [x] **Universal Discovery:** Verified Top 10 Leaderboard with interactive 3-video critique modal.
- [x] **Creator Onboarding:** 5-step wizard with real YouTube OAuth 2.0 and demo sandbox presets.
- [x] **Rate Card Gigs:** Fiverr-style modular packages with modality and platform fee calculation.
- [x] **Job Opportunities:** Upwork-style brand campaign board with compatibility percentages.
- [x] **AI Proposals:** 1-click tailored Gemini pitch drafting with credit deduction.
- [x] **AI Diagnostics:** Multimodal 3-video quality, retention, and brand safety scorecard.
- [x] **Credit Economy:** 50-credit starter balance, demo refills, and real-time ledger.
- [x] **AI Job Builder:** Natural language to structured campaign cards with geo/modality constraints.
- [x] **NefraSense Agent:** Interactive conversational brand decision drawer with 1-click strategy pills.
- [x] **Escrow Vault:** 5-stage milestone tracking from pre-funding to final creator payout.
- [x] **Admin Backoffice:** GMV, take-rate analytics, dispute arbitration, and fee controls.
- [x] **Judge Sandbox:** 100% offline-compatible demo flow with zero required credentials.

---
*Created by Google DeepMind / Antigravity Agentic AI — Standardized for Production MVP Deployment.*
