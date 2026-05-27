from fastapi import APIRouter, Depends
from pydantic import BaseModel
from middleware.auth_middleware import get_current_user
from services import rotation_service

router = APIRouter()


class RotationRequest(BaseModel):
    current_crop: str
    seasons: int = 4


@router.post("/rotation-plan")
def rotation(req: RotationRequest, user=Depends(get_current_user)):
    return rotation_service.plan(req.current_crop, req.seasons)
