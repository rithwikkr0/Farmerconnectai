# BHOOMI MITHRA

## ಬೆಳಕಿನ ಮನೆ

**Bhoomi Mithra** is an AI-powered agricultural ecosystem designed to help farmers understand their farm, weather, crops, resources, people, livestock and markets through one connected interface.

The platform combines a **Next.js + TypeScript frontend**, **Cloudflare Worker backend**, **Cloudflare D1 SQLite database**, **Google Gemini AI**, live weather data from **Open-Meteo**, a centralized API layer, farm-context persistence, and Stitch-inspired Three.js visual experiences.

---

## 🌐 Live Production Deployments

* **Frontend Web Platform (Cloudflare Pages)**: [https://bhoomi-mithra.pages.dev](https://bhoomi-mithra.pages.dev)
* **Backend API Engine (Cloudflare Worker)**: [https://farmconnect-ai-worker.bhoomi-mithra.workers.dev](https://farmconnect-ai-worker.bhoomi-mithra.workers.dev)
* **System Health Status**: [https://farmconnect-ai-worker.bhoomi-mithra.workers.dev/api/health](https://farmconnect-ai-worker.bhoomi-mithra.workers.dev/api/health)
* **Source Code Repository**: [https://github.com/rithwikkr0/Farmerconnectai](https://github.com/rithwikkr0/Farmerconnectai)

---

## Product Vision

Bhoomi Mithra brings agricultural intelligence into a single farmer-focused workflow:

> **Understand the farm → understand the conditions → make better decisions → connect with people and resources → act.**

The product is designed around practical decision support rather than pretending that AI can guarantee outcomes.

---

## 📊 Live Production & Data Status

| Feature / Service | Endpoint / Area | Status | Data Source |
| :--- | :--- | :--- | :--- |
| **System Health** | `GET /api/health` | **LIVE (HTTP 200)** | Cloudflare Worker v1.0.0 |
| **Weather Telemetry** | `GET /api/weather` | **LIVE (HTTP 200)** | Open-Meteo Real-time Meteorological API |
| **Labor Dispatch Requests** | `POST /api/labor/request` | **LIVE (HTTP 201)** | Cloudflare D1 Database (`bhoomi-mithra-db`) |
| **Labor Worker Search** | `GET /api/labor/nearby` | **OPERATIONAL (HTTP 200)** | D1 with Bhoomi Mithra Demo Crew Fallback |
| **Farm Marketplace** | `GET /api/marketplace` | **OPERATIONAL (HTTP 200)** | D1 with APMC Demo Lot Fallback |
| **Farmer Matching** | `POST /api/farmers/match` | **OPERATIONAL (HTTP 200)** | Deterministic Matching & Demo Registry |
| **Agricultural Services** | `GET /api/services` | **OPERATIONAL (HTTP 200)** | D1 with Regional Extension Directory Fallback |
| **Crop AI Copilot** | `POST /api/ai` | **BLOCKED (HTTP 503)** | Google Gemini (Worker secret key pending activation) |
| **Crop Recommendations** | `POST /api/crops/recommend` | **BLOCKED (HTTP 503)** | Google Gemini (Worker secret key pending activation) |
| **Weather Agronomic Advice**| `POST /api/weather/advice` | **BLOCKED (HTTP 503)** | Google Gemini (Worker secret key pending activation) |

> **Transparency Note**: Features marked as DEMO utilize calibrated agrarian profiles and realistic mandi lots until verified multi-tenant profiles are onboarded to D1. Weather is verified LIVE via Open-Meteo. Gemini AI endpoints are plumbed server-side with input validation and safety disclaimers, returning 503 until a valid Google Gemini API key is activated in Cloudflare secrets.

---

## 18 Core Experiences

| # | Route | Feature | Production Link |
|---|---|---|---|
| 01 | `/` | Bhoomi Mithra Splash Experience | [Launch](https://bhoomi-mithra.pages.dev/) |
| 02 | `/setup` | Set Up Your Farm | [Launch](https://bhoomi-mithra.pages.dev/setup) |
| 03 | `/dashboard` | Farm Command Center | [Launch](https://bhoomi-mithra.pages.dev/dashboard) |
| 04 | `/copilot` | Bhoomi Mithra AI Copilot | [Launch](https://bhoomi-mithra.pages.dev/copilot) |
| 05 | `/crops` | Crop Intelligence | [Launch](https://bhoomi-mithra.pages.dev/crops) |
| 06 | `/crop-doctor` | AI Crop Doctor | [Launch](https://bhoomi-mithra.pages.dev/crop-doctor) |
| 07 | `/input-advisor` | AI Input Advisor | [Launch](https://bhoomi-mithra.pages.dev/input-advisor) |
| 08 | `/weather` | Weather Intelligence | [Launch](https://bhoomi-mithra.pages.dev/weather) |
| 09 | `/weather-protection` | Weather Protection Center | [Launch](https://bhoomi-mithra.pages.dev/weather-protection) |
| 10 | `/calendar` | AI Farm Calendar | [Launch](https://bhoomi-mithra.pages.dev/calendar) |
| 11 | `/profit` | Farm Profit Simulator | [Launch](https://bhoomi-mithra.pages.dev/profit) |
| 12 | `/community` | Farmer Community | [Launch](https://bhoomi-mithra.pages.dev/community) |
| 13 | `/farmers` | Find a Farmer Who Can Help Me | [Launch](https://bhoomi-mithra.pages.dev/farmers) |
| 14 | `/labor` | Farm Labor Marketplace | [Launch](https://bhoomi-mithra.pages.dev/labor) |
| 15 | `/marketplace` | Farm Marketplace / Buyers | [Launch](https://bhoomi-mithra.pages.dev/marketplace) |
| 16 | `/services` | Nearby Agricultural Services | [Launch](https://bhoomi-mithra.pages.dev/services) |
| 17 | `/livestock` | Livestock AI Ecosystem | [Launch](https://bhoomi-mithra.pages.dev/livestock) |
| 18 | `/business` | Business / Company Opportunities | [Launch](https://bhoomi-mithra.pages.dev/business) |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│               Bhoomi Mithra UI (Next.js 16)                │
│             Deployed on Cloudflare Pages                    │
│             https://bhoomi-mithra.pages.dev                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Bhoomi Mithra Worker Backend (Itty Router)         │
│          https://farmconnect-ai-worker.bhoomi-mithra.workers.dev
└──────────────┬──────────────────┬─────────────────┬─────────┘
               │                  │                 │
               ▼                  ▼                 ▼
   ┌──────────────────────┐ ┌───────────────┐ ┌───────────────┐
   │    Open-Meteo API    │ │ Cloudflare D1 │ │ Google Gemini │
   │ (Live Meteorology)   │ │ (APAC SQLite) │ │ (AI Advisory) │
   └──────────────────────┘ └───────────────┘ └───────────────┘
```

### Cloudflare D1 Database (`bhoomi-mithra-db`)
* **Region**: APAC (Singapore)
* **Binding**: `DB`
* **Database ID**: `95e6dfb4-9257-485c-b33d-b760bd466eb7`
* **Schema (`worker/schema.sql`)**:
  * `farmers`: Peer farmer directory and agronomic specialties
  * `labor_workers`: Skill-indexed farm labor crews with GPS coordinates
  * `labor_requests`: Live dispatch tickets and duration management
  * `marketplace_listings`: APMC-categorized inputs, seeds, and equipment lots
  * `agricultural_services`: Drone spraying, cold storage, and soil testing directory

---

## 🛠️ Local Development

### Prerequisites
* Node.js v20+
* npm or pnpm
* Cloudflare Wrangler CLI

### Setup & Run
```bash
# 1. Install dependencies
npm install
cd worker && npm install && cd ..

# 2. Start Worker backend locally
cd worker
npx wrangler dev --port 8787

# 3. Start Next.js frontend
cd ..
npm run dev
```

### Type Checking & Building
```bash
# Frontend
npm run type-check
npm run build

# Worker
cd worker
npx tsc --noEmit
```

---

## 🔒 Security Posture
* **Zero Client-Side Secrets**: No API keys or credentials exist in Next.js browser bundles or public environment variables.
* **Encrypted Worker Secrets**: The Gemini API key is managed solely via Cloudflare Worker encrypted secrets (`wrangler secret put GEMINI_API_KEY`).
* **Git Cleanliness**: All secrets, `.dev.vars`, and build artifacts are strictly ignored via `.gitignore`.
