from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import uuid
import shutil

router = APIRouter()

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Endpoint to upload a resume (PDF/DOCX). 
    Saves it locally and returns a unique ID pointing to the file.
    """
    # Basic validation
    if not file.filename.lower().endswith(('.pdf', '.docx')):
        raise HTTPException(status_code=400, detail="Only PDF and DOCX files are allowed.")
        
    file_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    saved_filename = f"{file_id}{ext}"
    saved_path = os.path.join(UPLOAD_DIR, saved_filename)
    
    # Save file
    try:
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
    finally:
        file.file.close()
        
    return {
        "id": file_id,
        "filename": file.filename,
        "path": saved_path,
        "status": "uploaded"
    }

@router.get("/extract-text/{file_id}")
async def get_extracted_text(file_id: str):
    """
    Endpoint to get text from an already uploaded file.
    """
    from services.parser import parse_resume
    
    found_path = None
    for ext in [".pdf", ".docx"]:
        candidate = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")
        if os.path.exists(candidate):
            found_path = candidate
            break
            
    if not found_path:
        raise HTTPException(status_code=404, detail="File not found")
        
    try:
        parsed = parse_resume(found_path)
        return {"text": parsed["cleaned_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
