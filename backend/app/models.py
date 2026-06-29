from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from .database import Base


# ==========================================
# 1. DATABASE MODELS (SQLAlchemy)
# These define what the tables look like inside SQLite
# ==========================================

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    home_team = Column(String, index=True, nullable=False)
    away_team = Column(String, index=True, nullable=False)
    venue = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

# ==========================================
# 2. API SCHEMAS (Pydantic)
# These define what data goes in/out over the internet
# ==========================================

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

    # This special setting tells Pydantic to easily read data 
    # straight out of an SQLAlchemy database object
    class Config:
        from_attributes = True