from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "Virtual Try-On API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["*"]
    
    # File storage
    UPLOAD_FOLDER: str = "uploads"
    RESULT_FOLDER: str = "static/results"
    MAX_CONTENT_LENGTH: int = 16 * 1024 * 1024  # 16MB max upload size
    ALLOWED_EXTENSIONS: set = {"png", "jpg", "jpeg", "mp4"}
    
    # AWS S3 Configuration (optional)
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_STORAGE_BUCKET_NAME: Optional[str] = None
    AWS_S3_REGION: Optional[str] = None
    
    # Model paths
    MODEL_PATH: str = "models/virtual_tryon_model.pth"
    
    class Config:
        case_sensitive = True

settings = Settings()
