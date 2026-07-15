# Gaelic Live

A full-stack live scorekeeping and match reporting app for GAA referees.
Built with Python (FastAPI) and React Native (Expo).

> ⚠️ Active development — this is a portfolio project being built incrementally.

## What this is

GAA referees currently record match scores manually on paper. This app replaces
that workflow with a mobile-first tool that keeps a live, accurate record of
every match — straight from the referee — and will generate automated reports
at full time.

## Architecture

Three apps in one monorepo:

| Folder | Stack | Purpose |
|--------|-------|---------|
| `backend/` | Python, FastAPI, SQLite | REST API — stores matches, handles scoring logic |
| `mobile/` | React Native, Expo | Referee app — live score input during a match |
| `spectator/` | React (not started) | Public web view — live scores for spectators |

## Current Status

### ✅ Backend (FastAPI)
- Full match lifecycle — create, list, retrieve
- GAA scoring — goal/point increment endpoints per team
- Undo endpoint with negative score protection
- Match status — scheduled → active → half_time → full_time
- SQLite persistence via SQLAlchemy
- Pydantic validation on all inputs/outputs
- Auto-generated API docs at `/docs`

### ✅ Mobile (React Native / Expo)
- Match list screen — fetches live data from the API
- Scoring screen — large tap targets for goal/point per team
- React Navigation stack — tap a match to open its scoring screen
- Status controls with confirmation dialog
- Dark theme optimised for outdoor use

### 🔲 Spectator Web View
Not started — planned React app showing live scores via WebSockets.

### 🔲 Match Reports
Not started — auto-generated PDF/markdown at full time.

## Run Locally

### Backend

```bash
cd backend
python -m venv .venv

# Windows
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API available at `http://localhost:8000`
Interactive docs at `http://localhost:8000/docs`

### Mobile

```bash
cd mobile
npx expo start
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your phone.

> **Note:** Update `config.js` with your local machine's IP address before running.

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches` | List all matches |
| POST | `/api/matches` | Create a match |
| GET | `/api/matches/{id}` | Get a single match |
| PATCH | `/api/matches/{id}/status` | Update match status |
| POST | `/api/matches/{id}/score/home/goal` | Home team scores a goal |
| POST | `/api/matches/{id}/score/home/point` | Home team scores a point |
| POST | `/api/matches/{id}/score/away/goal` | Away team scores a goal |
| POST | `/api/matches/{id}/score/away/point` | Away team scores a point |
| POST | `/api/matches/{id}/score/home/goal/undo` | Undo home goal |
| POST | `/api/matches/{id}/score/home/point/undo` | Undo home point |
| POST | `/api/matches/{id}/score/away/goal/undo` | Undo away goal |
| POST | `/api/matches/{id}/score/away/point/undo` | Undo away point |

## Roadmap

- [ ] WebSocket real-time score broadcasting
- [ ] Spectator web view
- [ ] Undo button with 30-second timeout on mobile
- [ ] Discipline tab — yellow, black, and red cards
- [ ] Match report generation (PDF)
- [ ] Team sheet input and player mapping for cards
- [ ] Cloud deployment (Railway / Render)

## Tech Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy, Pydantic, SQLite → PostgreSQL
- **Mobile:** React Native, Expo SDK 54, React Navigation
- **Version control:** Git / GitHub# Gaelic Live
