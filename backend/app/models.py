from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from .database import Base
from enum import Enum


# ==========================================
# 1. DATABASE MODELS (SQLAlchemy)
# These define what the tables look like inside SQLite
# ==========================================

class MatchStatus(str, Enum):
    SCHEDULED = "scheduled"
    ACTIVE = "active"
    HALF_TIME = "half_time"
    FULL_TIME = "full_time"

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    home_team = Column(String, index=True, nullable=False)
    away_team = Column(String, index=True, nullable=False)
    home_goals = Column(Integer, default=0)
    home_points = Column(Integer, default=0)
    away_goals = Column(Integer, default=0)
    away_points = Column(Integer, default=0)
    venue = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    status = Column(String, default=MatchStatus.SCHEDULED)
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
    home_goals: int
    home_points: int
    away_goals: int
    away_points: int
    venue: str
    created_at: datetime
    status: MatchStatus

    # This special setting tells Pydantic to easily read data 
    # straight out of an SQLAlchemy database object
    class Config:
        from_attributes = True

class MatchUpdate(BaseModel):
    home_goals: int | None = None
    home_points: int | None = None
    away_goals: int | None = None
    away_points: int | None = None


