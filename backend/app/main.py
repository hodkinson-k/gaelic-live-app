from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .models import MatchCreate, MatchResponse, datetime

# Create the application object. FastAPI uses this to register routes.
app = FastAPI(
    title="Gaelic Live API",
    description="Backend for live GAA match scoring and reporting.",
    version="0.1.0",
)

# CORS lets a web page or mobile app on a different origin call this API.
# For now we allow everything during local development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Gaelic Live API is running"}


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/api/matches", response_model=MatchResponse)
def create_match(match: MatchCreate) -> MatchResponse:
    return MatchResponse(
        id=1,
        home_team=match.home_team,
        away_team=match.away_team,
        venue=match.venue,
        created_at=datetime.now(),
    )