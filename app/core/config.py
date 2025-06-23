from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List
from dotenv import load_dotenv
import os
from pathlib import Path

# Load the .env file from the project root (parent of 'app' directory)
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=dotenv_path)

def clean_int_env(var_name: str, default: str) -> int:
    """Clean and convert environment variable to integer."""
    value = os.getenv(var_name, default)
    # Remove any comments and whitespace
    value = value.split('#')[0].strip()
    return int(value)

class Settings(BaseSettings):
    # ----- app -----
    app_name: str = "BrandVoice External APIs"
    environment: str = "dev"
    debug: bool = False

    # ----- db -----
    database_url: str = os.getenv("DATABASE_URL", "")

    # ----- auth / jwt -----
    secret_key: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = Field(default=30, description="Access token expiration time in minutes")
    refresh_token_expire_days: int = Field(default=7, description="Refresh token expiration time in days")

    # ----- CORS -----
    allow_origins: List[str] = ["https://brand-voice-phi.vercel.app/"]

    # ----- Twitter API -----
    twitter_api_key: str = os.getenv("TWITTER_API_KEY", "")
    twitter_api_secret: str = os.getenv("TWITTER_API_SECRET", "")
    twitter_callback_url: str = os.getenv("TWITTER_CALLBACK_URL", "")
    twitter_bearer_token: str = os.getenv("TWITTER_BEARER_TOKEN", "")

    # ----- misc (optional) -----
    redis_url: str | None = None
    broker_url: str | None = None
    result_backend: str | None = None

    # ----- Facebook API -----
    facebook_app_id: str = os.getenv("FACEBOOK_OA2_CLIENT_ID", "")
    facebook_app_secret: str = os.getenv("FACEBOOK_OA2_CLIENT_SECRET", "")
    facebook_callback_url: str = os.getenv("FACEBOOK_CALLBACK_URL", "")
    instagram_callback_url: str = os.getenv("INSTAGRAM_CALLBACK_URL", "")

    # ----- YouTube API -----
    youtube_client_id: str = os.getenv("YOUTUBE_CLIENT_ID", "")
    youtube_client_secret: str = os.getenv("YOUTUBE_CLIENT_SECRET", "")
    youtube_callback_url: str = os.getenv("YOUTUBE_CALLBACK_URL", "")

    # ----- Google Cloud -----
    google_application_credentials: str = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'service_account.json'))

    # read from .env by default
    model_config = SettingsConfigDict(
        env_file="../.env",  # Correct path to project root .env
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
    )

@lru_cache
def get_settings() -> Settings:
    """
    Import-safe singleton – FastAPI can `Depends(get_settings)`.
    Caches so the same object is reused across requests.
    """
    return Settings()
