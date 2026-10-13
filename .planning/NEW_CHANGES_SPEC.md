# Nefra Platform — Proposed Changes & Feature Specification
> **Document Purpose:** This is an interactive, editable specification file. You can edit the text, toggle checkboxes (`[x]` or `[ ]`), add or delete items, and modify configuration parameters to define exactly how you want the next phase of changes implemented.

---

## 📌 How to Use & Edit This File
1. **Review each section** below comparing the current codebase with your product roadmap.
2. **Toggle choices** by changing `[ ]` to `[x]` for features you want, or leave `[ ]` / delete sections you do not want.
3. **Edit any inline parameters** marked with `[EDIT]` or modify text directly.
4. **Save the file** and notify the AI agent when ready to implement!

---

## 🔍 Section 1: Current Codebase vs Product Document Audit

| Component / Feature | Current Implementation in Code | Planned in Product Doc | Status / Gap |
| :--- | :--- | :--- | :--- |
| **Tech Stack** | Vite + React 19 + Firebase Hosting | Next.js on Cloud Run / Vite | Functional; fast local dev & instant deploy |
| **YouTube Verification** | OAuth 2.0 (`youtube.readonly`) + Sandbox demo presets | Verified YouTube OAuth | ✅ Fully implemented |
| **AI Content Analyzer** | Gemini 3.8/3.6/3.5 Flash evaluates 3 latest videos | Gemini Flash Multimodal | ✅ Fully implemented with video critiques & fallback |
| **Top 10 Directory** | Category tabs, dynamic custom AI categories, modal preview | Category leaderboards | ✅ Fully implemented with high aesthetic styling |
| **AI Job Card Builder** | Natural language to structured campaign cards | Gemini API Job Card Builder | ✅ Fully implemented |
| **Creator Matchmaker** | Ranks candidates with match % and 2-sentence rationale | Vector Search (`text-embedding-004`) | ⚠️ Functional with Gemini prompt ranking; lacks vector embeddings |
| **NefraSense Decision Agent** | Static text rationale in cards | Interactive strategic decision advisor | ❌ Missing conversational / interactive advisory UI |
| **Credit Economy** | None (creators enroll without credit usage) | Credit wallet + subscription model | ❌ Missing creator credit system & wallet UI |
| **Creator Job Applications** | Creators cannot view or apply to posted jobs | Creators use credits to apply to jobs | ❌ Missing creator-side job marketplace & application form |
| **Cloud Persistence** | Firestore for `creators` and `campaign_jobs` + localStorage | Cloud Firestore | ✅ Implemented with fallback |

---

## 🚀 Section 2: Proposed Changes by Module (Select & Edit)

### Module A: Creator Credit Economy & Job Application Portal
*Transforms Nefra from a one-way directory into a full two-way talent marketplace like Upwork/LinkedIn.*

- [x] **A.1 Creator Credit Balance & Wallet**
  - Default starting credits for newly connected creators: `50 Credits` <!-- [EDIT: Change amount if needed] -->
  - Credit cost to apply for a Brand Campaign: `5 Credits` <!-- [EDIT: Change cost] -->
  - Daily login bonus / Refill button for demo purposes: `+15 Credits`
  - Display credit balance badge in Creator Hub and Navbar when viewing as Creator.

- [x] **A.2 Creator Job Board ("Opportunities" Tab/View)**
  - Creators can browse live Campaign Job Cards created by brands (synced via Firestore).
  - Filter jobs by:
    - [x] Category match (e.g., show only Music jobs for Music creators)
    - [x] Budget range (e.g. Under $1,500, $1,500–$3,000, $3,000+)
    - [x] Deliverable format (YouTube Shorts, Dedicated Video, Integration)
  - Display "Match Compatibility Score" on each job card showing how well the creator matches the brand's requirement.

- [x] **A.3 AI Pitch / Proposal Generator for Creators**
  - When applying, creator clicks "Apply with Nefra AI Proposal" (deducts 5 credits).
  - Gemini auto-generates a tailored, professional pitch based on:
    - The creator's 3 analyzed videos & creative style
    - The brand's specific deliverables and target persona
  - Creator can edit the pitch before submitting to the brand.

---

### Module B: Interactive "NefraSense" Business Advisory Engine
*Upgrades the brand experience from a static match list into an active AI strategist.*

