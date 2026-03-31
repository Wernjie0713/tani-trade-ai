# Quick Setup

This guide is for developers cloning `tani-trade-ai` locally for the first time.

## 1. Prerequisites

Install:

- Node.js 22+
- Python 3.11+
- Git

You also need access to the shared project secrets from the team:

- `backend/.env`
- `backend/service-account.json`

Required cloud services:

- Firebase project with Firestore enabled
- Gemini API key
- Google Cloud Speech-to-Text API enabled if you want real voice transcription

## 2. Clone The Repository

```powershell
git clone <repo-url>
cd tani-trade-ai
```

## 3. Prepare Environment Files

Frontend:

```powershell
Copy-Item frontend\.env.example frontend\.env
```

Backend:

- Get the real `backend/.env` from the team, or copy from the example and fill the values.
- Place the shared Firebase service account file at `backend/service-account.json`.

Reference example:

```powershell
Copy-Item backend\.env.example backend\.env
```

Minimum backend values that must be valid:

```env
FRONTEND_URL=http://localhost:5173
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CREDENTIALS_PATH=service-account.json
GEMINI_API_KEY=your-gemini-api-key
GOOGLE_CLOUD_PROJECT_ID=your-google-project-id
```

Minimum frontend value:

```env
VITE_API_BASE_URL=http://localhost:8010/api/v1
```

## 4. Optional Voice Input Setup

Typed intake works without this. Real microphone transcription needs Google Speech-to-Text.

Using the same Google/Firebase project:

1. Enable `Cloud Speech-to-Text API`.
2. Make sure the backend service account has the `Cloud Speech Client` role.
3. If needed, also grant `Service Usage Consumer`.
4. Keep `GOOGLE_CLOUD_PROJECT_ID` aligned with the Firebase project in `backend/.env`.

If this is not configured, the typed farmer flow still works, but mic transcription will fail.

## 5. Install Backend Dependencies

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

## 6. Seed Firestore

This loads the demo dataset used by the current farmer and buyer flows.

```powershell
python backend\scripts\seed_firestore.py
```

Notes:

- The seed includes expanded demo data, avatars, pricing references, listings, and buyer-side records.
- Rerunning the seeder refreshes the demo dataset. Do not treat it like a production migration tool.

## 7. Start The Backend

From the repo root:

```powershell
uvicorn app.main:app --reload --app-dir backend --port 8010
```

Or from inside the backend directory:

```powershell
cd backend
uvicorn app.main:app --reload --port 8010
```

Useful URLs:

- API: `http://localhost:8010`
- Swagger docs: `http://localhost:8010/docs`
- Health: `http://localhost:8010/api/v1/health`

## 8. Start The Frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

- App: `http://localhost:5173`

## 9. Quick Smoke Test

Check these in order:

1. Open `http://localhost:8010/api/v1/health`
2. Open `http://localhost:5173`
3. Click `I'm Farmer`
4. Try typed intake first
5. If voice input is configured, test the mic button

Expected current flow:

1. Farmer voice/text intake
2. Parsed summary with inline edits
3. Nearby matches
4. Trade proposal
5. Trade confirmation
6. Planting record
7. Harvest listing preview
8. Publish listing

Buyer flow is currently seeded/read-only and separate from the farmer flow.

## 10. Useful Validation Commands

Backend tests:

```powershell
cd backend
python -m unittest discover -s tests
```

Frontend lint and build:

```powershell
cd frontend
npm run lint
npm run build
```

## 11. Common Issues

`No module named 'app'`

- You started Uvicorn from `backend` while still using `--app-dir backend`.
- Remove `--app-dir backend` if your current directory is already `backend`.

`CORS` error from the frontend

- Check `FRONTEND_URL` in `backend/.env`.
- It must match the actual Vite origin, for example `http://localhost:5173`.

Voice input returns `502`

- Speech-to-Text API may not be enabled.
- The service account may be missing `Cloud Speech Client`.

Mic button does nothing

- Browser may block microphone permission.
- The current implementation is Chromium-first.

Gemini falls back to deterministic output

- Check `backend/logs/ai.log`.
- This usually means quota, provider failure, or invalid upstream output.

## 12. Current Architecture Snapshot

- Database: Firebase Firestore
- Backend: FastAPI
- AI text understanding/generation: Gemini API
- Voice transcription: Google Cloud Speech-to-Text V2
- Frontend: React + Vite
- Core trade ranking: deterministic backend rules grounded in Firestore data
