import random
from datetime import date, timedelta
from models.market_model import MarketTrend, MarketPoint


_BASE = {"wheat": 2050, "rice": 2400, "maize": 1900, "cotton": 6500, "soybean": 4200}


def get_trend(crop: str, weeks: int = 8) -> MarketTrend:
    crop = crop.lower()
    base = _BASE.get(crop, 2000)
    rng = random.Random(hash(crop) & 0xFFFF)
    series = []
    price = base
    for i in range(weeks):
        price = round(price * (1 + rng.uniform(-0.04, 0.05)), 2)
        series.append(MarketPoint(week=f"W{i+1}", price=price))
    change = (series[-1].price - series[0].price) / series[0].price * 100
    trend = "rising" if change > 2 else "falling" if change < -2 else "stable"
    return MarketTrend(crop=crop, unit="INR/qtl", series=series,
                       trend=trend, change_pct=round(change, 2))
