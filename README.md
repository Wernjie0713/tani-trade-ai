# TaniTrade AI

TaniTrade AI is a fullstack starter project for agricultural trade workflows built with a FastAPI backend, a React + Tailwind CSS + shadcn frontend, and Supabase as the database and auth layer.

## Project Structure

```text
backend/   FastAPI API, app settings, Supabase server client
frontend/  Vite React app with Tailwind CSS and shadcn/ui
```

## Prerequisites

- Node.js 22+
- Python 3.11+
- A Supabase project

## Environment Setup

Copy the example environment files and fill in your Supabase project values.

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

## Run The Backend

```powershell
python -m venv backend\.venv
backend\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
uvicorn app.main:app --reload --app-dir backend
```

The API will be available at `http://localhost:8000` and the docs at `http://localhost:8000/docs`.

## Run The Frontend

```powershell
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Create The GitHub Repository

GitHub CLI is not installed in this environment, so the local repository is prepared for you and can be pushed after creating an empty repository on GitHub named `tani-trade-ai`.

```powershell
git init
git add .
git commit -m "Initial scaffold for TaniTrade AI"
git branch -M main
git remote add origin https://github.com/<your-username>/tani-trade-ai.git
git push -u origin main
```
