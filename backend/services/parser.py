import os
import re
import pdfplumber
import docx

def extract_text_from_pdf(file_path: str) -> str:
    """Extracts raw text from a PDF file."""
    text = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error reading PDF {file_path}: {e}")
    return text

def extract_text_from_docx(file_path: str) -> str:
    """Extracts raw text from a DOCX file."""
    text = ""
    try:
        doc = docx.Document(file_path)
        for i in doc.paragraphs:
            text += i.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX {file_path}: {e}")
    return text

def parse_resume(file_path: str) -> dict:
    """
    Main parser. Identifies file type, extracts text, 
    cleans it, and segments it into common sections.
    """
    ext = os.path.splitext(file_path)[1].lower()
    
    if ext == '.pdf':
        raw_text = extract_text_from_pdf(file_path)
    elif ext == '.docx':
        raw_text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format")
        
    cleaned_text = re.sub(r'\s+', ' ', raw_text).strip()
    
    # Simple regex for email and phone (Indian context commonly 10 digits w/ or w/o +91)
    email_match = re.search(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', cleaned_text)
    email = email_match.group(0) if email_match else None
    
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}', cleaned_text)
    phone = phone_match.group(0) if phone_match else None
    
    # Generic sections heuristic
    sections = {
        "education": "",
        "experience": "",
        "projects": "",
        "skills": ""
    }
    
    # We do a simplified segmenting approach here:
    # Just looking for presence of keywords and extracting blocks
    text_lower = cleaned_text.lower()
    
    # A very naive extraction for demonstration
    # In a full app, this uses advanced regex boundaries or spaCy segmenters.
    idx_edu = text_lower.find("education")
    idx_exp = text_lower.find("experience")
    idx_proj = text_lower.find("projects")
    idx_skills = text_lower.find("skills")
    
    # Store whatever we can map roughly
    if idx_skills != -1:
        sections["skills"] = cleaned_text[idx_skills:idx_skills+500] 
    if idx_proj != -1:
        sections["projects"] = cleaned_text[idx_proj:idx_proj+1000]
        
    return {
        "raw_text": raw_text,
        "cleaned_text": cleaned_text,
        "email": email,
        "phone": phone,
        "sections": sections
    }
