# Harvest Module Requirements

## Overview

The Harvest module connects farmers and buyers for advance harvest commitments and post-harvest sales. It enables farmers to list projected harvests, buyers to reserve or purchase, and both parties to make informed decisions using AI-powered projections and market data.

---

## For Farmers

### 1. Turn Projected Harvest into Advance Buyer Commitments

- **Feature:** After recording a planting, the farmer can create a “Projected Harvest Listing.”
- **Purpose:** Listing is visible to buyers, who can reserve a portion before harvest, giving the farmer early commitment and potential cash flow.
- **UI/Flow:**
  - Farmer speaks (in BM or English) e.g., "I just planted 2 acres of chili yesterday".
  - Google Speech-to-Text transcribes the input.
  - AI extracts crop, expected quantity, and estimated harvest date from the spoken input.
  - System generates a listing visible to buyers.
  - Farmer can see which buyers have reserved portions and for what price.

### 2. Use AI to Estimate Harvest Ranges and Generate Listings

- **Feature:** When creating a projected harvest, the system uses AI to:
  - Estimate likely harvest quantity (e.g., 80–120kg).
  - Suggest optimal harvest window (dates).
  - Auto-generate a buyer-facing listing description.
- **UI/Flow:**
  - Farmer provides info by voice (preferred) or text (fallback).
  - AI fills in estimated yield, timeline, and a suggested listing note.
  - AI generates listing descriptions in both Bahasa Malaysia and English, or translates as needed for the target user (farmer/buyer).

### 3. Show Market Context, Price References, and Risk Projections

- **Feature:** The platform displays:
  - Recent market prices for the crop.
  - Risk factors (e.g., weather, historical yield variability).
  - Price trends or volatility.
- **UI/Flow:**
  - Farmer sees a dashboard or sidebar with market data and risk indicators when creating or reviewing a listing.

### 4. Match Buyer Requirements to Projected Harvests

- **Feature:** The system highlights when a projected harvest matches active buyer requirements.
- **UI/Flow:**
  - Farmer sees “X buyers are looking for this crop in your window/region.”
  - Can prioritize or negotiate with interested buyers.

---

## For Buyers

### 1. Reserve Projected Harvests (Advance Commitment)

- **Feature:** Buyers can browse upcoming harvests and reserve a portion before it’s harvested.
- **UI/Flow:**
  - Buyer sees listings with estimated yield, harvest date, and price.
  - Can reserve a quantity, possibly with a deposit or commitment.
  - Receives updates as harvest approaches.

### 2. Buy Already-Harvested Crops

- **Feature:** Buyers can also purchase crops that have already been harvested and listed.
- **UI/Flow:**
  - Buyer sees “Available Now” listings.
  - Can purchase immediately, arrange pickup/delivery.

### 3. See Market Context and Price References

- **Feature:** Buyers see:
  - Recent price trends for crops.
  - Comparison to their reservation price.
- **UI/Flow:**
  - Market data shown alongside listings for informed decision-making.

### 4. Submit Requirements for Matching

- **Feature:** Buyers can post requirements (e.g., “I need 100kg chili in July”).
- **UI/Flow:**
  - System matches these requirements to projected harvests and notifies both parties.

---

## Implementation File Structure

### Backend (FastAPI)

- **Models/Schemas:**  
  - `backend/app/schemas/harvest_listing.py`
- **Database/Repository:**  
  - `backend/app/repositories/harvest_listing.py`
- **Services:**  
  - `backend/app/services/harvest.py`
  - (Extend) `ai/orchestrator.py`, `ai/client.py`
- **API Routes:**  
  - `backend/app/api/routes/harvest.py`
- **Main Router:**  
  - Update `backend/app/api/router.py`

### Frontend (React)

- **Pages:**  
  - `frontend/src/pages/prototype/FarmerHarvestListingPage.jsx`
  - `frontend/src/pages/prototype/BuyerMarketplacePage.jsx`
  - `frontend/src/pages/prototype/BuyerRequirementPage.jsx`
- **Components:**  
  - `frontend/src/components/HarvestListingCard.jsx`
  - `frontend/src/components/MarketContextSidebar.jsx`
  - `frontend/src/components/ReservationModal.jsx`
- **Context/State:**  
  - `frontend/src/context/HarvestContext.jsx`
- **API Utilities:**  
  - `frontend/src/lib/harvestApi.js`
- **Routing:**  
  - Update `frontend/src/prototype/routes.js`

---