- [x] **B.1 Interactive NefraSense Chat & Strategy Drawer**
  - An interactive slide-out panel or dedicated tab inside the Brand Campaign Portal.
  - Allows the business owner to converse with NefraSense about their campaign:
    - *"How should I allocate my $2,500 budget between a dedicated video vs Shorts?"*
    - *"Compare Creator A and Creator B — who drives better conversion in JAPAC?"*
    - *"Can you draft a script hook or creative concept tailored to this creator's style?"*

- [x] **B.2 Quick Strategy Prompts (1-Click Pills)**
  - Provide pre-built prompt pills for instant business advice:
    - [x] `⚡ Optimize Campaign ROI` (Suggests deliverables & budget splits)
    - [x] `📊 Creator Head-to-Head Comparison` (Side-by-side strengths & risks)
    - [x] `💡 Creative Concept & Hooks` (Generates 3 hook ideas matching creator tone)
    - [x] `🤝 Negotiation & Deliverable Checklist` (Contract & milestone recommendations)

- [ ] **B.3 Vertex AI Embeddings / True Vector Similarity (Optional)**
  - [ ] Implement `text-embedding-004` generation for Creator Profiles and Job Cards.
  - [ ] Calculate client-side cosine similarity to benchmark alongside Gemini ranking.
  - *Note: LLM ranking with rationales is currently working; check this box if you want explicit vector similarity metrics.*

---

### Module C: 2-Way Campaign Offer & Application Management Loop
*Closes the loop between Brands and Creators.*

- [x] **C.1 Brand "Campaign Pipeline" Dashboard**
  - In `BusinessJobPortal`, add a "My Campaigns" sub-view:
    - See all posted Job Cards.
    - View incoming creator applications with their AI proposals.
    - View sent offers and status (`Offer Sent`, `Accepted`, `Declined`).

- [x] **C.2 Creator "Offers & Applications" Inbox**
  - In `CreatorConnect`, add an "Inbox / Activity" tab:
    - View incoming offers directly from brands.
    - One-click `Accept Offer` or `Request Revision`.
    - View submitted job applications and their review status.

- [x] **C.3 Firestore Real-Time Application Sync**
  - Store applications in Firestore collection: `campaign_applications`
  - Real-time updates so status changes reflect immediately for both parties.

---

### Module D: UI / Navigation & Persona Switcher Polish
*Enhances navigation clarity for judges and users.*

- [x] **D.1 Dual-Persona Switcher in Navbar**
  - Clear persona toggle or tab structure:
    - `Top 10 Directory` (Universal public discovery & creator rankings)
    - `Creator Hub` (Connect channel, AI 3-video audit, browse jobs & credit wallet)
    - `Brand Portal` (AI job builder, creator matching, NefraSense agent, campaign pipeline)
  - Display active user role badge: `Creator Mode` vs `Brand Mode`

- [x] **D.2 Enhanced Video Preview Modal with Critique Scorecard**
  - Add visual metric bars in the video critique modal:
    - Production Quality (0–100)
    - Audience Engagement Retention Index
    - Brand Safety & Alignment Score

---

### Module E: Hackathon Pitch & Demo Experience (AI Builder Cup 2026)

- [x] **E.1 Pre-Seeded Interactive Demo Flow**
  - "1-Click Judge Demo Tour" button that automatically walks through:
    1. Visiting Top 10 Directory & inspecting creator #1 (Acoustic Singer or Tech).
    2. Switching to Creator Hub -> auto-selecting a sandbox profile -> running Gemini 3-video analysis.
    3. Switching to Brand Portal -> loading sample campaign prompt -> generating job card -> running NefraSense matching -> sending offer.
  - Great for the mandatory 3-minute video presentation!

- [ ] **E.2 Export Campaign PDF / Brief**
  - Allow businesses to download the generated Job Card and Creator Shortlist as a clean PDF or Markdown report.

---

## 📝 Section 3: Custom Instructions & User Edits
*Use this space to type any specific requirements, wording changes, color preferences, or additional features you want included:*

```markdown
<!-- WRITE YOUR CUSTOM INSTRUCTIONS OR REFINEMENTS HERE -->
- Example: "Make sure music creators have specific tags like Acoustic and Vocalist"
- Example: "Add a dark gold accent to the credits wallet"
- 

```

---

## 🛠 Next Steps
1. Edit this file as desired (change `[ ]` to `[x]`, edit parameters, or write custom notes above).
2. Save the file.
3. Tell the AI: **"I have updated the spec file, proceed with the implementation."** (or ask any questions).
