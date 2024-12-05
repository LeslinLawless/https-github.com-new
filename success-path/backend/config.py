import os
from typing import Optional
from pydantic import BaseSettings

class Settings(BaseSettings):
    # Base
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = os.getenv("DEBUG", True)
    APP_HOST: str = os.getenv("APP_HOST", "0.0.0.0")
    APP_PORT: int = int(os.getenv("APP_PORT", 8000))
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./success_path.db"  # Default SQLite for development
    )
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    CORS_ORIGINS: list = ["*"]  # In production, specify actual origins
    
    class Config:
        case_sensitive = True

settings = Settings()
