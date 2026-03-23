from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import json
from services.parser import parse_resume
from services.skill_extractor import extract_skills
from services.format_checker import check_format
from services.scorer import calculate_skills_score, score_projects, calculate_final_score
from services.suggestions import generate_suggestions

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "uploads")

# Load job roles
ROLES_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "job_roles.json")
with open(ROLES_PATH, "r", encoding="utf-8") as f:
    JOB_ROLES = json.load(f)

class AnalyzeRequest(BaseModel):
    resume_id: str
    role: str
    custom_jd: Optional[str] = None

@router.post("/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    """
    Full analysis pipeline: parse → extract skills → score → suggest.
    """
    try:
        # 1. Look for the file on disk
        found_path = None
        for ext in [".pdf", ".docx"]:
            candidate = os.path.join(UPLOAD_DIR, f"{request.resume_id}{ext}")
            if os.path.exists(candidate):
                found_path = candidate
                break

        if not found_path:
            raise HTTPException(status_code=404, detail="Uploaded resume file not found. Please re-upload.")

        # 2. Parse text
        try:
            parsed = parse_resume(found_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to parse resume: {str(e)}")
        
        # 3. Traditional Taxonomy matching
        resume_skills = extract_skills(parsed["cleaned_text"])
        
        role_data = JOB_ROLES.get(request.role)
        if not role_data:
            raise HTTPException(status_code=400, detail=f"Unknown role: {request.role}")

        required_skills = list(role_data["required_skills"])
        if request.custom_jd and len(request.custom_jd.strip()) > 20:
            jd_skills = extract_skills(request.custom_jd)
            for s in jd_skills:
                if s not in required_skills:
                    required_skills.append(s)

        # 4. Calculate Scores
        skills_score = calculate_skills_score(resume_skills, required_skills)
        projects_score = score_projects(parsed["cleaned_text"])
        format_result = check_format(parsed)
        format_score = format_result["overall_score"]
        
        overall_score = calculate_final_score(skills_score, projects_score, format_score)

        # 5. Core Mapping
        matched = list(set([s.lower() for s in resume_skills]) & set([s.lower() for s in required_skills]))
        missing = list(set([s.lower() for s in required_skills]) - set([s.lower() for s in resume_skills]))
        
        suggestions = [
            {"priority": "high", "message": f"Add missing keywords: {', '.join(missing[:3])}", "icon": "🎯"},
            {"priority": "medium", "message": "Quantify your impact with metrics (e.g., 'Reduced latency by 20%')", "icon": "📈"},
        ]

        # 6. Additional JD matching indicators
        jd_combined = extract_skills(request.custom_jd) if request.custom_jd else []
        
        # Check what matches the resume
        resume_skills_lower = [s.lower() for s in resume_skills]
        jd_matched = [s for s in jd_combined if s in resume_skills_lower]
        jd_missing = [s for s in jd_combined if s not in resume_skills_lower]

        # 7. Save result locally
        from services.storage import storage
        final_result = {
            "analysis_id": "local_" + request.resume_id,
            "filename": os.path.basename(found_path),
            "role_id": request.role,
            "overall_score": overall_score,
            "breakdown": [
                {"name": "Skills Match", "score": round(skills_score, 1)},
                {"name": "Project Relevance", "score": round(projects_score, 1)},
                {"name": "Format", "score": round(format_score, 1)},
            ],
            "skills": {
                "matched": matched,
                "missing": missing,
                "jd_matched": jd_matched,
                "jd_missing": jd_missing
            },
            "suggestions": suggestions,
            "summary": "Analysis completed using weighted keyword matching system."
        }
        
        saved_data = storage.save_result(final_result)
        final_result["analysis_id"] = saved_data["id"]

        return final_result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
