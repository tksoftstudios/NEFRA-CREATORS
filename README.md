# Nefra: AI-Powered Creator Intelligence & Matching Platform
> **Prepared for Google Cloud AI Builder Cup JAPAC 2026**

Nefra is an AI creator intelligence platform connecting content creators and businesses. It solves the creator discoverability and campaign vetting problem through Google Gen AI video content analysis, automatic categorization, and strategic job card matching.

---

## 🌟 Key Features

1. **YouTube Creator Verification & 3-Video AI Analyzer**:
   - Google Sign-In with OAuth 2.0 (`youtube.readonly` scope) to eliminate creator impersonation and retrieve verified subscriber counts.
   - Fetches the creator's 3 latest uploads.
   - **Gemini 2.5 Flash** watches the 3 videos and extracts:
     - Primary Category (*Tech & AI*, *Travel & Culinary*, *Education*, *Gaming*, *Lifestyle*, *Business*)
     - 5–8 Niche Tags (`#CloudArchitecture`, `#M4MacBook`, etc.)
     - Tone & Aesthetic Style
     - Audience Demographics
     - Nefra AI Creator Score (0–100)
2. **Public Discovery: Top 10 Creators of Every Category**:
   - Universal leaderboard displaying top 10 ranked creators per category with verified subscriber counts.
   - Interactive modal allowing anyone to inspect the 3 videos evaluated by Gemini.
3. **Business Campaign Engine: AI Job Cards & Matchmaker**:
   - Unstructured requirement input converted into structured **Campaign Job Cards** by Gemini.
   - AI Matchmaker evaluates creators in the category, assigning match percentages and rationales.
4. **Instant Judge & Demo Sandbox**:
   - Seamless offline/sandbox demo profiles so judges can test without connecting personal YouTube credentials.

---

## 🛠 Google Cloud & Firebase Manual Setup Guide

### 1. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/) and select your project.
2. **Enable YouTube Data API v3**:
   - Navigate to **APIs & Services** > **Library** > Search for **YouTube Data API v3** > Click **Enable**.
3. **Configure OAuth Consent Screen**:
   - Navigate to **APIs & Services** > **OAuth consent screen**.
   - User Type: **External**.
   - Add scope: `https://www.googleapis.com/auth/youtube.readonly`.
   - Add your test Google accounts under **Test users**.
4. **Create OAuth 2.0 Client ID**:
   - Navigate to **APIs & Services** > **Credentials** > **Create Credentials** > **OAuth client ID**.
   - Application type: **Web application**.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `https://<your-firebase-project-id>.web.app`
     - `https://<your-firebase-project-id>.firebaseapp.com`
   - Copy the generated **Client ID**.

### 2. Gemini API Key Setup
1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. You can set it in `.env`:
   ```bash
   cp .env.example .env
   # Set VITE_GEMINI_API_KEY and VITE_GOOGLE_CLIENT_ID
   ```
   *(Or simply paste them into the in-app Settings modal at the top right).*

### 3. Firebase Hosting Manual Setup
1. Log in to Firebase CLI:
   ```bash
   firebase login
   ```
2. Link your Firebase project:
   ```bash
   firebase use <your-firebase-project-id>
   ```
   *(Or update `.firebaserc` with your project ID).*
3. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 🧪 Local Development & Testing

```bash
# Start Vite development server
npm run dev

# Run automated pipeline tests
node scripts/verify-pipeline.js

# Production build
npm run build
```
