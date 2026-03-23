from typing import List, Dict

def generate_suggestions(
    matched_skills: list[str],
    missing_skills: list[str],
    sections_found: list[str],
    project_text: str,
    format_issues: list[str],
    role: str
) -> list[dict]:
    """Generates prioritized suggestions based on the resume output profile."""
    
    suggestions = []
    
    # 1. Missing skills -> High Priority
    if len(missing_skills) > 5:
        top_missing = ", ".join(missing_skills[:5])
        suggestions.append({
            "priority": "high",
            "category": "skills",
            "message": f"You are missing {len(missing_skills)} key skills for {role}. Top priority skills to learn: {top_missing}.",
            "icon": "⚠️"
        })
    elif len(missing_skills) > 0:
        s = ", ".join(missing_skills)
        suggestions.append({
            "priority": "medium",
            "category": "skills",
            "message": f"Consider adding context or projects featuring these skills: {s}",
            "icon": "💡"
        })
    else:
        suggestions.append({
            "priority": "low",
            "category": "skills",
            "message": f"Great skill coverage for {role}!",
            "icon": "✅"
        })
        
    # 2. Section Checks -> High Priority
    required_sections = ["education", "experience", "projects", "skills"]
    missing_sections = [s for s in required_sections if s not in sections_found]
    if "projects" in missing_sections:
        suggestions.append({
            "priority": "high",
            "category": "content",
            "message": "Add a Projects section — it contributes heavily to your ATS score.",
            "icon": "⚠️"
        })
    elif "experience" in missing_sections:
        suggestions.append({
            "priority": "medium",
            "category": "content",
            "message": "Consider adding an Experience section, even if it's internships or open source contributions.",
            "icon": "💡"
        })
        
    # 3. Project Metrics Checks -> Medium Priority
    if "projects" not in missing_sections and project_text:
        import re
        has_metrics = bool(re.search(r'\d+', project_text))
        if not has_metrics:
            suggestions.append({
                "priority": "medium",
                "category": "metrics",
                "message": "Quantify your impact in projects. Use numbers (e.g., 'reduced load time by 40%').",
                "icon": "📊"
            })
            
    # 4. Formatting Issues -> Low Priority
    for issue in format_issues[:3]:
        suggestions.append({
            "priority": "low",
            "category": "format",
            "message": issue,
            "icon": "📝"
        })
        
    # Sort
    priorities = {"high": 0, "medium": 1, "low": 2}
    sorted_sugs = sorted(suggestions, key=lambda x: priorities[x["priority"]])
    
    return sorted_sugs[:8] # Max 8
