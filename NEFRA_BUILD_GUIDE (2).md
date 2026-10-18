# Nefra: Build Guide for Antigravity

Nefra is an escrow marketplace for YouTube creators and brands. This guide tells an AI coding agent (Antigravity) what to build, in what order, and how to check the work.

**Key decision: three separate portals.** Creator, Brand and Admin are three independent apps with their own login, navigation and deploy. They share a design system, database and services. There is no mode switcher and no single-page shell.

**Key decision: Google services only.** The backend is Firebase and Google Cloud, with Cloud Firestore as the database. The one gap is real-money payments, which no Google service covers (see section 3, "Payments"). The build runs end to end on Google services alone, using a sandbox payment provider.

---

## 1. How to use this guide with Antigravity

1. Create an empty repo and open it in Antigravity.
2. Save this file as `docs/BUILD_GUIDE.md`.
3. Copy section 2 ("Agent rules") into your workspace rules file (for example `.agent/rules/nefra.md`, or whichever rules location your Antigravity version supports).
4. Run the phases in section 10 **one at a time**. Paste the phase prompt, let the agent plan, review the plan, then let it build.
5. After each phase, ask the agent to run the phase's acceptance checks and show browser screenshots or a recording as proof. Do not start the next phase until the checks pass.

---

## 2. Agent rules (paste into workspace rules)

- Stack: TypeScript, Next.js (App Router), Tailwind CSS, shadcn/ui, pnpm, Turborepo.
- Google services only: Firebase and Google Cloud. Use Cloud Firestore, Firebase Authentication, Cloud Functions, Cloud Storage, Gemini and Secret Manager. Do not add any non-Google backend, database, auth or email service.
- Clients never write money or contract state. Only Cloud Functions (Admin SDK) write contracts, ledger entries, credit balances and statuses. Firestore security rules must deny these writes from every client.
- Use Firestore transactions for anything that changes a balance or a contract status.
- Payments go through the `PaymentsProvider` interface in `packages/payments`. Ship only the sandbox provider until a real provider is chosen.
- Three apps (`creator`, `brand`, `admin`) and shared packages. Apps never import from each other. Shared code lives in `packages/`.
- Use shadcn/ui components only. Do not install other component libraries.
- Colors: black, white, red and neutral greys. No other hues, no gradients, no glow effects.
- All money values are integers in cents. Format only at the UI edge.
- Every escrow state change goes through `packages/escrow`. Never update contract status directly from a page or API route.
- AI calls happen on the server only. Never expose API keys to the browser.
- Every form uses Zod validation shared between client and server.
- Every list page needs loading, empty and error states.
- Write a test for each rule in the escrow state machine before building its UI.
- Sentence case for all UI text. Buttons say what they do ("Fund escrow", not "Submit").

---

## 3. Architecture

```
nefra/
├── apps/
│   ├── creator/      # nefra.com            (public directory + creator portal)
│   ├── brand/        # brands.nefra.com     (brand portal)
│   └── admin/        # admin.nefra.com      (internal, invite-only)
├── functions/        # Cloud Functions (2nd gen): callables, triggers, webhooks, schedules
├── packages/
│   ├── ui/           # shadcn components, theme tokens, shared layouts
│   ├── db/           # Firestore data access, typed converters, rules tests
│   ├── auth/         # session, roles, portal guards
│   ├── escrow/       # state machine, fee math, ledger
│   ├── payments/     # PaymentsProvider interface + sandbox provider
│   ├── ai/           # Gemini client, prompts, Zod output schemas
│   ├── youtube/      # OAuth + YouTube Data API v3 client
│   └── config/       # eslint, tsconfig, tailwind preset
├── firebase.json, firestore.rules, firestore.indexes.json, storage.rules
└── docs/BUILD_GUIDE.md
```

**Services (all Google)**

| Need | Service |
|---|---|
| Database | Cloud Firestore (Native mode) |
| Sign-in | Firebase Authentication. Admin accounts use Identity Platform for multi-factor. Role stored as a custom claim (`creator`, `brand`, `admin`) |
| Server logic | Cloud Functions 2nd gen: callable functions, Firestore triggers, HTTP webhooks |
| Scheduled jobs | Cloud Scheduler (auto-approve after silence, payout retries, daily stats) |
| File uploads | Cloud Storage for Firebase, with storage rules |
| Hosting | Firebase App Hosting, one backend per portal |
| AI | Gemini through Vertex AI, called from Cloud Functions only |
| YouTube | Google OAuth + YouTube Data API v3 |
| Secrets | Secret Manager |
| Abuse protection | Firebase App Check |
| Email | Gmail API or Google Workspace SMTP relay, sent from Cloud Functions |
| Logs and errors | Cloud Logging, Error Reporting |
| Local dev and tests | Firebase Emulator Suite |

