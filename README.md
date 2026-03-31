# TaniTrade AI

TaniTrade AI is a hackathon project for Malaysian smallholder farmers. It is an agentic agrotech platform that helps farmers barter surplus farm inputs for missing resources, then turn projected harvest into advance buyer commitments to unlock working capital before harvest.

This repository currently contains a working MVP:

- `frontend/`: React + Vite + Tailwind CSS v4 + shadcn/ui
- `backend/`: FastAPI
- `database`: Firebase Firestore

The product vision is larger than the current MVP. The README below explains both the concept and the current implementation state.

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
- Database: Firebase Firestore via Firebase Admin SDK
- AI integration: Gemini API via backend services
- Voice transcription: Google Cloud Speech-to-Text V2
- Local dev: Node.js + Python virtual environment

### Current AI implementation

The current backend is intentionally split into two layers:

- Gemini-backed AI services
  - farmer intake extraction from natural language
  - proposal explanation generation
  - harvest listing copy generation
- Deterministic backend services
  - inventory filtering from Firestore
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

- Firestore inventory documents
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

## Current MVP Status

What is already implemented in this repository:

- separated farmer and buyer route flows
- working farmer flow from intake to published harvest listing
- inline parsed-summary editing with backend persistence
- Firebase seed data and seeded demo identities
- Gemini-backed AI services for intake extraction, proposal explanation, and listing generation
- Google Speech-to-Text voice input for farmer intake
- deterministic matching, valuation, and projection services
- publish flow for harvest listings
- local logging for AI and speech request/fallback visibility

This should be presented as a working MVP rather than a static prototype. New farmer actions are processed live through the backend and persisted in Firebase, while counterparty supply and buyer interest remain seeded to keep the hackathon demo reliable.

What is planned next for the MVP:

- small RAG layer for synonym retrieval, buyer requirement grounding, and agronomy/price context
- richer buyer-side workflows and reservation state changes
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
  scripts/
  requirements.txt

firebase/
  seed_data.json

frontend/
  src/
    components/
    lib/
  package.json
```

## Quick Setup

For local onboarding, environment setup, Firestore seeding, Speech-to-Text enablement, and smoke-test steps, see [QUICK_SETUP.md](./QUICK_SETUP.md).

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
