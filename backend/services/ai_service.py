import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Dict, Any

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

class AIService:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def analyze_resume_v2(self, resume_text: str, jd_text: str, role: str) -> Dict[str, Any]:
        """
        Uses Gemini to perform a deep analysis of the resume against the JD.
        """
        prompt = f"""
        You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
        Analyze the following Resume against the provided Job Description for the role of {role}.
        
        RESUME:
        {resume_text}
        
        JOB DESCRIPTION:
        {jd_text}
        
        Strictly return a valid JSON object with the following structure:
        {{
            "overall_score": float (0-100),
            "breakdown": [
                {{"name": "Skills Match", "score": float}},
                {{"name": "Experience Level", "score": float}},
                {{"name": "Project Relevance", "score": float}}
            ],
            "extracted_skills": {{
                "matched": [string],
                "missing": [string],
                "all_jd_keywords": [string]
            }},
            "suggestions": [
                {{"priority": "high"|"medium"|"low", "message": string, "icon": string (emoji)}}
            ],
            "summary": string (brief evaluation)
        }}
        
        Do not include any markdown formatting or extra text. Only the JSON.
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Basic sanitization in case it includes markdown code blocks
            res_text = response.text.strip()
            if res_text.startswith("```json"):
                res_text = res_text[7:-3]
            elif res_text.startswith("```"):
                res_text = res_text[3:-3]
                
            return json.loads(res_text)
        except Exception as e:
            print(f"AI Service Error: {e}")
            return None

ai_service = AIService()