**Payments.** Google does not offer a service that holds funds in escrow or pays out marketplace sellers. Google Pay only lets a buyer choose a card; a payment processor still has to charge it and move the money. So for real money you will eventually need a non-Google provider or a licensed escrow service. Until then:
- Build `packages/payments` with a `PaymentsProvider` interface: `createPayoutProfile`, `collectDeposit`, `refund`, `payout`.
- Ship a `SandboxProvider` that simulates success and failure and writes only to the Firestore ledger.
- Everything else (escrow state machine, ledger, UI) works unchanged when a real provider is added later.

**Portal isolation rules**
- Separate domains, session cookies and middleware per app. Each app checks the `role` custom claim and rejects any other role.
- Admin accounts are created by invitation only and require multi-factor authentication.
- Firestore security rules enforce access on every collection. A brand reads only documents with its own `brandOrgId`. A creator reads only documents with their own `creatorId`. Public data (directory profiles, open campaigns) is readable by anyone.

### 3.1 Firestore data model

Firestore has no joins, so store what each screen needs together and keep copies of small display fields (names, avatars) on the documents that show them.

| Collection | Key fields | Who writes |
|---|---|---|
| `users/{uid}` | role, email, status | Functions |
| `creators/{uid}` | channel stats, category, country, modality, visa flag, aiScore, status, `credits` | Creator (profile fields), Functions (status, credits, scores) |
| `creators/{uid}/rateCards/{id}` | title, format, priceCents, days, revisions, modality, checklist, status | Creator |
| `creators/{uid}/audits/{id}` | metrics, tags, tone, video critiques | Functions |
| `creators/{uid}/creditLedger/{id}` | type, amount, balanceAfter, ref | Functions |
| `brandOrgs/{id}` | company, website, verification status, member uids | Brand (profile), Functions (status) |
| `campaigns/{id}` | brandOrgId, jobCard fields, budgetCents, modality, countries, status | Brand |
| `campaigns/{id}/bids/{id}` | creatorId, amountCents, days, milestones, proposal, status | Creator |
| `contracts/{id}` | brandOrgId, creatorId, amountCents, feePercent (snapshot), state, revisionsLeft, milestones | Functions only |
| `contracts/{id}/ledger/{id}` | account, amountCents, type, idempotencyKey, createdAt | Functions only |
| `contracts/{id}/events/{key}` | transition, actor, reason (doc id = idempotency key) | Functions only |
| `disputes/{id}` | contractId, openedBy, reason, statements, resolution | Parties (open, statement), Functions (resolution) |
| `notifications/{id}` | recipientUid, type, ref, readAt | Functions |
| `config/platform` | feePercent, startingCredits, proposalCost, minSubscribers | Admin via Functions |
| `stats/platform` | gmvCents, feeRevenueCents, escrowHeldCents | Functions (updated inside release transactions) |
| `adminAuditLog/{id}` | adminUid, action, target, before, after | Functions only, no client reads except admin |

**Rules for the agent**
- Money is stored as integer cents in fields ending in `Cents`.
- Every contract transition runs in one Firestore transaction in a Cloud Function: read the contract, check the transition table, create the `events/{idempotencyKey}` document (this fails if it already exists, which makes retries safe), write the ledger entries, update the contract and `stats/platform`.
- Credit spending runs in a transaction that checks balance, writes the ledger entry and updates `credits` together.
- Add composite indexes in `firestore.indexes.json` for every filtered and sorted query (for example directory by category and score, campaigns by status and date). The emulator will tell you which are missing.
- Paginate every list with cursors (`startAfter`). Never load a whole collection.
- Write rules tests with `@firebase/rules-unit-testing` for each collection: allowed read, denied read, allowed write, denied write.

---

## 4. Design system (shadcn, black, white, red)

Put tokens in `packages/ui/styles/tokens.css`. Both themes use the same three colors.