## Critical Business Logic & Edge Cases

### 1. Yield Shortfalls
- **Scenario:** If the AI projects 100kg, a buyer reserves 100kg, but the actual harvest yields only 60kg (e.g., due to weather).
- **Requirement:**
  - System must support prorating reservations, refunding deposits (simulated via mock escrow), or prioritizing buyers (e.g., first-come, first-served or by contract terms).
  - UI must clearly communicate estimated vs. actual yield and any shortfall handling.

### 2. Quality Control & Disputes
- **Scenario:** Buyer receives reserved harvest, but quality is unsatisfactory.
- **Requirement:**
  - Add a flow for dispute resolution or quality grading upon harvest.
  - Allow buyers to rate/flag a delivery; farmers can respond or appeal.

### 3. Listing Status Lifecycle
- **Requirement:**
  - Explicitly define HarvestListing states: DRAFT → PROJECTED → PARTIALLY_RESERVED → FULLY_RESERVED → HARVESTED → COMPLETED / CANCELLED.
  - State determines available actions (edit, reserve, mark as harvested, etc.) and UI display.

---

## Technical & Architecture Additions


### 1. Database Models (Firestore/Pydantic)
- Use Firestore as the database (no SQLAlchemy/ORM). Define Pydantic models that map directly to Firestore collections:
  - `backend/app/models/harvest_listing.py` (maps to /harvest_listings)
  - `backend/app/models/reservation.py` (maps to /harvest_listings/{id}/reservations)
  - `backend/app/models/buyer_requirement.py` (maps to /buyer_requirements)
  - Explicitly define collection paths in code and documentation.

### 2. Notification Infrastructure
- Backend: `backend/app/services/notifications.py` (Email/SMS/Push logic)
- Frontend: `frontend/src/components/NotificationToast.jsx` or notification center for user alerts.

### 3. Mock Commitment / Escrow System
- If buyers make deposits/commitments:
  - Add `backend/app/services/mock_payment.py` to simulate a deposit being held in "TaniTrade Escrow" (no real payment rails).
  - UI: Show a success spinner and a "Funds Secured" badge when a reservation is made. Simulate refunds and receipts for demo purposes only.

### 4. AI Prompt Management
- Abstract LLM prompts into `backend/app/ai/prompts/harvest_prompts.py` for maintainability.
- Ensure prompts support dual-language (BM/English) generation for listing descriptions and summaries.

---

## UX/UI Refinements

### 1. Contract/Receipt Generation
- Generate a digital contract or PDF receipt for each advance commitment, outlining price, quantity, and estimated delivery.

### 2. Mobile-First & Voice-First for Farmers
- Ensure `FarmerHarvestListingPage.jsx` and related flows are mobile-responsive, touch-friendly, and optimized for voice-first input (minimal text entry).

### 3. AI Fallbacks
- If AI fails to generate an estimate, allow seamless manual entry for yield, timeline, and listing note so farmers are never blocked.
- Always provide a fallback to text entry, but encourage voice as the primary UX for farmers.

---

## Summary Table

| Feature/Area                | Backend Files                                                                 | Frontend Files                                  |
|-----------------------------|--------------------------------------------------------------------------------------|-------------------------------------------------|
| Harvest listing CRUD        | schemas/harvest_listing.py, repositories/harvest_listing.py, services/harvest.py, api/routes/harvest.py, models/harvest_listing.py | pages/prototype/FarmerHarvestListingPage.jsx, components/HarvestListingCard.jsx |
| Buyer reservation           | services/harvest.py, api/routes/harvest.py, models/reservation.py                      | components/ReservationModal.jsx                 |
| Market context/risk         | services/harvest.py (or new), api/routes/harvest.py                                    | components/MarketContextSidebar.jsx             |
| Buyer requirements          | schemas/harvest_listing.py, repositories/harvest_listing.py, api/routes/harvest.py, models/buyer_requirement.py | pages/prototype/BuyerRequirementPage.jsx        |
| Routing/state               | api/router.py                                                                          | prototype/routes.js, context/HarvestContext.jsx |
| API utilities               | —                                                                                      | lib/harvestApi.js                               |
| Notification system         | services/notifications.py                                                              | components/NotificationToast.jsx                |
| Mock payment/escrow         | services/mock_payment.py                                                               | —                                               |
| AI prompt management        | ai/prompts/harvest_prompts.py                                                          | —                                               |

---

This requirements document should guide your implementation and keep the project organized as you build out the Harvest module.
