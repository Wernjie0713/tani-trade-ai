# TaniTrade AI

TaniTrade AI is a hackathon project for Malaysian smallholder farmers. It is an agentic agrotech platform that helps farmers barter surplus farm inputs for missing resources, then turn projected harvest into advance buyer commitments to unlock working capital before harvest.

This repository currently contains the prototype scaffold:

- `frontend/`: React + Vite + Tailwind CSS v4 + shadcn/ui
- `backend/`: FastAPI
- `database/auth`: Supabase

The product vision is larger than the current scaffold. The README below explains both the concept and the current implementation state.

## Problem

Malaysia faces food security pressure from import dependency and supply-chain volatility. At the same time, smallholder farmers often lose time and money because they:

- have surplus inputs they cannot easily convert into what they need
- face urgent planting-time shortages of fertilizer, pesticide, trays, labor, or seed
- only get paid after harvest, even when they need cash before harvest
- struggle with tools that are too manual, too text-heavy, or not localized for low-friction use

TaniTrade AI targets those two pre-harvest problems directly:

1. resource shortages during planting
2. cash-flow shortages before harvest

## Solution

TaniTrade AI turns a phone into an autonomous farm trading agent.

A farmer can describe what they have and what they need in natural language or voice. The system structures that input, finds nearby barter opportunities, estimates a fair trade ratio, and proposes a practical exchange. After planting, the platform estimates a likely harvest range and creates an advance harvest commitment listing for restaurants, grocers, or distributors.

In one line:

> TaniTrade AI turns surplus farm inputs into missing resources, then turns future harvest into early buyer commitment.

## Target Users

### Primary users

- smallholder farmers
- part-time farmers
- rural agro-operators with limited digital literacy

### Secondary users

- restaurants
- grocers
- food distributors
- cooperatives
- local produce buyers

### Tertiary users

- farmer groups
- village coordinators
- agricultural co-ops
- future NGO or government partners

## Core MVP Demo Loop

The recommended hackathon MVP is one magical end-to-end loop:

1. Farmer speaks or types a surplus + need statement.
2. AI extracts structured trade intent.
3. The system finds a nearby barter match.
4. AI proposes a fair barter ratio and meeting details.
5. Both parties confirm the trade.
6. The farmer records the planted crop.
7. AI estimates a harvest range and creates an advance harvest commitment listing.
8. A buyer reserves part of the projected harvest.

This is intentionally framed as an advance harvest commitment or reservation flow, not a regulated financial contract.

## Why AI Is Core

This project is not a normal marketplace with a chatbot layered on top. The AI is responsible for the core product behavior:

- converting voice or chat into structured farm intent
- understanding crop context, urgency, and quantities
- helping normalize messy farmer language into usable trade signals
- explaining fair-value trade proposals
- estimating harvest ranges from grounded data
- generating buyer-ready advance commitment listings

Without the AI layer, the core workflow breaks down into manual searching and negotiation. At the same time, not every part of the workflow should be delegated to an LLM. The actual barter decision still depends on real inventory, distance, trust, and price references, so the system uses deterministic backend rules for the final ranking and proposal math.

## Product Modules

- Farmer Intake Agent
  - voice/text to structured intent
  - crop, quantity, urgency, and location extraction
- Inventory and Demand Graph
  - farmer surplus inventory
  - farmer needs
  - planting and buyer demand context
- Barter Matching Agent
  - nearby counterparty discovery
  - barter opportunity ranking
- Valuation Engine
  - explainable fair-value ratio
  - transport and urgency adjustment
- Harvest Projection Agent
  - estimated output range
  - harvest window generation
- Buyer Commitment Agent
  - listing generation
  - reservation proposal generation
- Trust and Record Layer
  - trade history
  - commitment logs
  - simple reputation indicators

## Architecture

### Current repository stack

- Frontend: React 19, Vite, Tailwind CSS v4, shadcn/ui
- Backend: FastAPI
- Database/Auth: Supabase
- AI integration: Gemini API via backend services
- Local dev: Node.js + Python virtual environment

### Current AI implementation

The current backend is intentionally split into two layers:

- Gemini-backed AI services
  - farmer intake extraction from natural language
  - proposal explanation generation
  - harvest listing copy generation
- Deterministic backend services
  - inventory filtering from Supabase
  - distance calculation
  - match ranking
  - fair-value barter ratio math
  - meeting point selection
  - harvest projection math

This is deliberate. The barter engine is currently a structured retrieval and scoring problem more than an unstructured knowledge retrieval problem. A good barter match must respect actual stock, units, radius, trust score, and pricing references. Those are easier to explain, test, and defend in a hackathon demo when they are implemented as deterministic business rules.

### Why matching is deterministic instead of vector-first

The current implementation does not use vector search for the core barter match step. That choice is intentional:

