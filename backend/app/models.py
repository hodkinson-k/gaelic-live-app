from pydantic import BaseModel
from datetime import datetime


class MatchCreate(BaseModel):
    home_team: str
    away_team: str
    venue: str

class MatchResponse(BaseModel):
    id: int
    home_team: str
    away_team: str
    venue: str
    created_at: datetime