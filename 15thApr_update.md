# TaniTrade AI: Project Update (15th April 2026)

This document provides a clear overview of the current system state, the end-to-end UI flows for both Farmers and Buyers, and a streamlined guide for local setup.

---

## 1. System Overview

TaniTrade AI is an agentic agrotech platform helping Malaysian smallholder farmers manage resource shortages and cash flow. The system uses AI (Gemini) to process natural language/voice into structured trade intent and deterministic backend logic to rank barter opportunities and project harvest yields.

### Core Modules
- **Farmer Intake**: Voice/Text processing via Google STT and Gemini.
- **Barter Matching**: Deterministic ranking of local resource matches.
- **Harvest Projection**: Estimating future yield based on planting data.
- **Buyer Marketplace**: Advance harvest commitment and reservation system.

---

## 2. Current UI Flows

The platform is divided into two distinct role-based flows.

### A. Farmer Flow: "From Barter to Harvest"
This flow is fully persistent and writes to Firestore.

1.  **Landing (`/`)**: Select **"I'm Farmer"**.
2.  **Voice/Text Intake (`/farmer/voice-input`)**: Speak or type what you have (surplus) and what you need.
3.  **Parsed AI Summary (`/farmer/parsed-summary`)**: Review and edit the structured data extracted by AI.
4.  **Nearby Barter Matches (`/farmer/nearby-matches`)**: View local farmers with matching resource needs/surplus.
5.  **AI Trade Proposal (`/farmer/ai-trade-proposal`)**: Review the AI-generated trade ratio and logistics.
6.  **Trade Confirmation (`/farmer/trade-confirmation`)**: Accept the trade proposal.
7.  **Record Planting (`/farmer/record-planting`)**: Log your planting activity (crop type, area, date) after the trade.
8.  **Future Supply Readiness (`/farmer/future-supply-readiness`)**: Preview the advance harvest listing generated from your planting data.
9.  **Listing Published (`/farmer/listing-published`)**: Confirm the listing is live for potential buyers.

### B. Buyer Flow: "Secure Future Supply"
This flow interacts with seeded harvest data and allows real reservations.

1.  **Landing (`/`)**: Select **"I'm Buyer"**.
2.  **Marketplace (`/buyer/marketplace`)**: Browse projected harvests from various farms.
3.  **Supply Review (`/buyer/future-supply-readiness`)**: Detailed view of a specific projected harvest with AI readiness signals.
4.  **Reserve Supply (Modal)**: Enter reservation details to lock in future supply.
5.  **Reservation Confirmed (`/buyer/reservation-confirmed`)**: View the confirmation of your reservation.
6.  **My Reservations (`/buyer/reservations`)**: Track all your active and past harvest reservations.

---

## 3. Local Setup Method

Follow these steps to get the system running on your local machine.

### Prerequisites
- **Node.js 22+**
- **Python 3.11+**
- **Firebase Project** with Firestore enabled.

### Step 1: Clone and Environment
```bash
git clone <repo-url>
cd tani-trade-ai

# Prepare Frontend Env
cp frontend/.env.example frontend/.env

# Prepare Backend Env
cp backend/.env.example backend/.env
```
*Note: Ensure `VITE_API_BASE_URL` in `frontend/.env` points to `http://localhost:8010/api/v1`.*

### Step 2: Backend Setup
1.  **Create Virtual Environment**:
    ```bash
    python -m venv backend/.venv
    # Windows:
    backend\.venv\Scripts\Activate.ps1
    # Mac/Linux:
    source backend/.venv/bin/activate
    ```
2.  **Install Dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  **Credentials**:
    - Place your Firebase `service-account.json` in `backend/`.
    - Update `backend/.env` with your `GEMINI_API_KEY` and Firebase project details.

### Step 3: Seed Database
This is critical for the Buyer marketplace to have data.
```bash
python backend/scripts/seed_firestore.py
```

### Step 4: Run the System
**Terminal 1 (Backend):**
```bash
cd backend
uvicorn app.main:app --reload --port 8010
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```

---

## 4. Key Technical Considerations

- **API Mocking**: If Gemini or STT keys are missing, the backend has fallback mechanisms for demo purposes, but full AI extraction requires valid keys.
- **CORS**: If the frontend cannot talk to the backend, verify `FRONTEND_URL` in `backend/.env` matches your Vite URL (usually `http://localhost:5173`).
- **Database**: We use **Firebase Firestore** as the primary source of truth. All barter requests, trades, and harvest listings are stored here.

---

## 5. Troubleshooting

- **Voice Input Failing?** Ensure `Cloud Speech-to-Text API` is enabled in your Google Cloud project and your service account has the `Cloud Speech Client` role.
- **Empty Marketplace?** Ensure you ran the `seed_firestore.py` script.
- **AI Summary not loading?** Check `backend/logs/ai.log` for Gemini API errors or rate limits.
