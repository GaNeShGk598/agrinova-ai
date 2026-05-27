from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from middleware.auth_middleware import get_current_user
from services import disease_service

router = APIRouter()


@router.post("/analyze-leaf")
async def analyze_leaf(file: UploadFile = File(...), user=Depends(get_current_user)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "Please upload an image")
    data = await file.read()
    if len(data) > 8 * 1024 * 1024:
        raise HTTPException(413, "Image too large (max 8MB)")
    return await disease_service.analyze(data, file.filename or "leaf.jpg")
