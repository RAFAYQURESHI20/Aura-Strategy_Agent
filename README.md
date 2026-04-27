# ✨ Aura Strategy

> **AI-powered marketing strategy generator.** Enter your product details and let a crew of specialized AI agents research, analyze, and craft a complete go-to-market plan — from audience segmentation to budget allocation.

---

## 🔗 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [CrewAI Agents & Tasks](#crewai-agents--tasks)
- [Screenshots](#screenshots)
- [Development](#development)
- [License](#license)

---

## Overview

Aura Strategy is a full-stack application that combines a modern React frontend with a CrewAI-powered backend to deliver comprehensive marketing strategies. Users provide product details (name, description, target audience, budget) and receive structured, actionable plans including:

- Audience segmentation & personas
- Competitor landscape analysis
- Channel strategy recommendations
- Content plan & calendar
- Ad copy examples
- Budget allocation breakdown
- 12-month growth milestones

The backend leverages a multi-agent CrewAI system with specialized roles (Head of Marketing, Content Creator, Blog Writer, SEO Specialist) orchestrated via YAML configurations and powered by Gemini 2.0 Flash.

---

## Key Features

- 🤖 **AI Strategy Generation** — CrewAI multi-agent system researches and synthesizes marketing plans
- 🔍 **Audience Analysis** — Automatic segmentation with demographic & psychographic profiles
- 🏆 **Competitor Analysis** — Web search via SerpApi identifies key players and gaps
- 📺 **Channel Strategy** — Multi-channel recommendations (SEO, paid social, community, email)
- 📝 **Content Plan** — Weekly calendars with blog, reel, and social post planning
- 📢 **Ad Copy** — Funnel-stage ad frameworks with headlines, CTAs, and social proof
- 💰 **Budget Allocation** — Percentage-based monthly budget breakdown
- 📈 **Growth Plan** — Phased 12-month milestones with KPI targets
- 💾 **Session History** — Saved strategies with sidebar navigation and deletion
- ✨ **Animated UI** — Framer Motion transitions, Three.js particle background, glowing neon accents
- 📱 **Responsive Design** — Tailwind CSS + shadcn/ui components

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui** | Accessible UI components (Radix UI based) |
| **Framer Motion** | Layout animations & transitions |
| **Three.js / React Three Fiber** | 3D particle background |
| **TanStack Query (React Query)** | Server state & caching |
| **React Router** | Client-side routing |
| **Zod** | Schema validation |
| **Vitest** | Unit testing |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.10+** | Runtime |
| **FastAPI** | REST API framework |
| **CrewAI** | Multi-agent orchestration |
| **Gemini 2.0 Flash** | LLM for planning & reasoning |
| **SerpApi** | Web search integration |
| **Pydantic** | Data validation & serialization |
| **Uvicorn** | ASGI server |
| **PyYAML** | Agent & task configuration |

---

## Architecture

```
┌─────────────────┐      HTTP/REST       ┌─────────────────────────────┐
│   React Client  │ ◄──────────────────► │      FastAPI Backend        │
│  (Port 5173)    │                      │       (Port 8000)           │
└─────────────────┘                      └─────────────────────────────┘
  - Particle Background                             - Pydantic Models
  - Framer Motion UI                                - CORS Middleware
  - TanStack Query                                  - Strategy Parser
  - shadcn/ui Components                            └──────────┬──────────┘
                                                               │
                                                    ┌──────────▼──────────┐
                                                    │    MarketingCrew    │
                                                    │   (CrewAI System)   │
                                                    └──────────┬──────────┘
                                                               │
                               ┌───────────────┬───────────────┼───────────────┐
                               ▼               ▼               ▼               ▼
                    ┌─────────────┐  ┌──────────────┐ ┌────────────┐ ┌────────────┐
                    │ Head of     │  │ Social Media │ │  Blog      │ │  SEO       │
                    │  Marketing  │  │   Creator    │ │  Writer    │ │ Specialist │
                    └─────────────┘  └──────────────┘ └────────────┘ └────────────┘
                           │                 │               │               │
                           └──────────┬──────┴───────────────┴───────────────┘
                                      │
                             ┌────────▼────────┐
                             │  Gemini 2.0     │
                             │      Flash      │
                             └─────────────────┘
```

---

## Project Structure

```
aura-strategy/
├── public/                          # Static assets
│
├── src/                             # React frontend source
│   ├── components/
│   │   ├── ui/                      # 50+ shadcn/ui components
│   │   ├── HeroSection.tsx          # Landing page hero
│   │   ├── StrategyInput.tsx        # Product info form
│   │   ├── StrategyResults.tsx      # Strategy display cards
│   │   ├── ThinkingAnimation.tsx    # AI processing animation
│   │   ├── HistorySidebar.tsx       # Saved strategies sidebar
│   │   └── ParticleBackground.tsx   # Three.js particle bg
│   ├── pages/
│   │   ├── Index.tsx                # Main application page
│   │   └── NotFound.tsx             # 404 page
│   ├── services/
│   │   ├── api.ts                   # HTTP client (GET, POST, error handling)
│   │   └── strategyApi.ts           # Strategy-specific API calls
│   ├── types/
│   │   └── strategy.ts              # Strategy & StrategyRequest interfaces
│   ├── hooks/                       # Custom React hooks (use-mobile, use-toast)
│   ├── lib/
│   │   └── utils.ts                 # cn() and helpers
│   ├── App.tsx                      # Root component with QueryClient + Router
│   └── main.tsx                     # React entry point
│
├── aura-strategy_backend/           # Python FastAPI backend
│   ├── main.py                      # FastAPI app, endpoints, response parser
│   ├── Crew.py                      # MarketingCrew class (agents, tasks, crew)
│   ├── Config/
│   │   ├── Agent.yaml               # Agent definitions (roles, goals, backstories)
│   │   └── Tasks.yaml               # Task definitions (descriptions, expected outputs)
│   ├── requirements/
│   │   └── requirements.txt         # Python dependencies
│   └── resources/
│       └── drafts/                  # Generated content drafts (blogs, posts, reels)
│
├── package.json                     # Frontend dependencies & scripts
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind theme, fonts, animations
├── tsconfig.json                    # TypeScript configuration
├── vitest.config.ts                 # Vitest test configuration
└── README.md                        # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (with npm or [Bun](https://bun.sh))
- **Python** 3.10+
- **SerpApi API key** — [Get one free](https://serpapi.com/manage-api-key)
- **Google Gemini API key** — [Get one free](https://aistudio.google.com/app/apikey)

---

### Installation

#### 1. Clone the repository

```bash
git clone <repo-url>
cd aura-strategy
```

#### 2. Install frontend dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

#### 3. Install backend dependencies

```bash
cd aura-strategy_backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements/requirements.txt
```

---

### Environment Variables

Create a `.env` file inside `aura-strategy_backend/`:

```env
# Required: SerpApi key for web search
SERPER_API_KEY=your_serpapi_key_here

# Required: Google Gemini API key (used implicitly by CrewAI LLM config)
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Note:** The frontend reads `VITE_API_URL` from environment variables. The default fallback is `http://localhost:8000`, so no frontend `.env` is required for local development unless you run the backend on a different port.

---

## Running the Application

You need **both** the backend and frontend running simultaneously.

### Terminal 1 — Backend

```bash
cd aura-strategy_backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
python main.py
```

The FastAPI server will start at:
- API root: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

### Terminal 2 — Frontend

```bash
# From project root
cd ..
bun dev       # or npm run dev
```

The Vite dev server will start at:
- Frontend app: `http://localhost:5173`

---

## API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | `GET` | Health check — returns `status: ok` |
| `/api/strategy/generate` | `POST` | Generate a marketing strategy |

### `POST /api/strategy/generate`

#### Request Body
```json
{
  "product_name": "AI Powered Learning Management System",
  "product_description": "An AI-powered LMS designed to help SMEs create...",
  "target_audience": "Small and Medium Enterprises (SMEs)",
  "budget": "Rs. 50000"
}
```

#### Response Body
```json
{
  "audience": {
    "summary": "...",
    "segments": ["Primary: ...", "Secondary: ..."]
  },
  "competitors": {
    "summary": "...",
    "names": ["Direct: ...", "Indirect: ..."]
  },
  "channels": {
    "summary": "...",
    "list": ["Content Marketing — 30%", "Paid Social — 25%", "..."]
  },
  "content": {
    "summary": "...",
    "types": ["Weekly blog posts", "Bi-weekly videos", "..."]
  },
  "adCopy": {
    "summary": "...",
    "examples": ["🚀 Headline: ...", "💡 Value prop: ...", "..."]
  },
  "budget": {
    "summary": "...",
    "breakdown": ["Content & SEO: 25%", "Paid Ads: 35%", "..."]
  },
  "growth": {
    "summary": "...",
    "milestones": ["Month 1-3: ...", "Month 3-6: ...", "..."]
  }
}
```

---

## CrewAI Agents & Tasks

### Agents

| Agent | Role | Tools | Description |
|-------|------|-------|-------------|
| **Head of Marketing** | Strategy lead | SerpApi, ScrapeWebsite | Researches market, creates strategy |
| **Social Media Creator** | Content creator | SerpApi, ScrapeWebsite, FileWriter | Creates posts, reels, calendars |
| **Blog Writer** | Content writer | SerpApi, FileWriter | Researches and drafts SEO blogs |
| **SEO Specialist** | SEO expert | FileRead, FileWriter | Optimizes blogs for search engines |

### Task Pipeline

1. **Market Research** — Analyze trends, competitors, customer needs
2. **Marketing Strategy** — Define audience, channels, weekly plan, KPIs
3. **Content Calendar** — One-week schedule with topics, formats, and publishing dates
4. **Post Drafts** — LinkedIn, Twitter, Instagram, and email campaign drafts
5. **Reel Scripts** — Instagram reel scripts with hooks, messages, and CTAs
6. **Blog Research** — Keywords, competitor blogs, suggested topics
7. **Blog Drafts** — Full blog posts saved to `resources/drafts/blogs/`
8. **SEO Optimization** — Meta descriptions, keywords, internal links

---



## Development

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `bun dev` / `npm run dev` | Start Vite dev server |
| `bun run build` / `npm run build` | Production build |
| `bun run lint` / `npm run lint` | Run ESLint |
| `bun run test` / `npm run test` | Run Vitest tests |
| `bun run preview` / `npm run preview` | Preview production build |

### Backend Scripts

| Command | Description |
|---------|-------------|
| `python main.py` | Start FastAPI with auto-reload |
| `uvicorn main:app --host 0.0.0.0 --port 8000` | Start with Uvicorn directly |

### Running Tests

```bash
# Frontend tests
bun run test

# Backend tests (if added)
pytest
```

---

## License

[MIT](LICENSE) © Aura Strategy Contributors

# aura-strategy
# aura-strategy
