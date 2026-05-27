import httpx
from config.settings import settings


async def get_weather(lat: float, lon: float) -> dict:
    # Use Open-Meteo (no API key needed) as primary; OpenWeather as optional
    url = (f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}"
           "&current=temperature_2m,relative_humidity_2m,precipitation,weather_code"
           "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code"
           "&timezone=auto&forecast_days=7")
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(url)
        r.raise_for_status()
        data = r.json()
    suggestions = _suggest(data)
    return {"forecast": data, "suggestions": suggestions}


def _suggest(data: dict) -> list[str]:
    out = []
    cur = data.get("current", {})
    if cur.get("relative_humidity_2m", 0) > 85:
        out.append("High humidity — increased fungal/disease risk. Inspect leaves.")
    if cur.get("precipitation", 0) > 5:
        out.append("Active rainfall — postpone irrigation and fertilizer application.")
    daily = data.get("daily", {})
    rain = daily.get("precipitation_sum", [])
    if rain and sum(rain[:3]) < 5:
        out.append("Dry next 3 days — schedule irrigation early morning.")
    if not out:
        out.append("Conditions stable — continue normal field operations.")
    return out
