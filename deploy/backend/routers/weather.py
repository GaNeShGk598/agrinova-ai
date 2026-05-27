from fastapi import APIRouter, Depends, Query
from middleware.auth_middleware import get_current_user
from services import weather_service

router = APIRouter()


@router.get("/weather")
async def weather(lat: float = Query(...), lon: float = Query(...),
                  user=Depends(get_current_user)):
    return await weather_service.get_weather(lat, lon)
