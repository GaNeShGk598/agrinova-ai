from datetime import datetime
from pydantic import BaseModel


class AlertIn(BaseModel):
    farm_id: str | None = None
    type: str          # irrigation | disease | weather | market
    severity: str      # low | medium | high
    title: str
    message: str


class AlertOut(AlertIn):
    id: str
    user_id: str
    created_at: datetime
