from fastapi import APIRouter, Depends
from middleware.auth_middleware import get_current_user
from models.prediction_model import YieldRequest
from services import yield_service

router = APIRouter()


@router.post("/estimate-yield")
async def estimate_yield(req: YieldRequest, user=Depends(get_current_user)):
    return await yield_service.estimate_raw(req)
