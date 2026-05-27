from fastapi import APIRouter, Depends, Query
from middleware.auth_middleware import get_current_user
from services import market_service

router = APIRouter()


@router.get("/market-prices")
def market_prices(crop: str = Query("wheat"), weeks: int = Query(8, ge=2, le=52),
                  user=Depends(get_current_user)):
    return market_service.get_trend(crop, weeks).model_dump()
