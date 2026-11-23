from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings, loaded from environment variables.

    Values are read from the process environment first, then from a `.env`
    file in the backend folder if one exists. Nothing here is hardcoded for
    a particular machine, so the same code runs locally and in the cloud.
    """

    database_url: str = "sqlite:///./gaelic_live.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
