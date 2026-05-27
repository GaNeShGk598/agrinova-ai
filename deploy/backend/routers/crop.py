from fastapi import APIRouter, Depends
from middleware.auth_middleware import get_current_user
from models.prediction_model import CropPredictRequest
from services import crop_service

router = APIRouter()


@router.post("/predict-crop")
async def predict_crop(req: CropPredictRequest, user=Depends(get_current_user)):
    # Pass through full enriched payload from ML service
    return await crop_service.predict_raw(req)
