# BHOOMI MITHRA

## ಬೆಳಕಿನ ಮನೆ

**Bhoomi Mithra** is an AI-powered agricultural ecosystem designed to help farmers understand their farm, weather, crops, resources, people, livestock and markets through one connected interface.

The platform combines a **Next.js + TypeScript frontend**, **Cloudflare Worker backend**, **Google Gemini AI**, live weather data from **Open-Meteo**, a centralized API layer, farm-context persistence, and Stitch-inspired Three.js visual experiences.

---

## Product Vision

Bhoomi Mithra brings agricultural intelligence into a single farmer-focused workflow:

> **Understand the farm → understand the conditions → make better decisions → connect with people and resources → act.**

The product is designed around practical decision support rather than pretending that AI can guarantee outcomes.

---

## 18 Core Experiences

| # | Route | Feature |
|---|---|---|
| 01 | `/` | Bhoomi Mithra Splash Experience |
| 02 | `/setup` | Set Up Your Farm |
| 03 | `/dashboard` | Farm Command Center |
| 04 | `/copilot` | Bhoomi Mithra AI Copilot |
| 05 | `/crops` | Crop Intelligence |
| 06 | `/crop-doctor` | AI Crop Doctor |
| 07 | `/input-advisor` | AI Input Advisor |
| 08 | `/weather` | Weather Intelligence |
| 09 | `/weather-protection` | Weather Protection Center |
| 10 | `/calendar` | AI Farm Calendar |
| 11 | `/profit` | Farm Profit Simulator |
| 12 | `/community` | Farmer Community |
| 13 | `/farmers` | Find a Farmer Who Can Help Me |
| 14 | `/labor` | Farm Labor Marketplace |
| 15 | `/marketplace` | Farm Marketplace / Buyers |
| 16 | `/services` | Nearby Agricultural Services |
| 17 | `/livestock` | Livestock AI Ecosystem |
| 18 | `/business` | Business / Company Opportunities |

---

## Key Capabilities

### AI Agricultural Copilot
- Farm-aware conversational assistance
- Crop and farm planning questions
- Weather-risk interpretation
- Agricultural decision support
- Suggested prompts and structured responses
- Voice-oriented interaction UI

### Crop Intelligence
- Location-aware crop recommendations
- Soil, water, land-size and season context
- Suitability scoring and explanations
- Risk and water considerations

### AI Crop Doctor
- Crop image upload/camera workflow
- AI-assisted symptom analysis
- Possible issues and next steps
- Prevention guidance
- Agricultural safety notices

### AI Input Advisor
- Crop and growth-stage context
- Soil and observed-issue inputs
- Budget-aware guidance where supported
- NPK/input planning and weather-aware timing

### Weather Intelligence
- Location geocoding
- Current weather telemetry
- Rainfall, humidity, wind and temperature
- 5-day forecast information
- Weather data currently sourced from Open-Meteo when available

### Weather Protection
- Weather-risk interpretation
- Preventive checklists
- Drainage and crop-protection actions
- Emergency labor dispatch workflow

### Farm Calendar
- Planting, irrigation, fertilizer and harvesting tasks
- Weather-sensitive reminders
- Completion tracking
- Client-side persistence when server persistence is unavailable

### Farm Profit Simulator
Core financial arithmetic is deterministic JavaScript/TypeScript logic for:
- Total cost
- Expected yield
- Expected revenue
- Estimated profit
- ROI
- Break-even price

Gemini is used for scenario explanations rather than core arithmetic.

### Farmer-to-Farmer Matching
- Crop/problem matching
- Location and radius filtering
- Deterministic candidate filtering
- AI ranking/explanation where available
- Demo-data labeling when the underlying farmer registry is not live

### Labor Marketplace
- Nearby worker discovery
- Radius filtering
- Skill filters
- Availability information
- Labor request/dispatch workflow

### Marketplace
- Produce
- Seeds
- Bio-inputs
- Machinery
- Category and price filtering

### Agricultural Services
Designed for discovery of:
- Tractors and machinery
- Transport
- Drone spraying
- Soil testing
- Agricultural experts
- Veterinary services
- Input suppliers

### Livestock AI
Supports decision-support workflows for:
- Cattle
- Buffalo
- Goats
- Sheep
- Poultry

### Business Opportunities
Designed for agriculture ecosystem connections such as:
- Contract farming
- Export procurement
- Bulk purchasing
- Machinery/dealership opportunities
- Input companies
- Agricultural schemes and business programs

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind/CSS design system
- Responsive desktop/tablet/mobile layouts
- Google Material Symbols
- Sora / Plus Jakarta Sans / Space Mono typography

### Backend
- Cloudflare Workers
- TypeScript
- Centralized Worker API layer
- D1-ready persistence architecture

### AI
- Google Gemini
- Centralized Gemini service
- Server-side API key handling
- Structured agricultural AI tasks

