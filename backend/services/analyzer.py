from .scorer import calculate_skills_score, score_projects, calculate_final_score

# Placeholder for AI Studio logic
# from .parser import parse_resume
# from .format_checker import check_format
# from .suggestions import generate_suggestions

class AnalyzerService:
    """
    Orchestrates the resume parsing, skill matching, format checking and sub-scoring
    to generate the final analysis.
    """
    
    def analyze(self, file_path: str, role: str, custom_jd: str = None) -> dict:
        """
        Runs the full analysis pipeline.
        Since we are waiting for AI Studio files, this will generate a mock result based on limited logic.
        """
        # 1. Parse Document -> Mocked
        # parsed_doc = parse_resume(file_path)
        parsed_doc = {
            "raw_text": "Sample python developer with 2 years of experience. Built projects in Django and React.",
            "sections": {
                "skills": "Python, Django, React, SQL, Git",
                "projects": "Built an e-commerce platform using Django and React. Improved load times by 40%."
            }
        }
        
        # 2. Extract Skills -> Mocked
        resume_skills = ["Python", "Django", "React", "SQL", "Git"]
        
        # 3. Required Role logic -> Mocked
        job_role_skills = ["Python", "AWS", "Docker", "SQL", "React", "FastAPI"]
        
        # 4. Score Generation
        skills_score = calculate_skills_score(resume_skills, job_role_skills)
        projects_score = score_projects(parsed_doc["sections"].get("projects", ""))
        format_score = 80.0 # Mocked format checker
        
        final_score = calculate_final_score(skills_score, projects_score, format_score)
        
        # 5. Compile Results
        return {
            "overall_score": round(final_score, 1),
            "breakdown": {
                "skills": round(skills_score, 1),
                "projects": round(projects_score, 1),
                "format": round(format_score, 1)
            },
            "skills": {
                "matched": list(set([s.lower() for s in resume_skills]) & set([s.lower() for s in job_role_skills])),
                "missing": list(set([s.lower() for s in job_role_skills]) - set([s.lower() for s in resume_skills]))
            },
            "format_issues": ["No email found", "Add a dedicated Education section"],
            "suggestions": [
                {"priority": "high", "message": "Add Docker experience", "icon": "⚠️"}
            ]
        }