```css
:root {
  --background: 0 0% 100%;   --foreground: 0 0% 4%;
  --card: 0 0% 100%;         --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  --border: 0 0% 90%;        --input: 0 0% 90%;
  --primary: 0 72% 51%;      --primary-foreground: 0 0% 100%;  /* red */
  --destructive: 0 72% 51%;  --ring: 0 72% 51%;
  --radius: 0.5rem;
}
.dark {
  --background: 0 0% 0%;     --foreground: 0 0% 98%;
  --card: 0 0% 4%;           --muted: 0 0% 9%;
  --muted-foreground: 0 0% 64%;
  --border: 0 0% 15%;        --input: 0 0% 15%;
  --primary: 0 84% 60%;      --primary-foreground: 0 0% 100%;
}
```

**Usage**
- Red is for the primary action on a page, active navigation, progress and warnings. Everything else is black, white or grey.
- Status badges: use outline for neutral, solid red for "needs action" or "released", grey for "pending". Do not add green, blue or amber.
- Font: Inter. Numbers use tabular figures.
- Components to install: button, input, textarea, select, checkbox, switch, dialog, sheet, table, tabs, badge, card, progress, form, dropdown-menu, sonner (toasts), skeleton, breadcrumb, sidebar.
- Layout: left sidebar + top bar for all three portals. The portal name appears in the top-left so users always know where they are.

---

## 5. Creator portal (`apps/creator`)

### 5.1 Route map

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing and top creators |
| `/directory` | Public | Category leaderboard, filters |
| `/directory/[handle]` | Public | Creator profile, rate cards, AI audit scorecard |
| `/sign-in`, `/sign-up` | Public | Account access |
| `/onboarding/*` | Creator (unverified) | 5-step wizard |
| `/dashboard` | Creator | Summary, next actions |
| `/rate-cards` | Creator | Manage packages |
| `/opportunities` | Creator | Campaign board |
| `/opportunities/[id]` | Creator | Brief, bid form, AI proposal |
| `/contracts` | Creator | Escrow contracts list |
| `/contracts/[id]` | Creator | Milestones, deliverable upload, dispute |
| `/audit` | Creator | AI channel audit |
| `/credits` | Creator | Balance and ledger |
| `/payouts` | Creator | Payout account and history |
| `/settings` | Creator | Profile, modality, notifications |

### 5.2 Creator onboarding process

The wizard lives at `/onboarding/[step]`. Progress is saved after every step so the creator can leave and return. A creator cannot access bidding, rate cards or the public directory listing until step 5 is complete.

| Step | Route | What the creator does | System action | Done when |
|---|---|---|---|---|
| 1. Account | `/onboarding/account` | Sign up with email or Google | Create `user` with role `creator` | Email verified |
| 2. Connect YouTube | `/onboarding/youtube` | Authorize read-only YouTube access | Fetch channel name, handle, avatar, subscriber count, 3 latest uploads | Channel stored and subscriber count is above the minimum set by admin |
| 3. Profile | `/onboarding/profile` | Confirm category, country, work modality (online, hybrid, on-site), travel willingness | Gemini suggests category and niche tags | Required fields valid |
| 4. Rate cards | `/onboarding/rate-cards` | Set price and turnaround for at least one package | Save packages as `draft` | At least one package with price of $50 or more |
| 5. Payouts | `/onboarding/payouts` | Add payout details, accept fee terms | Create payout profile through `packages/payments`, record terms acceptance | Payout account has no pending requirements |
| Review | `/onboarding/review` | See summary and submit | Run 3-video AI audit, set status `pending_review` | Submitted |

**After submission**
1. Status becomes `pending_review`. The creator sees a waiting page with the audit in progress.
2. An admin approves or rejects in the admin portal (section 7).
3. On approval: status `active`, rate cards go live, profile appears in the directory, welcome credits are added to the wallet (ledger entry "Welcome bonus"), and the creator is redirected to `/dashboard` with a confirmation toast.
4. On rejection: the creator sees the reason and can edit and resubmit.

**Edge cases**
- YouTube authorization denied: explain what access is needed and offer retry.
- Channel already linked to another account: block and show a support link.
- Under the subscriber minimum: show the number needed and save progress.
- API quota error: retry with cached channel data, never crash.

### 5.3 Creator processes after onboarding

**Rate cards.** Create, edit, pause and delete packages. Each has title, format, price, turnaround days, revisions included, modality and a deliverable checklist. The form shows a live fee preview: brand price, platform fee, creator net.

**Bidding.**
1. Creator opens a campaign and sees its brief, budget, modality, target countries and match score.
2. If the campaign is on-site and the creator cannot travel there, the bid button is disabled with an explanation.
3. Creator enters a bid, turnaround and three milestones (default 30% script, 50% draft, 20% final).
4. Optional: "Draft with AI" costs credits. The server checks balance, calls Gemini, charges credits only on success, and returns an editable proposal (hook, concept, delivery commitment).
5. Submit. The bid appears in the brand's pipeline.

