from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

# 1. The database location comes from settings (DATABASE_URL), not from code.
# Locally this defaults to a SQLite file; in production it will be Postgres.
SQLALCHEMY_DATABASE_URL = settings.database_url

# 2. Create the Database Engine
# 'check_same_thread' is a SQLite-only requirement, so only pass it for SQLite.
# Postgres would reject the argument.
connect_args = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)

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
