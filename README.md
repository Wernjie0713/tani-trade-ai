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
- finding barter opportunities with local constraints
- explaining fair-value trade proposals
- estimating harvest ranges from grounded data
- generating buyer-ready advance commitment listings

Without the AI layer, the core workflow breaks down into manual searching and negotiation.

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
- Local dev: Node.js + Python virtual environment

### Planned hackathon AI stack

The concept is designed to align with the Google AI ecosystem requirements of the hackathon:

- Gemini 2.0 Flash
  - fast voice/text parsing
  - farmer intake and structured extraction
- Gemini 2.0 Pro
  - deeper barter reasoning
  - listing generation and buyer-fit explanation
- Firebase Genkit or Vertex AI Agent Builder
  - orchestration of intake, matching, valuation, and projection agents
- Grounding / RAG layer
  - pricing data
  - weather data
  - crop-cycle references
  - buyer requirement documents

This repository does not yet implement the Google AI layer. It currently provides the product scaffold where those agents will be integrated.

## RAG / Grounding Data Sources

Planned grounding sources for the hackathon demo:

- fertilizer and commodity pricing references
- local crop guides and planting-cycle information
- weather history and short-term forecast data
- historical yield assumptions by crop
- buyer requirement docs from restaurants, grocers, or distributors
- location and distance metadata for local matching

## Current Prototype Status

What is already implemented in this repository:

- frontend scaffold with a mobile-first landing/dashboard shell
- backend FastAPI service with a health endpoint
- Supabase configuration wiring for frontend and backend
- local development setup for the fullstack app

What is planned next for the MVP:

- farmer voice/text intake flow
- structured summary confirmation screen
- barter match results and proposal generation
- planting record submission
- advance harvest commitment listing flow
- buyer reservation dashboard

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
uvicorn app.main:app --reload --app-dir backend
```

Backend URLs:

- API: `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/v1/health`

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
```

### Frontend

`frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
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

Portions of this repository scaffold and documentation were created with AI assistance and then reviewed and edited by the team. The current local scaffold was generated with AI-assisted coding support, while the intended product intelligence for the hackathon demo is planned around Google's Gemini ecosystem and grounded retrieval workflows.