**Delivering work.** See section 8 for the escrow lifecycle. Creator-side actions: start work, upload draft (link or file), respond to revisions, open a dispute.

**Credits.** Credits are spent on AI proposals. Show balance in the top bar, full ledger at `/credits`. When balance is below the proposal cost, show a top-up dialog.

---

## 6. Brand portal (`apps/brand`)

### 6.1 Route map

| Route | Purpose |
|---|---|
| `/sign-in`, `/sign-up` | Account access |
| `/onboarding/*` | Company setup |
| `/dashboard` | Spend, active campaigns, actions needed |
| `/campaigns` | All campaigns by status |
| `/campaigns/new` | AI campaign builder |
| `/campaigns/[id]` | Brief, matches, incoming bids |
| `/creators` | Search directory (brand view) |
| `/creators/[handle]` | Creator detail and direct hire |
| `/advisor` | NefraSense AI chat |
| `/contracts` | Escrow contracts |
| `/contracts/[id]` | Review drafts, approve, request revision, dispute |
| `/billing` | Payment methods, deposits, invoices |
| `/team` | Invite teammates, roles |
| `/settings` | Company profile |

### 6.2 Brand onboarding process

| Step | Route | What the brand does | System action |
|---|---|---|---|
| 1. Account | `/onboarding/account` | Sign up with work email | Create `user` with role `brand`. Block free email domains if admin enables it. |
| 2. Company | `/onboarding/company` | Company name, website, industry, country, logo | Create `brand_org` |
| 3. Contact and team | `/onboarding/team` | Billing contact, optional teammates | Send invites |
| 4. Payment method | `/onboarding/billing` | Add payment method through `packages/payments` | Save payment profile, no charge |
| 5. Verification | `/onboarding/verify` | Confirm company website or upload registration | Set `pending_review` or `verified` by rule |

A brand can browse creators immediately. It can **post campaigns and fund escrow only after verification**. Admin reviews brands in the admin portal.

### 6.3 Brand processes

**Create a campaign.**
1. At `/campaigns/new`, the brand writes what it needs in plain language, or picks a sample prompt.
2. The server asks Gemini for a structured job card (section 9.2). The brand edits every field.
3. The brand sets modality, target countries and, for on-site work, the shoot city and travel policy.
4. Publish. Status becomes `open`.

**Match creators.** On the campaign page, show ranked creators with score, a two-sentence reason and feasibility status. Creators who cannot meet the modality or region are marked "Cannot travel" and sorted below eligible ones. The brand can invite any eligible creator.

**Choose a creator.** Two paths:
- *Bid path:* review incoming bids side by side (price, timeline, proposal, creator stats). Choose "Accept and fund escrow" or "Decline".
- *Direct hire path:* on a creator's rate card choose "Order and fund escrow". A contract is created with the card's fixed scope.

**Fund escrow.** The brand pays 100% up front through `packages/payments`. The contract moves to `funded` only after the Cloud Function receives a confirmed deposit, never on the client's word.

**Review and approve.** Watch the draft, then approve, request a revision (while revisions remain) or open a dispute.

**NefraSense advisor.** A chat page with four quick actions: optimize budget, compare two creators, write hooks, milestone checklist. The server includes the campaign and creator data as context. Chat history is stored per campaign.

---

## 7. Admin portal (`apps/admin`)

Internal only. Invite-only accounts, two-factor required, every action written to an audit log.

### 7.1 Route map

| Route | Purpose |
|---|---|
| `/overview` | GMV, net revenue, escrow held, open disputes |
| `/creators` | Review queue, approve, reject, flag, override scores |
| `/brands` | Verification queue |
| `/contracts` | All contracts, filters by stage |
| `/disputes` | Dispute queue and resolution |
| `/payouts` | Pending and failed payouts |
| `/directory` | Pin and order top creators, manage categories |
| `/config` | Fee percentage, credit rules, subscriber minimum |
| `/audit-log` | Immutable record of admin actions |
| `/team` | Invite admins, set permissions |

### 7.2 Admin processes

**Creator review.** Open a pending creator: channel stats, 3-video AI audit, profile and rate cards. Actions: approve, reject with reason, request changes.

**Brand verification.** Open a pending brand: company details and evidence. Actions: verify, reject with reason.

