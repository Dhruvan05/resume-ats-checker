from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime
from .db import Base

class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    role_id = Column(String, index=True)
    custom_jd = Column(Text, nullable=True)
    
    # Scores
    overall_score = Column(Float)
    skills_score = Column(Float)
    projects_score = Column(Float)
    experience_score = Column(Float)
    formatting_score = Column(Float)
    
    # Extracted Data
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    sections = Column(JSON)
    format_issues = Column(JSON)
    suggestions = Column(JSON)
    
    created_at = Column(DateTime, default=datetime.utcnow)
