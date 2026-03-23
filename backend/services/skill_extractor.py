import json
import os
import re
from typing import List, Dict

# In a real app we'd load this from AI Studio generated file
# import spacy
# nlp = spacy.load("en_core_web_sm")

def load_taxonomy() -> dict:
    taxonomy_path = os.path.join(os.path.dirname(__file__), "../data/skill_taxonomy.json")
    try:
        with open(taxonomy_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback if not yet generated
        return {
            "python": {"aliases": ["python3", "py"], "category": "language"},
            "react": {"aliases": ["reactjs", "react.js"], "category": "framework"}
        }

def extract_skills(text: str) -> List[str]:
    """
    Extracts skills from text using taxonomy aliases and regex boundary matching.
    """
    taxonomy = load_taxonomy()
    found_skills = set()
    
    text_lower = text.lower()
    
    for canonical_skill, data in taxonomy.items():
        aliases = [canonical_skill] + data.get("aliases", [])
        
        for alias in aliases:
            # Use regex to match whole words/phrases to prevent substring false positives
            # e.g., " C " won't match " React "
            escaped_alias = re.escape(alias)
            pattern = rf"\b{escaped_alias}\b"
            
            if re.search(pattern, text_lower):
                found_skills.add(canonical_skill)
                break # Matched one alias, move to next canonical skill
                
    extracted = list(found_skills)
    if extracted:
        print(f"DEBUG: Extracted {len(extracted)} skills: {extracted}")
    return extracted
