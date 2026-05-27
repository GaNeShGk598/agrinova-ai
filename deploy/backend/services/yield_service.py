import httpx
from config.settings import settings
from models.prediction_model import YieldRequest


async def estimate_raw(req: YieldRequest) -> dict:
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(f"{settings.ml_service_url}/estimate-yield", json=req.model_dump())
            r.raise_for_status()
            return r.json()
    except Exception:
        return {
            "crop": req.crop,
            "yield_q_per_ha": 0,
            "explanation": "ML service unreachable. Start it on port 9000.",
            "limiting_factors": ["ML service offline"],
            "improvement_tips": [],
            "crop_profile": {},
        }
