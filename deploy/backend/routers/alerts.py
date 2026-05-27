from fastapi import APIRouter, Depends, Query
from middleware.auth_middleware import get_current_user
from models.alert_model import AlertIn, AlertOut
from services import alert_service

router = APIRouter()


@router.post("/alerts", response_model=AlertOut)
def create_alert(payload: AlertIn, user=Depends(get_current_user)):
    return alert_service.create(user["id"], payload)


@router.get("/alerts", response_model=list[AlertOut])
def list_alerts(user=Depends(get_current_user)):
    return alert_service.list_for_user(user["id"])


@router.post("/alerts/evaluate")
def evaluate(soil_moisture: float = Query(...), humidity: float = Query(...),
             user=Depends(get_current_user)):
    created = alert_service.evaluate_rules(user["id"], soil_moisture, humidity)
    return {"created": [c.model_dump() for c in created]}