- barter matching depends on exact availability, not just semantic similarity
- quantity, unit, distance, and trust need explicit rule-based scoring
- fair-value proposals should be explainable and repeatable
- hackathon demos benefit from deterministic behavior on seeded data

In other words, AI is used where language understanding and generation matter, while deterministic services are used where the system must make auditable trading decisions.

### Small RAG extension points

RAG is still valuable in this product, but as a narrow retrieval layer around the deterministic engine rather than a replacement for it. The most useful next places to apply a small RAG layer are:

- item synonym and alias retrieval
  - map BM/English/local farming terms like `racun organik`, `ubat serangga`, or `pesticide spray` to normalized inventory items
- buyer requirement retrieval
  - match harvest listings against restaurant, grocer, or distributor requirement notes
- crop and agronomy grounding
  - retrieve crop-cycle references, planting guides, and localized best-practice notes
- pricing and market context grounding
  - retrieve recent pricing references or market notes used to justify barter ratios and listing narratives

This would create a stronger hybrid story for the hackathon:

1. Gemini extracts the farmer's intent.
2. RAG retrieves relevant synonyms, buyer needs, and domain references.
3. Deterministic services rank the real barter opportunities.
4. Gemini explains the result in farmer-friendly language.

## Grounding and Possible RAG Data Sources

Current structured grounding already used by the backend:

- Supabase inventory rows
- market price references
- crop profiles
- meeting points
- trust scores
- location and distance metadata

Good candidates for a future small RAG layer:

- fertilizer and commodity pricing references
- local crop guides and planting-cycle information
- weather history and short-term forecast data
- historical yield assumptions by crop
- buyer requirement docs from restaurants, grocers, or distributors
- location and distance metadata for local matching

## Current Prototype Status

What is already implemented in this repository:

- route-based frontend farmer flow wired to the backend
- FastAPI farmer workflow endpoints from intake to harvest listing draft
- Supabase schema, seed data, and seeded demo identities
- Gemini-backed AI services for intake extraction, proposal explanation, and listing generation
- deterministic matching, valuation, and projection services
- local logging for AI request/fallback visibility

What is planned next for the MVP:

- small RAG layer for synonym retrieval, buyer requirement grounding, and agronomy/price context
- richer buyer-side workflows and reservation state changes
- optional voice transcription layer
- stronger external grounding sources for prices, weather, and buyer demand

## UX Principles

The intended product UX is:

- voice-first
- bilingual-friendly (Bahasa Malaysia and English)
- large-action-card based
- minimal text
- status-driven
- accessible for low-digital-literacy users

Suggested core screens:

- Home
- Voice capture
- Structured summary confirmation
- Match results
- Trade proposal
- Planting update
- Advance harvest listing
- Buyer reservation dashboard

## Repository Structure

```text
backend/
  app/
    api/
    core/
    db/
  requirements.txt

frontend/
  src/
    components/
    lib/
  package.json
```

## Local Setup

### Prerequisites

- Node.js 22+
- Python 3.11+
- a Supabase project

### Environment files

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

### Backend setup

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn app.main:app --reload --app-dir backend --port 8010
```

Backend URLs:

- API: `http://localhost:8010`
- Docs: `http://localhost:8010/docs`
- Health: `http://localhost:8010/api/v1/health`

### Frontend setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

- App: `http://localhost:5173`

## Environment Variables

### Backend

`backend/.env`

```env
APP_NAME=TaniTrade AI API
API_V1_PREFIX=/api/v1
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### Frontend

`frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8010/api/v1
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
```

## Demo Narrative

Recommended pitch line:

> Smallholder farmers lose money not only after harvest, but before planting, when they lack inputs and cash.

Recommended demo sequence:

1. Farmer speaks in BM or English.
2. AI extracts structured need and surplus.
3. The system finds a barter match.
4. AI proposes a fair exchange.
5. The barter is confirmed.
6. Planting is recorded.
7. AI creates an advance harvest commitment listing.
8. A buyer reserves a portion of the future harvest.

Closing line:

> TaniTrade AI does not just advise farmers. It acts for them.

## Risk / Scope Control

To keep the hackathon demo strong, the MVP should avoid:

- real payment rails
- legal contract complexity
- advanced logistics routing
- too many crop categories
- nationwide marketplace depth
- regulated lending behavior

The biggest risk is scope creep. The strongest demo is one clean barter loop plus one clean advance harvest commitment loop.

## AI-Generated Code Disclosure

Portions of this repository and documentation were created with AI assistance and then reviewed and edited by the team. The current implementation combines Gemini-backed language understanding and generation with deterministic backend matching and valuation logic. A future extension may add a narrow RAG layer for synonym retrieval, buyer requirement grounding, and external domain references.
