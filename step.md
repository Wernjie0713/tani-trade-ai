

# Harvest Module Implementation Steps (A+ Hackathon Roadmap)

This step-by-step guide is optimized for hackathon speed, parallel workflow, and a magical demo. It ensures you avoid last-minute blockers and that frontend/backend/AI can progress in parallel.

## 0. AI Prototyping (Pre-Requisite)

- Test Gemini extraction prompts for farmer voice input (BM/English) in Google AI Studio or a simple Python script.
- Finalize the expected JSON output structure for harvest listings, reservations, and requirements.
- Use this output to inform your Pydantic models and Firestore schema.
- done by creating file in backend/script/gemini_harvest_extraction_test.py
---


## 1. Backend Setup

### 1.1. Define Firestore Collections & Pydantic Models
- Create Pydantic models in:
  - `backend/app/schemas/harvest_listing.py` (ProjectedHarvestListing)
  - `backend/app/models/harvest_listing.py` (Firestore mapping for /harvest_listings)
  - `backend/app/models/reservation.py` (Firestore mapping for /harvest_listings/{id}/reservations)
  - `backend/app/models/buyer_requirement.py` (Firestore mapping for /buyer_requirements)
- Explicitly define Firestore collection paths in code and docstrings.


### 1.2. Implement Repository Layer
- Create `backend/app/repositories/harvest_listing.py` for CRUD operations on harvest listings, reservations, and requirements in Firestore (no SQLAlchemy/ORM).

### 1.3. Create Firebase Seed Script & Data
- Update `firebase/seed_data.json` and `backend/scripts/seed_firestore.py` to include dummy harvest_listings and buyer_requirements.
- Run the seeding script so frontend and backend can use real data structures from day one.

### 1.3. Implement Service Layer
- Create `backend/app/services/harvest.py` for business logic:
  - Creating/updating listings
  - Matching buyer requirements
  - Handling listing state transitions (DRAFT → PROJECTED → ...)
  - AI yield/timeline estimation (integrate with ai/orchestrator.py)
  - Prorating reservations and handling shortfalls/refunds (simulate via mock escrow)

### 1.4. Extend AI & Prompt Integration
- Update `backend/app/services/ai/orchestrator.py` and `ai/client.py` to support:
  - Harvest listing generation and yield estimation
  - Dual-language (BM/English) listing description generation or translation
- Abstract prompts into `backend/app/ai/prompts/harvest_prompts.py` for maintainability.

### 1.5. Create API Endpoints
- Create `backend/app/api/routes/harvest.py` with endpoints for:
  - Creating/updating harvest listings (farmer, voice-first preferred)
  - Browsing/searching listings (buyer)
  - Reserving a listing (buyer, with mock escrow commitment)
  - Posting buyer requirements
- Update `backend/app/api/router.py` to include the new harvest routes.
### 1.6. Implement Notification & Mock Escrow
- Create `backend/app/services/notifications.py` for user alerts (simulate Email/SMS/Push).
- Create `backend/app/services/mock_payment.py` to simulate deposit/escrow logic (no real payment rails).

---


## 2. Frontend Setup

### 2.1. Create API Utilities
- Create `frontend/src/lib/harvestApi.js` for calling backend harvest endpoints.

### 2.2. Implement Context/State Management
- Create or extend `frontend/src/context/HarvestContext.jsx` to manage harvest listing state and reservation status.


### 2.3. Build Buyer Marketplace Page (Seed Data First)
- Scaffold `frontend/src/pages/prototype/BuyerMarketplacePage.jsx` using only seed data (no backend dependency).
- Add reservation UI and "Funds Secured" badge using dummy/mock data.

### 2.4. Build Farmer Harvest Page (Static Layout First)
- Scaffold `frontend/src/pages/prototype/FarmerHarvestListingPage.jsx` with static layout and hardcoded data.
- Use static/dummy data for AI-generated notes and listing fields.

### 2.5. Integrate Voice & AI to Farmer Page
- Connect Google Speech-to-Text for voice input (BM/English).
- Wire up backend API calls for listing creation and AI fallback.
- Show AI-generated and translated listing notes; fallback to manual entry if AI fails.

### 2.6. Build Buyer Marketplace Page
- Extend `frontend/src/pages/prototype/BuyerMarketplacePage.jsx` to show both available and projected harvests.
- Add reservation functionality using `ReservationModal.jsx`.
- Display "Funds Secured" badge and mock escrow status for reserved listings.

### 2.7. Build Buyer Requirement Page
- Create `frontend/src/pages/prototype/BuyerRequirementPage.jsx` for buyers to post requirements.

### 2.8. Build Components
- Create `frontend/src/components/HarvestListingCard.jsx` for listing display.
- Create `frontend/src/components/MarketContextSidebar.jsx` for market data, price trends, and risk.
- Create `frontend/src/components/ReservationModal.jsx` for buyers to reserve harvests.
- Create `frontend/src/components/NotificationToast.jsx` for user alerts.

### 2.9. Update Routing
- Update `frontend/src/prototype/routes.js` to add new routes for harvest features.

---


## 3. Integration, Testing & Demo Readiness

### 3.1. Connect Frontend to Backend
- Ensure all frontend API calls work with backend endpoints.
- Test CRUD operations for listings, reservations, and requirements.
- Simulate reservation and escrow flows (no real payments).

### 3.2. Validate AI & Localization
- Confirm AI-generated yield, timeline, and listing notes appear as expected in both BM and English.
- Test fallback to manual entry if AI fails.


### 3.3. Rehearse the Golden Demo Path
- Rehearse the exact demo sequence:
  1. Voice input (BM/English)
  2. AI extraction
  3. Listing generation
  4. Buyer mock escrow reservation
- Ensure this loop runs flawlessly, end-to-end, with no manual intervention.

### 3.4. User Flow Testing (Voice-First)
- Farmer: Speak to create listing → See buyer reservations → View market context.
- Buyer: Browse listings → Reserve projected harvest (see "Funds Secured") → Post requirements.

### 3.4. Edge Cases & Error Handling
- Test with missing/invalid data, overlapping reservations, no buyer matches, and shortfall/refund scenarios.
- Test notification and dispute flows.

---


## 4. Documentation & Handover

- Update requirement.md and step.md as features are completed.
- Document API endpoints, Firestore collection paths, and data models.
- Add usage instructions for both farmer and buyer flows (emphasize voice-first and localization).
- Mark off each step for clear progress tracking and demo readiness.

---

This checklist is optimized for hackathon speed, MVP clarity, and a magical demo. Mark each step as you complete it!
