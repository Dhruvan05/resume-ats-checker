import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume ATS Analyzer"
    API_V1_STR: str = "/api"
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./resume_analyzer.db")
    
    # Upload settings
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx"}
    
    class Config:
        case_sensitive = True

settings = Settings()