### Weather
- Open-Meteo geocoding and forecast APIs

### Visual Experience
- Three.js
- 3D AI core orb
- Perspective agricultural grid
- Digital twin farm terrain
- Responsive visual effects

---

## API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /api/health` | Worker health/status |
| `POST /api/ai` | General Gemini-powered AI tasks |
| `GET /api/weather` | Weather and forecast data |
| `POST /api/weather/advice` | Weather protection recommendations |
| `POST /api/crops/recommend` | Crop recommendations |
| `POST /api/farmers/match` | Farmer matching |
| `GET /api/labor/nearby` | Nearby labor search |
| `POST /api/labor/request` | Labor request/dispatch |
| `GET /api/marketplace` | Marketplace listings and filters |

The frontend uses a centralized API client rather than scattering raw API requests throughout pages.

---

## Data Transparency

Bhoomi Mithra deliberately distinguishes real external data, AI-generated analysis and demo datasets.

Current architecture includes:

| Feature | Current State |
|---|---|
| Weather | Live external data via Open-Meteo when available |
| Gemini AI | Server-side integration; requires a valid Gemini credential |
| Farmers | Demo registry unless connected to a persistent/verified data source |
| Labor | Demo registry unless connected to a persistent/verified data source |
| Marketplace | Demo listings unless connected to a persistent/verified data source |
| Agricultural Services | Demo directory unless connected to a verified provider source |
| Business Opportunities | Demo/informational content unless connected to verified opportunity data |

**Demo content must not be presented as verified real-world users, companies, buyers, workers or offers.**

---

## Safety Principles

AI features are designed as **decision support**, not guaranteed professional conclusions.

The application should not claim:
- Definitive crop disease diagnosis
- Guaranteed treatment success
- Guaranteed yield or profit
- Guaranteed weather outcomes
- Definitive veterinary diagnosis
- Unsafe or unsupported pesticide/fertilizer prescriptions

Where appropriate, the UI presents uncertainty and agricultural/veterinary safety guidance.

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the Next.js frontend

```bash
npm run dev
```

### 3. Start the Cloudflare Worker locally

```bash
cd worker
npx wrangler dev --port 8787
```

### 4. Local Worker secret

Create `worker/.dev.vars` and configure:

```text
GEMINI_API_KEY=YOUR_KEY
```

Do **not** commit this file.

### 5. Frontend Worker URL

Use the local Worker URL during development:

```text
NEXT_PUBLIC_WORKER_URL=http://localhost:8787
```

For production, point the frontend to the deployed Cloudflare Worker URL.

---

## Verification Commands

Frontend type check:

```bash
npm run type-check
```

Frontend production build:

```bash
npm run build
```

Worker type check:

```bash
cd worker
npx tsc --noEmit
```

Cloudflare deployment from the Worker directory:

```bash
npx wrangler deploy
```

Production secret configuration:

```bash
npx wrangler secret put GEMINI_API_KEY
```

Never print or commit secret values.

---

## Cloudflare Architecture

```text
Bhoomi Mithra Next.js App
        |
        v
Centralized API Client
        |
        v
Cloudflare Worker
   |      |      |
   |      |      +--> Marketplace / Labor / Farmer logic
   |      |
   |      +---------> Open-Meteo Weather
   |
   +----------------> Google Gemini
        |
        v
     D1-ready data layer
```

D1 schema support is prepared for future persistent farmer, labor, marketplace and agricultural-service records.

---

## Demo Story

A polished hackathon walkthrough can follow this sequence:

```text
Bhoomi Mithra Splash
        ↓
ಬೆಳಕಿನ ಮನೆ
        ↓
Set Up Your Farm
        ↓
Farm Command Center
        ↓
Ask Bhoomi Mithra AI
        ↓
“What should I grow this season?”
        ↓
Crop Intelligence
        ↓
Weather Intelligence
        ↓
“Heavy rain is coming. What should I do?”
        ↓
Weather Protection
        ↓
AI Crop Doctor
        ↓
Find a Farmer Who Can Help Me
        ↓
Farm Labor
        ↓
Marketplace
        ↓
Business Opportunities
```

---

## Project Status

The project has:

- 18 integrated product screens
- Stitch-based visual system converted to React
- Responsive application shell and navigation
- Three.js visual experiences
- Cloudflare Worker backend
- Gemini AI integration
- Live Open-Meteo weather integration
- Deterministic profit calculations
- Centralized API contracts
- API validation and error handling
- Demo-data transparency
- Production deployment workflow on Cloudflare

The next major engineering step is to replace priority demo registries with verified persistent data where appropriate, while keeping the current UI and API contracts stable.

---

## Repository

GitHub: `https://github.com/rithwikkr0/Farmerconnectai`

Default branch: `main`

---

## Brand

# BHOOMI MITHRA
## ಬೆಳಕಿನ ಮನೆ

Built as a connected agricultural intelligence platform for farmers and the wider farming ecosystem.
