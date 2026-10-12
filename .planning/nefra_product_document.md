# Nefra: AI-Powered Creator Matching Platform
**Comprehensive Product & Architecture Document**
*Prepared for Google Cloud AI Builder Cup JAPAC 2026*

## 1. Executive Summary & Vision
Nefra is a hybrid platform bridging the gap between Upwork and LinkedIn, designed specifically for the creator economy. It connects influencers and content creators with businesses using an advanced suite of Google Cloud Generative AI tools. By intelligently categorizing creators, semantically matching them with business requirements, and empowering business owners with an AI decision agent ('NefraSense'), Nefra streamlines the multi-billion dollar influencer marketing workflow.

**Hackathon Alignment:** This project directly addresses two core tracks of the Google Cloud AI Builder Cup JAPAC 2026: 
1. Media, Content & Digital Experiences
2. Future of Work & Enterprise Productivity

---

## 2. Core Platform Features

### For Creators / Influencers:
* **Profile Registration & Categorization:** Creators register and link their portfolios. AI automatically analyzes their content to categorize their niche, aesthetic style, and audience demographics.
* **Rankings & Affinity Scores:** Creators receive a local and global "Nefra Match Score" (or Campaign Affinity Index) visible only to them, showing their standing in their respective fields.
* **Credit Economy & Job Applications:** Creators subscribe to the platform and use a credit system to apply for posted job cards.

### For Businesses / Brands:
* **AI Job Card Builder:** Businesses use an integrated AI assistant (powered by Gemini) to convert raw ideas into structured, professional job cards containing deliverables, timelines, and budgets.
* **Smart Matching:** Once a requirement is posted, the platform suggests the top 10 best-matched influencers based on deep semantic similarity rather than just keyword tags.
* **NefraSense (Business Decision Engine):** An interactive AI advisor that evaluates budgets, target demographics, and campaign goals to explain *why* specific creators are recommended and how to optimize campaign ROI.

---

## 3. Google Cloud Gen AI Implementation Stack
*To secure maximum points for Technical Merit (40% of the judging score), Nefra will integrate the following GCP services:*

| Feature | GCP AI Technology | Implementation Strategy |
| :--- | :--- | :--- |
| **Creator Categorization** | Vertex AI (Gemini Flash) | Extract content topics, demographics, and styles from text/transcripts using multimodal prompts. |
| **Smart Matching & Ranking** | Vertex AI Vector Search & Text Embeddings | Convert creator profiles and job requirements into 768-dim vector embeddings for real-time similarity matching. |
| **AI Job Card Builder** | Gemini API | Turn raw business inputs into structured campaign job descriptions. |
| **NefraSense Engine** | Vertex AI Agent Builder / Gemini | Analyze matched creators vs. business goals to output natural language strategic advice. |

---

## 4. 14-Day MVP Implementation Sprint
*Strategy constraint: 80% of technical effort must focus on the AI pipeline. Non-critical platform features will be mocked or pre-seeded.*

| Phase (Days) | Focus Area | Key Deliverables |
| :--- | :--- | :--- |
| **Days 1-4** | Categorization & Embeddings | Pre-seed 30 creators. Build Gemini API pipeline to parse data and push embeddings to Vector Search. |
| **Days 5-7** | Semantic Matching Engine | Implement `text-embedding-004` and k-NN vector matching for the Job-to-Creator logic. |
| **Days 8-10** | NefraSense Agent | Build the strategic reasoning agent prompt to explain creator recommendations. |
| **Days 11-12** | Cloud Run & Wireframe UI | Deploy Next.js/React MVP on Google Cloud Run with Firebase Auth. Hardcode mock credits. |
| **Days 13-14** | Pitch Deck & Video | Record the mandatory 3-minute video showing end-to-end AI functionality and finalize slides. |

---

## 5. Architecture & Scalability Blueprint

### Phase 1: MVP & Hackathon (Sri Lanka Launch)
* **Infrastructure:** Next.js frontend deployed on Cloud Run (`asia-south1` / `asia-southeast1`).
* **Database & Auth:** Firebase Authentication and Firestore DB for rapid deployment.
* **AI Stack:** Vertex AI for LLM processing and Vector Search for matching.

### Phase 2: JAPAC Expansion
* **Delivery:** Implementation of Cloud Load Balancing and Cloud CDN for edge delivery.
* **Localization:** Utilizing Gemini’s native multilingual capabilities to standardize Asian languages into English for cross-border matching.
* **Analytics:** Exporting logs to BigQuery to continuously train ranking algorithms.

### Phase 3: Global Scale
* **Database Migration:** Shifting from Firestore to globally distributed Cloud Spanner for strict transactional consistency (payments/credits).
* **Multi-Region AI:** Deploying Vertex AI Endpoints across US, EU, and Asia clusters to ensure low-latency NefraSense responses.

---

## 6. Hackathon Logistics & Eligibility Rules
*To ensure the team is not disqualified, Nefra will adhere to the following competition constraints:*

* **Team Composition:** 2 to 4 members total. Cross-company startups/collaboration is permitted.
* **Age & Status:** All members must be 21+ and working professionals/founders. **NO full-time students allowed.**
* **Location:** All team members must reside in the JAPAC region.
* **Deliverables:** Fully deployed Cloud Run MVP link, public GitHub repository, 3-minute video demo, and Pitch Deck.
* **Key Dates:** 
    * Registration/App deadline: Early October 2026. 
    * Finalists announced: November 7, 2026. 
    * Grand Finale in Singapore: December 4, 2026.