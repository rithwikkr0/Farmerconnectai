# BHOOMI MITHRA

## ಬೆಳಕಿನ ಮನೆ

**Bhoomi Mithra** is an AI-powered agricultural operating system designed to help farmers understand their farm, weather, crops, resources, people, livestock, and markets through one connected interface.

The platform combines a **Next.js 16 + TypeScript frontend**, **Cloudflare Worker backend**, **Cloudflare D1 SQLite database**, **Google Gemini 3.5 AI**, live meteorological telemetry from **Open-Meteo**, a centralized API layer, Web Crypto authenticated farmer sessions, and Stitch-inspired Three.js visual experiences.

---

## 🌐 Live Production Deployments

* **Frontend Web Platform (Cloudflare Pages)**: [https://bhoomi-mithra.pages.dev](https://bhoomi-mithra.pages.dev)
* **Backend API Engine (Cloudflare Worker)**: [https://farmconnect-ai-worker.bhoomi-mithra.workers.dev](https://farmconnect-ai-worker.bhoomi-mithra.workers.dev)
* **System Health Status**: [https://farmconnect-ai-worker.bhoomi-mithra.workers.dev/api/health](https://farmconnect-ai-worker.bhoomi-mithra.workers.dev/api/health)
* **Source Code Repository**: [https://github.com/rithwikkr0/Farmerconnectai](https://github.com/rithwikkr0/Farmerconnectai)

---

## 🌾 Product Vision

Bhoomi Mithra brings agricultural intelligence into a single farmer-focused workflow:

> **Understand the farm → understand the conditions → make better decisions → connect with people and resources → act.**

The product is designed around practical decision support rather than pretending that AI can guarantee outcomes. Every AI response is contextualized with the authenticated farmer's real acreage, soil profile, water access, and current crop.

---

## 📊 Live Production & Data Verification Status (14 / 14 Verified)

| Endpoint | Method | Status | Verified Result / Data Source |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | **LIVE (HTTP 200)** | Cloudflare Worker v1.0.0 |
| `/api/weather` | `GET` | **LIVE (HTTP 200)** | Open-Meteo Real-time Meteorology (Mandya, Karnataka) |
| `/api/auth/register` | `POST` | **LIVE (HTTP 201)** | Cloudflare D1 (`users`, `sessions`, `farm_profiles`) |
| `/api/auth/me` | `GET` | **LIVE (HTTP 200)** | D1 Authenticated Farmer Context Sync |
| `/api/auth/login` | `POST` | **LIVE (HTTP 200)** | PBKDF2 Web Crypto Hash Verification |
| `/api/auth/logout` | `POST` | **LIVE (HTTP 200)** | Server-side Session Invalidation |
| `/api/ai` | `POST` | **LIVE (HTTP 200)** | Google Gemini 3.5 Agronomic Advisory Engine |
| `/api/crops/recommend` | `POST` | **LIVE (HTTP 200)** | Gemini Structured Regional Crop Suitability |
| `/api/weather/advice` | `POST` | **LIVE (HTTP 200)** | Open-Meteo Telemetry + Gemini AI Synthesis |
| `/api/farmers/match` | `POST` | **OPERATIONAL (HTTP 200)** | Two-stage Deterministic + AI Ranking (D1) |
| `/api/labor/nearby` | `GET` | **OPERATIONAL (HTTP 200)** | Haversine Geo-distance Query (Mandya Cluster) |
| `/api/labor/request` | `POST` | **LIVE (HTTP 201)** | Persistent D1 Dispatch Tickets (`labor_requests`) |
| `/api/marketplace` | `GET` | **OPERATIONAL (HTTP 200)** | D1 APMC Lot Directory (`marketplace_listings`) |
| `/api/services` | `GET` | **OPERATIONAL (HTTP 200)** | D1 Agricultural Extension & Machinery Directory |

> **Transparency Note**: Features marked as OPERATIONAL utilize calibrated regional records in D1 with explicit `(DEMO)` tags for presentation demonstration. Real farmer accounts created via `/register` or `/login` are genuine persistent D1 records. Gemini AI and Weather telemetry are verified LIVE in production.

---

## 🧭 Core Experiences & Authentication

| # | Route | Experience | Status |
|---|---|---|---|
| 01 | `/` | Bhoomi Mithra Splash Experience | Live |
| 02 | `/register` | Farmer Identity & Farm Registration | **New (D1 Auth)** |
| 03 | `/login` | Farmer Sign In & Session Verification | **New (D1 Auth)** |
| 04 | `/profile` | Persistent Farm Profile & D1 Telemetry Sync | **New (D1 Auth)** |
| 05 | `/setup` | Reconfigure Farm Parameters | Live |
| 06 | `/dashboard` | Farm Command Center (Personalized Banner) | Live |
| 07 | `/copilot` | Bhoomi Mithra AI Copilot | Live (Gemini 3.5) |
| 08 | `/crops` | Crop Intelligence & Suitability Scoring | Live (Gemini 3.5) |
| 09 | `/crop-doctor` | AI Crop Doctor | Live |
| 10 | `/input-advisor` | AI Input & Nutrient Advisor | Live |
| 11 | `/weather` | Weather Intelligence | Live (Open-Meteo) |
| 12 | `/weather-protection` | Weather Protection Center | Live |
| 13 | `/calendar` | AI Farm Operations Calendar | Live |
| 14 | `/profit` | Farm Profit Simulator | Live |
| 15 | `/community` | Farmer Community & Exchange | Live |
| 16 | `/farmers` | Find a Peer Farmer | Live (D1) |
| 17 | `/labor` | Farm Labor Marketplace & Dispatch | Live (D1) |
| 18 | `/marketplace` | Farm Marketplace & APMC Inputs | Live (D1) |
| 19 | `/services` | Agricultural Services (Drone / Machinery / Lab) | Live (D1) |
| 20 | `/livestock` | Livestock AI Ecosystem | Live |
| 21 | `/business` | Business & Contract Farming Opportunities | Live |

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│               Bhoomi Mithra UI (Next.js 16)                │
│             Deployed on Cloudflare Pages                    │
│             https://bhoomi-mithra.pages.dev                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS (with Session Token & Cookie)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Bhoomi Mithra Worker Backend (Itty Router)         │
│          https://farmconnect-ai-worker.bhoomi-mithra.workers.dev
└──────────────┬──────────────────┬─────────────────┬─────────┘
               │                  │                 │
               ▼                  ▼                 ▼
   ┌──────────────────────┐ ┌───────────────┐ ┌───────────────┐
   │    Open-Meteo API    │ │ Cloudflare D1 │ │ Google Gemini │
   │ (Live Meteorology)   │ │ (APAC SQLite) │ │ (3.5 AI Model)│
   └──────────────────────┘ └───────────────┘ └───────────────┘
```

### Cloudflare D1 Database (`bhoomi-mithra-db`)
* **Region**: APAC (Singapore)
* **Binding**: `DB`
* **Database ID**: `95e6dfb4-9257-485c-b33d-b760bd466eb7`
* **Tables**:
  * `users`: Farmer accounts with PBKDF2 password hashes (salt + hash)
  * `sessions`: Server-side session tokens with expiration tracking
  * `farm_profiles`: Acreage, soil type, water source, current crop, season, goal
  * `farmers`: Peer farmer directory and agronomic specialties
  * `labor_workers`: Skill-indexed farm labor crews with GPS coordinates
  * `labor_requests`: Live dispatch tickets and duration management
  * `marketplace_listings`: APMC-categorized inputs, seeds, and equipment lots
  * `agricultural_services`: Drone spraying, cold storage, and soil testing directory

---

## 🎬 5–7 Minute Demonstration Flow

1. **Open Platform**: Navigate to [https://bhoomi-mithra.pages.dev](https://bhoomi-mithra.pages.dev).
2. **Register Real Account**: Click **Register** (or `/register`) and enter a farmer's real credentials (e.g., *Basavaraj, Mandya, 4.5 acres, Red sandy loam, Sugarcane*).
3. **D1 Provisioning**: Account, password hash, and farm profile are created in Cloudflare D1.
4. **Personalized Dashboard**: User lands on `/dashboard` with a greeting banner showing their name, primary crop, acreage, and soil profile.
5. **Live Weather & Advisory**: Live Open-Meteo weather is fetched for Mandya and combined with Gemini AI agronomic advice.
6. **AI Copilot & Crop Recommendations**: Open `/copilot` and `/crops` to receive Gemini 3.5 recommendations tailored to the farmer's soil and acreage.
7. **Labor Marketplace & Dispatch**: Open `/labor`, select a nearby crew, and click book. A dispatch ticket is stored in D1.
8. **APMC Marketplace & Agri Services**: Browse verified lots and machinery on `/marketplace` and `/services`.
9. **Persistence Verification**: Click **Logout** → session is destroyed. Click **Sign In** (`/login`) with the email and password → all farm profile parameters are restored from D1.

---

## 🔒 Security Posture
* **Zero Client-Side Secrets**: No Gemini API keys or credentials exist in Next.js browser bundles.
* **Worker Encrypted Secrets**: Gemini API keys are injected via encrypted Cloudflare Worker environment secrets.
* **Web Crypto Password Hashing**: Passwords are never stored in plaintext; hashed using PBKDF2 with SHA-256 (100,000 iterations) and 16-byte random salts.
* **Session Security**: Session tokens are verified against D1 `sessions` with expiration timestamps.
* **Git Cleanliness**: All secrets, local environment files, and build outputs are strictly excluded via `.gitignore`.
