# NEFRA Platform Architecture (NEW PROJECT)

This workspace contains the complete multi-tier architecture for the **NEFRA Creator Economy & Escrow Platform**.

---

## 🏗️ System Architecture

```text
NEW PROJECT/
├── marketplace/          # Frontend 1: Toggleable Portal (Creator Hub ⇄ Business / Buying)
│   ├── src/
│   │   ├── components/
│   │   │   ├── navbar/         # GlobalNavbar with Fiverr-style Role Toggle & Escrow Vault
│   │   │   ├── onboarding/     # 5-step Guided Onboarding with Google OAuth & YouTube Readonly
│   │   │   ├── creator/        # Creator Hub UI (Rate Cards, Bids, Escrow, AI Diagnostics, Directory)
│   │   │   └── business/       # Business Portal UI (Campaign Builder, Creator Discovery)
│   │   ├── services/
│   │   │   └── api.js          # REST Client connected to Node.js Express Backend
│   │   ├── data/               # Verified creator models, Rate Cards, Escrow states, AI diagnostics
│   │   ├── App.jsx             # Ant Design ConfigProvider (Dark Theme Algorithm) + Mode Switcher
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── admin/                # Frontend 2: Dedicated Admin Backoffice (Platform Analytics, Disputes, Fees)
│
└── backend/              # Node.js + Express REST API Backend Service
    ├── src/
    │   ├── config/config.js          # Port, CORS, take-rate, and API keys
    │   ├── data/inMemoryStore.js     # Data store for creators, campaigns, rate cards, and escrow
    │   ├── services/
    │   │   ├── escrowStateMachine.js # States: FUNDED -> IN_PROGRESS -> DELIVERED -> APPROVED -> RELEASED
    │   │   ├── feeCalculator.js      # 10% - 15% platform take-rate & escrow ledger calculations
    │   │   ├── youtubeService.js     # YouTube Data API v3 verification & telemetry extraction
    │   │   └── geminiService.js      # Gemini 2.5 Flash multimodal video audits & safety ratings
    │   ├── controllers/              # Auth, Creators, Campaigns, Escrow, and AI controllers
    │   ├── routes/                   # Modular Express routers
    │   └── app.js                    # Express app configuration & middleware
    ├── server.js                     # Server entrypoint running on port 5001
    └── package.json
```

---

## 📡 Backend API Endpoints (`http://127.0.0.1:5001/api`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/health` | Service health status check |
| **POST** | `/auth/verify-youtube` | Verifies Google OAuth token and extracts YouTube channel telemetry |
| **GET** | `/creators/me` | Fetch verified creator profile & reach metrics |
| **PUT** | `/creators/me` | Update creator profile, modality, and geo preferences |
| **GET** | `/creators/rate-cards` | List creator's active rate cards |
| **POST** | `/creators/rate-cards` | Create new Rate Card package with automatic escrow fee breakdown |
| **PUT** | `/creators/rate-cards/:id`| Update rate card pricing, turnaround, or revisions |
| **GET** | `/creators/leaderboard` | Top verified creator leaderboard |
| **GET** | `/campaigns` | List brand campaigns (supports `?modality=online\|hybrid\|physical`) |
| **POST** | `/campaigns` | Post new brand campaign with escrow deposit calculation |
| **POST** | `/campaigns/proposals` | Submit custom creator proposal/bid with milestone breakdown |
| **GET** | `/escrow/contracts` | List active escrow contracts and total vault locked balance |
| **GET** | `/escrow/contracts/:id` | Contract details with milestone history |
| **POST** | `/escrow/contracts/:id/deliverable` | Submit video deliverable link (transitions state to `DELIVERED`) |
| **POST** | `/escrow/contracts/:id/transition` | Execute state machine transition (`APPROVED`, `RELEASED`, etc.) |
| **GET** | `/escrow/fees/calculate` | Preview fee engine calculation (`?amount=5000&takeRate=10`) |
| **POST** | `/ai/audit-video` | Gemini 2.5 Flash multimodal video audit & retention analysis |
| **GET** | `/ai/channel-safety` | Algorithmic advertiser brand safety score & pricing intelligence |

---

## 🔒 Escrow State Machine States

```text
[FUNDED] ──(Kickoff)──► [IN_PROGRESS] ──(Upload Video)──► [DELIVERED]
                                                               │
                              ┌────────────────────────────────┴────────────────────────┐
                              ▼                                                         ▼
                     [REVISION_REQUESTED]                                           [APPROVED]
                              │                                                         │
                              └──────────────────► [DELIVERED]                          ▼
                                                                                   [RELEASED]
```

---

## 🚀 Running the Services Locally

### 1. Run the Backend API
```bash
cd "NEW PROJECT/backend"
npm run dev   # or npm start
# Server listens on http://127.0.0.1:5001
```

### 2. Run the Marketplace Frontend
```bash
cd "NEW PROJECT/marketplace"
npm run dev
# Vite runs on http://127.0.0.1:5175
```
