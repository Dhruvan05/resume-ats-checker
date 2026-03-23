import re

def check_format(parsed_resume: dict) -> dict:
    """
    Checks the resume for proper formatting rules like 
    section headers, bullet points, length, and contact info.
    """
    raw_text = parsed_resume.get("raw_text", "")
    sections = parsed_resume.get("sections", {})
    
    issues = []
    
    # 1. Section Headers (25 points)
    section_score = 0
    headers_found = [k for k, v in sections.items() if v]
    if len(headers_found) >= 3:
        section_score = 25
    elif len(headers_found) > 0:
        section_score = 15
        issues.append("Consider adding standard sections like Education, Experience, Skills, Projects")
    else:
        issues.append("Standard section headers (Education, Experience) are missing or not properly capitalized")
        
    # 2. Bullet Points (20 points)
    bullet_score = 0
    # Search for common bullet chars
    bullet_count = len(re.findall(r'[•\-*▪]', raw_text))
    if bullet_count > 10:
        bullet_score = 20
    elif bullet_count > 0:
        bullet_score = 10
        issues.append("Use more bullet points to describe projects and experience")
    else:
        issues.append("No bullet points detected. Ensure descriptions are easy to read")
        
    # 3. Length (20 points)
    length_score = 0
    word_count = len(raw_text.split())
    if 300 <= word_count <= 1200:
        length_score = 20
    elif word_count < 300:
        length_score = 10
        issues.append("Resume is too short. Try describing experiences in more detail")
    else:
        length_score = 10
        issues.append("Resume is too long (>1200 words). Try keeping it concise (1-2 pages)")
        
    # 4. Contact Info (15 points)
    contact_score = 0
    if parsed_resume.get("email") and parsed_resume.get("phone"):
        contact_score = 15
    else:
        if not parsed_resume.get("email"):
            issues.append("No email address found or recognizable")
        if not parsed_resume.get("phone"):
            issues.append("No phone number found or recognizable")
            
    # 5. Consistency (20 points) - Simulated base padding
    consistency_score = 20
    
    overall_score = section_score + bullet_score + length_score + contact_score + consistency_score
    
    return {
        "overall_score": overall_score,
        "section_headers_score": section_score,
        "bullet_points_score": bullet_score,
        "length_score": length_score,
        "contact_info_score": contact_score,
        "consistency_score": consistency_score,
        "issues": issues,
        "word_count": word_count
    }
