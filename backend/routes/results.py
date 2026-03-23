from fastapi import APIRouter, HTTPException
from services.storage import storage

router = APIRouter()

@router.get("/results/{result_id}")
async def get_results(result_id: str):
    """
    Fetch a detailed analysis result from the local JSON store by ID.
    """
    result = storage.get_result_by_id(result_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Analysis result not found")
        
    return result

@router.get("/history")
async def get_history(limit: int = 10, offset: int = 0):
    """
    List history of past analyses from local JSON store.
    """
    results = storage.get_all_results()
    
    # Sort by created_at desc if exists
    results.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    
    return [
        {
            "id": r.get("id"),
            "filename": r.get("filename"),
            "role": r.get("role_id"),
            "overall_score": r.get("overall_score"),
            "date": r.get("created_at")
        } for r in results[offset : offset + limit]
    ]
