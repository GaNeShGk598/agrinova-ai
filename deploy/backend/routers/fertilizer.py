from fastapi import APIRouter, Depends
from pydantic import BaseModel
from middleware.auth_middleware import get_current_user
from models.soil_model import SoilProfile
from services import fertilizer_service

router = APIRouter()


class FertilizerRequest(BaseModel):
    crop: str
    soil: SoilProfile
    area_acres: float = 1.0


@router.post("/fertilizer")
def fertilizer(req: FertilizerRequest, user=Depends(get_current_user)):
    return fertilizer_service.recommend(req.crop, req.soil, req.area_acres)