**Dispute resolution.**
1. Either party opens a dispute. The contract freezes.
2. Admin reads the contract, brief, delivery history and both parties' statements.
3. Admin chooses an outcome: release to creator, refund to brand, or split by percentage. A written reason is required.
4. The system executes the ledger entries and payment actions, notifies both parties and closes the dispute.

**Configuration.** Fee percentage (10 to 15), starting credits, proposal cost, subscriber minimum. Changes apply to new contracts only, never to existing ones. Each change is audit-logged.

---

## 8. Escrow process (shared logic in `packages/escrow`)

### 8.1 States

`pending_payment → funded → in_production → draft_review → approved → released`

Side states: `revision_requested` (returns to `in_production`), `disputed` (frozen), `refunded`, `cancelled`.

### 8.2 Allowed transitions

| From | To | Triggered by | Rule |
|---|---|---|---|
| `pending_payment` | `funded` | Payment webhook (Cloud Function) | Full amount received |
| `funded` | `in_production` | Creator | Creator accepts and starts |
| `in_production` | `draft_review` | Creator | Draft link or file attached |
| `draft_review` | `revision_requested` | Brand | Revisions remaining above zero |
| `revision_requested` | `in_production` | System | Revision count decreases |
| `draft_review` | `approved` | Brand | None |
| `draft_review` | `approved` | System (Cloud Scheduler) | Brand silent for 5 days after draft (configurable) |
| `approved` | `released` | System | Compute fee, pay creator net |
| any active state | `disputed` | Brand or creator | Reason required |
| `disputed` | `released`, `refunded`, or split | Admin | Reason required |
| `funded` | `refunded` | Brand or admin | Creator has not started, or creator agrees |

Anything not in this table must throw an error.

### 8.3 Money rules

- Fee = gross × fee percentage (snapshot the percentage on the contract at creation).
- Creator net = gross − fee.
- Store every movement as an append-only document in `contracts/{id}/ledger` (account, amount, type, timestamp). Never update or delete ledger documents; rules must deny it.
- Releases and refunds must be idempotent. Use the idempotency key as the id of the `events` document inside the transaction (see 3.1).

### 8.4 Milestones

Contracts may carry milestones (default 30/50/20). Each milestone has its own approve and release step. Amounts must sum exactly to the contract total. Put remainder cents on the last milestone.

### 8.5 Notifications

Send email (Gmail API from a Cloud Function) and in-app notifications (Firestore documents, read in real time) on every transition to the other party, and to admin on disputes.

---

## 9. AI features (`packages/ai`)

Use one callable Cloud Function per feature. Each takes typed input, calls Gemini through Vertex AI, validates the output with Zod, and retries once on invalid JSON. If AI fails, return a deterministic fallback so the UI never blocks.

### 9.1 Channel audit
Input: channel stats and the 3 latest videos (title, description, views, transcript if available). Output: category, AI score (0–100), production quality, hook retention, brand safety (each 0–100), niche tags, tone, audience summary, and a short praise and suggestion for each video.

### 9.2 Campaign job card
Input: the brand's free-text brief. Output: title, category, target audience, budget (cents), deliverables list, modality, deadline, key message. Brands must be able to edit every field.

### 9.3 Creator match
Input: job card and candidate creators. Output per creator: score (0–100), two-sentence rationale. Feasibility (modality, country, visa) is computed in code, not by the model. Cap the final score if feasibility fails.

### 9.4 Proposal draft
Input: creator profile and campaign. Output: hook, concept, delivery commitment. Charge credits only after a valid response.

### 9.5 Advisor chat
Streaming responses. System prompt includes campaign and candidate data. Never let the advisor claim to take actions such as hiring or paying.

---

## 10. Build phases for Antigravity

For each phase: give the agent the prompt, review its plan, then check the acceptance list.

### Phase 0: Scaffold
**Prompt:** "Create a Turborepo with pnpm containing `apps/creator`, `apps/brand`, `apps/admin` (Next.js, TypeScript, Tailwind) and `packages/ui`, `db`, `auth`, `escrow`, `ai`, `youtube`, `config`. Install shadcn/ui in `packages/ui` and apply the black, white and red tokens from section 4. Add a sign-in page and a sidebar layout to each app showing the portal name."
**Accept when:** all three apps run on different ports, share the same components, and light and dark mode both render with only black, white and red.

