from typing import List, Dict

def calculate_skills_score(resume_skills: List[str], required_skills: List[str]) -> float:
    """
    Simulated semantic matching. Later we will replace this with TF-IDF cosine similarity.
    For now, a basic overlap-driven ratio.
    """
    if not required_skills:
        return 100.0
        
    resume_skills_lower = [s.lower() for s in resume_skills]
    required_skills_lower = [s.lower() for s in required_skills]
    
    match_count = sum(1 for req in required_skills_lower if req in resume_skills_lower)
    return (match_count / len(required_skills)) * 100

def score_projects(project_text: str) -> float:
    """
    Sub-scoring for projects based on length and keywords.
    """
    if not project_text or len(project_text.strip()) < 50:
        return 0.0
        
    score = 50.0 # Base score for having the section
    text_lower = project_text.lower()
    
    # Action verbs boost
    action_verbs = ["built", "developed", "designed", "created", "led", "managed", "implemented"]
    verb_count = sum(1 for verb in action_verbs if verb in text_lower)
    score += min(verb_count * 5, 25.0)
    
    # Metrics boost
    import re
    has_numbers = bool(re.search(r'\d+', project_text))
    if has_numbers:
        score += 25.0
        
    return min(100.0, score)

def calculate_final_score(skills_score: float, projects_score: float, format_score: float) -> float:
    """
    Weighted average: 45% skills, 35% projects, 20% format
    """
    return (skills_score * 0.45) + (projects_score * 0.35) + (format_score * 0.20)
