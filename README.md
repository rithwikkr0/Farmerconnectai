<div align="center">

<img src="public/bhoomi-mithra-logo.png" alt="Bhoomi Mithra Logo" width="120" />

# Bhoomi Mithra
### ಬೆಳಕಿನ ಮನೆ

**AI-Powered Agricultural Intelligence Platform for Indian Farmers**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-bhoomi--mithra.pages.dev-6c47ff?style=for-the-badge)](https://bhoomi-mithra.pages.dev)
[![Worker API](https://img.shields.io/badge/⚡%20Worker%20API-farmconnect--ai--worker-orange?style=for-the-badge)](https://farmconnect-ai-worker.bhoomi-mithra.workers.dev/api/health)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=for-the-badge&logo=cloudflare)](https://workers.cloudflare.com)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%203.5-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev)

</div>

---

## What is Bhoomi Mithra?

**Bhoomi Mithra** (ಭೂಮಿ ಮಿತ್ರ) — *Friend of the Earth* — is an AI-powered agricultural platform built specifically for Indian farmers. It combines **real-time weather**, **Google Gemini 3.5 AI**, and a **farmer community** to help farmers make smarter decisions about their crops, inputs, labor, and markets.

The tagline **ಬೆಳಕಿನ ಮನೆ** (*House of Light*) reflects the mission: bringing clarity and knowledge to every farming household.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| 🌾 **Crop Intelligence** | AI recommends the best crops based on soil, water, acreage, season, and location |
| 🩺 **AI Crop Doctor** | Diagnose plant diseases from symptoms and get actionable remedies |
| 💊 **Input Advisor** | Get AI-guided fertilizer, pesticide, and irrigation recommendations |
| 🌤️ **Weather Intelligence** | Live weather from Open-Meteo with district-level Karnataka selectors |
| 🛡️ **Weather Protection** | AI risk assessment and mitigation plan based on live forecast |
| 📅 **Farm Calendar** | Seasonal activity planner aligned to Karnataka crop cycles |
| 💰 **Profit Simulator** | Estimate seasonal net revenue and farm profitability |
| 👥 **Farmer Community** | Connect with experienced peer farmers and share knowledge |
| 🔍 **Find a Farmer** | Match with farmers who grow the same crop in similar conditions |
| 🚜 **Labor Marketplace** | Hire verified farm labor crews with geo-distance matching |
| 🛒 **Farm Marketplace** | Browse crop listings and agribusiness procurement opportunities |
| 🏪 **Agricultural Services** | Locate nearby agro-dealers, equipment rentals, and processing units |
| 🐄 **Livestock AI** | AI-powered livestock health and management guidance |
| 🤝 **Business Opportunities** | Explore contract farming templates, government subsidies, and agribusiness tie-ups |
| 🌐 **Language Toggle** | Full English and ಕನ್ನಡ (Kannada) translation support |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           Bhoomi Mithra Frontend                │
│   Next.js 16 · TypeScript · Tailwind CSS        │
│   Cloudflare Pages (bhoomi-mithra.pages.dev)    │
└───────────────────────┬─────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────┐
│           Bhoomi Mithra AI Worker                │
│   Cloudflare Workers · TypeScript               │
│   farmconnect-ai-worker.bhoomi-mithra.workers.dev│
├────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌────────┐ │
│  │ Gemini 3.5  │  │ Cloudflare   │  │Open-   │ │
│  │ Flash AI    │  │ D1 SQLite DB │  │Meteo   │ │
│  └─────────────┘  └──────────────┘  └────────┘ │
└─────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS, shadcn/ui, Three.js |
| **Backend** | Cloudflare Workers (Edge Runtime) |
| **Database** | Cloudflare D1 (SQLite at the Edge) |
| **AI** | Google Gemini 3.5 Flash (single-shot, 600 token budget) |
| **Weather** | Open-Meteo Real-time Meteorological API |
| **Auth** | PBKDF2-based password hashing, JWT-style session tokens in D1 |
| **Deploy** | Cloudflare Pages (frontend) + Wrangler CLI (worker) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Cloudflare account** with Workers and D1 enabled
- **Google Gemini API key** — [Get one free at Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/rithwikkr0/Farmerconnectai.git
cd Farmerconnectai
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Worker dependencies
cd worker && npm install && cd ..
```

### 3. Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_WORKER_URL=http://localhost:8787
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GEMINI_API_KEY=your-gemini-api-key-here
```

Configure the worker for local development:
```bash
cp worker/.dev.vars.example worker/.dev.vars
```

Edit `worker/.dev.vars`:
```
GEMINI_API_KEY=your-gemini-api-key-here
```

### 4. Set Up Cloudflare D1 (Local)

```bash
cd worker

# Create local D1 database
npx wrangler d1 create bhoomi-mithra-db

# Apply schema
npx wrangler d1 execute bhoomi-mithra-db --local --file=schema.sql

# Seed demo data
npx wrangler d1 execute bhoomi-mithra-db --local --file=seed.sql
```

### 5. Run the Development Servers

**Terminal 1 — Worker (port 8787):**
```bash
cd worker
npm run dev
```

**Terminal 2 — Frontend (port 3000):**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Production Deployment

### Deploy the Cloudflare Worker

```bash
cd worker

# Set the Gemini API key as a Cloudflare secret (never hardcode it)
npx wrangler secret put GEMINI_API_KEY

# Apply D1 schema to production
npx wrangler d1 execute bhoomi-mithra-db --remote --file=schema.sql
npx wrangler d1 execute bhoomi-mithra-db --remote --file=seed.sql

# Deploy the worker
npx wrangler deploy
```

### Deploy the Frontend to Cloudflare Pages

```bash
# Build the production static export
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy out --project-name bhoomi-mithra
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health check |
| `POST` | `/api/auth/register` | Register a new farmer |
| `POST` | `/api/auth/login` | Login and get session token |
| `GET` | `/api/auth/me` | Get authenticated farmer profile |
| `POST` | `/api/auth/logout` | Invalidate session |
| `GET` | `/api/weather?location=Mandya` | Live weather (Open-Meteo) |
| `POST` | `/api/weather/advice` | AI weather risk advisory |
| `POST` | `/api/crops/recommend` | AI crop recommendations |
| `POST` | `/api/ai` | General Gemini AI endpoint (diagnosis, advice) |
| `GET` | `/api/labor/nearby` | Find nearby labor workers (geo-radius) |
| `POST` | `/api/labor/request` | Submit a labor hiring request |
| `GET` | `/api/marketplace` | Browse crop marketplace listings |
| `GET` | `/api/services` | Browse agricultural services |
| `POST` | `/api/farmers/match` | Match with peer farmers |

Full API examples: [worker/API_EXAMPLES.md](worker/API_EXAMPLES.md)

---

## 🔒 Security Notes

- **Gemini API key** is stored as a Cloudflare Worker Secret (never in source code).
- All `.env*` files are **gitignored** — use `.env.example` as a template.
- `worker/.dev.vars` is **gitignored** — use `worker/.dev.vars.example` as a template.
- Passwords are hashed with **PBKDF2-SHA256** (100,000 iterations) — never stored in plain text.
- Session tokens are stored in D1 and invalidated on logout.
- AI endpoints are **rate-limited** at 40 requests/minute per client IP.
- Gemini requests are **cached** in-memory (5-minute TTL) to reduce quota usage.

---

## 📊 Live Production Status

| Service | Status | Notes |
| :--- | :--- | :--- |
| Frontend | ✅ LIVE | Cloudflare Pages |
| Worker API | ✅ LIVE | Cloudflare Workers Edge |
| D1 Database | ✅ LIVE | Farmer profiles, labor, marketplace |
| Gemini AI | ✅ LIVE | `gemini-3.5-flash`, 600 token budget |
| Weather | ✅ LIVE | Open-Meteo Real-time API |
| Auth | ✅ LIVE | PBKDF2 + D1 session store |

---

## 🌱 Roadmap

- [ ] OTP-based mobile verification (via Twilio or AWS SNS)
- [ ] Regional market price feed integration (AGMARKNET API)
- [ ] Satellite NDVI crop health monitoring
- [ ] Offline-first Progressive Web App (PWA) support
- [ ] Voice input and audio responses in Kannada and Telugu

---

## 🙏 Acknowledgements

- [Google Gemini](https://ai.google.dev) — AI infrastructure
- [Open-Meteo](https://open-meteo.com) — Free real-time weather API
- [Cloudflare Workers + D1](https://workers.cloudflare.com) — Edge compute and database
- [shadcn/ui](https://ui.shadcn.com) — Accessible React component library
- [Three.js](https://threejs.org) — 3D farm terrain visualization

---

<div align="center">

**Bhoomi Mithra** · ಬೆಳಕಿನ ಮನೆ · Built with ❤️ for Indian Farmers

[🌐 Live Demo](https://bhoomi-mithra.pages.dev) · [⚡ API Health](https://farmconnect-ai-worker.bhoomi-mithra.workers.dev/api/health) · [📖 API Docs](worker/API_EXAMPLES.md)

</div>
