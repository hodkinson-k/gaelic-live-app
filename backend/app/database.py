from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Define where the database file will be stored 
SQLALCHEMY_DATABASE_URL = "sqlite:///./gaelic_live.db"

# 2. Create the Database Engine
# (The 'check_same_thread' argument is a specific requirement only needed for SQLite)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create a Session Factory
# Every time an API request comes in, we will open a clean, isolated session from this factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create the Base class
# Our database tables (Models) will inherit from this class so SQLAlchemy can track them
Base = declarative_base()


# 5. Dependency helper function to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()