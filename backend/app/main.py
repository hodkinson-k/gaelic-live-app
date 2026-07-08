from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .models import Match, MatchCreate, MatchResponse, MatchStatus
from .database import engine, Base, get_db

# This single line tells SQLAlchemy to go find all classes inheriting from 'Base' 
# (like DBMatch) and physically create those tables inside SQLite if they don't exist yet.
Base.metadata.create_all(bind=engine)

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

def get_match_or_404(match_id: int, db: Session) -> Match:
    match = db.query(Match).filter(Match.id == match_id).first()
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")
    return match

@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Gaelic Live API is running"}


@app.get("/api/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}

@app.post("/api/matches", response_model=MatchResponse)
def create_match(match: MatchCreate, db: Session = Depends(get_db)):
    db_match = Match(
        home_team=match.home_team,
        away_team=match.away_team,
        venue=match.venue
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    
    return db_match

@app.get("/api/matches", response_model=list[MatchResponse])
def get_matches(db: Session = Depends(get_db)):
    matches = db.query(Match).all()
    return matches

@app.get("/api/matches/{match_id}", response_model=MatchResponse)
def get_match(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    return match

@app.patch("/api/matches/{match_id}/status", response_model=MatchResponse)
def update_status(match_id: int, status: MatchStatus, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    match.status = status
    db.commit()
    db.refresh(match)
    return match

@app.post("/api/matches/{match_id}/score/home/goal", response_model=MatchResponse)
def home_goal(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    match.home_goals += 1
    db.commit()
    db.refresh(match)
    return match
    
@app.post("/api/matches/{match_id}/score/home/point", response_model=MatchResponse)
def home_point(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    match.home_points += 1
    db.commit()
    db.refresh(match)
    return match

@app.post("/api/matches/{match_id}/score/away/goal", response_model=MatchResponse)
def away_goal(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    match.away_goals += 1
    db.commit()
    db.refresh(match)
    return match
    
@app.post("/api/matches/{match_id}/score/away/point", response_model=MatchResponse)
def away_point(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    match.away_points += 1
    db.commit()
    db.refresh(match)
    return match
    
@app.post("/api/matches/{match_id}/score/home/goal/undo", response_model=MatchResponse)
def undo_home_goal(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    if match.home_goals > 0:
        match.home_goals -= 1
    db.commit()
    db.refresh(match)
    return match

@app.post("/api/matches/{match_id}/score/away/goal/undo", response_model=MatchResponse)
def undo_away_goal(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    if match.away_goals > 0:
        match.away_goals -= 1
    db.commit()
    db.refresh(match)
    return match

@app.post("/api/matches/{match_id}/score/home/point/undo", response_model=MatchResponse)
def undo_home_point(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    if match.home_points > 0:
        match.home_points -= 1
    db.commit()
    db.refresh(match)
    return match

@app.post("/api/matches/{match_id}/score/away/point/undo", response_model=MatchResponse)
def undo_away_point(match_id: int, db: Session = Depends(get_db)):
    match = get_match_or_404(match_id, db)
    if match.away_points > 0:
        match.away_points -= 1
    db.commit()
    db.refresh(match)
    return match