### Phase 1: Firestore, auth and security rules
**Prompt:** "Set up Firebase (Firestore, Auth, Functions, Storage, Emulator Suite). Implement the collections in section 3.1 with typed converters, `firestore.rules`, `storage.rules` and `firestore.indexes.json`. Set the `role` custom claim from a Cloud Function on sign-up or invitation, and add portal guards so each app only accepts its own role."
**Accept when:** a creator login is rejected by the brand and admin apps, and Emulator Suite rules tests prove one brand cannot read another brand's documents and no client can write a contract's state, ledger or credits.

### Phase 2: Escrow engine (no UI)
**Prompt:** "Build `packages/escrow` exactly from section 8: states, transition table, fee math, ledger entries, idempotency. Write tests for every allowed transition and every disallowed one, run against the Firestore emulator. Add the `PaymentsProvider` interface and sandbox provider."
**Accept when:** all tests pass, including cents rounding on milestones and idempotent double release.

### Phase 3: Creator onboarding
**Prompt:** "Build the creator onboarding wizard from section 5.2, including YouTube OAuth, saved progress, Gemini category suggestion, rate cards, payout setup through the sandbox payments provider, and the review step. Add a sandbox mode that uses a fixture channel when OAuth keys are absent."
**Accept when:** a new user can finish all steps with sandbox data, reload mid-way without losing progress, and land on a pending-review screen.

### Phase 4: Admin approvals
**Prompt:** "Build the admin app's creator review queue, brand verification queue and audit log from section 7. Approving a creator must set them active, publish their rate cards and add welcome credits."
**Accept when:** an approved creator appears in the creator portal's public directory and the audit log records the action.

### Phase 5: Public directory
**Prompt:** "Build the public directory and creator profile pages from section 5.1 with category filters, ranking by AI score and the 3-video scorecard."
**Accept when:** pages work signed out, are server-rendered and load a profile in under two seconds on local.

### Phase 6: Brand onboarding and campaigns
**Prompt:** "Build the brand onboarding from section 6.2 and the campaign builder, match list and bid inbox from section 6.3 using `packages/ai`."
**Accept when:** an unverified brand cannot publish; a verified brand can generate, edit and publish a campaign and see ranked matches with feasibility flags.

### Phase 7: Bidding and contracts
**Prompt:** "Build creator bidding, AI proposal drafting with credits, bid acceptance and sandbox funding, then the contract pages for both portals driven by `packages/escrow`."
**Accept when:** the full path works in test mode: bid, accept, fund, start, upload draft, request revision, approve, release. Both ledgers match.

### Phase 8: Disputes, credits and payouts
**Prompt:** "Build the dispute flow, admin resolution (release, refund, split), credit top-up and the payouts pages."
**Accept when:** a disputed contract blocks all normal actions and a split resolution produces correct ledger entries.

### Phase 9: Advisor, notifications, polish
**Prompt:** "Add NefraSense chat, email and in-app notifications, skeleton loading, empty and error states on every list, and keyboard navigation checks."
**Accept when:** every page has all three states, and an accessibility scan shows no critical issues.

---

## 11. Security checklist

- Server-side authorization on every API route and server action, not only in the UI.
- Verify payment webhook signatures inside the Cloud Function. Never trust client-reported payment status.
- Enable App Check on Firestore, Functions and Storage. Rate limit AI functions and sign-in.
- Validate uploaded file types and size. Scan or restrict to links for the first release.
- Never log tokens, API keys or full card data.
- Keep YouTube tokens and API secrets in Secret Manager or in fields only Cloud Functions can read. Request read-only YouTube scope only.
- Admin: two-factor, short sessions, audit log that cannot be edited.

---

## 12. Definition of done

- Three separately deployable portals, each with only its own routes and role.
- The full money loop works in sandbox mode with matching ledgers.
- Escrow transition tests pass, and no UI code changes contract status directly.
- Onboarding works for both creators and brands, with progress saved.
- Only black, white and red appear in the UI, in both light and dark mode.
- Every list has loading, empty and error states.
- Seed script creates demo creators, brands, campaigns and contracts so a reviewer can try everything in a few minutes.

---

## 13. Open decisions to confirm before building

1. Final fee percentage (10, 12 or 15) and whether it varies by volume.
2. Auto-approve window when a brand does not respond (default 5 days).
3. Minimum subscriber count for creator approval.
4. Which payment provider to use for real money. No Google service can escrow funds or pay out sellers. Options are a non-Google payments provider with marketplace payouts, or a licensed escrow service. The sandbox provider covers development until you decide.
5. Whether holding third-party funds triggers regulatory requirements in your markets. Get legal advice before launch.
6. Region for Firestore and Cloud Functions. Pick one close to most users; it cannot be changed later.
