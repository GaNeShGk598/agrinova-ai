from pydantic import BaseModel


class MarketPoint(BaseModel):
    week: str
    price: float


class MarketTrend(BaseModel):
    crop: str
    unit: str
    series: list[MarketPoint]
    trend: str   # rising | stable | falling
    change_pct: float
