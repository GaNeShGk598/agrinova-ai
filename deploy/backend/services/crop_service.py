import httpx
from config.settings import settings
from models.prediction_model import CropPredictRequest


async def predict_raw(req: CropPredictRequest) -> dict:
    payload = req.model_dump()
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            r = await client.post(f"{settings.ml_service_url}/predict-crop", json=payload)
            r.raise_for_status()
            return r.json()
    except Exception:
        return {
            "candidates": [{
                "crop": "wheat",
                "confidence": 0.7,
                "reasoning": "Fallback (ML service unreachable).",
                "details": {},
            }],
            "explanation": "ML service unreachable — showing fallback.",
            "soil_report": {},
            "best_pick": "wheat",
            "recommendation_summary": "ML service unreachable. Please ensure it is running on port 9000.",
            "next_steps": ["Start the ML service: cd ml-service && uvicorn api:app --port 9000"],
        }
