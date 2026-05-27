import httpx
from config.settings import settings


async def analyze(image_bytes: bytes, filename: str) -> dict:
    files = {"file": (filename, image_bytes, "application/octet-stream")}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(f"{settings.ml_service_url}/analyze-leaf", files=files)
            r.raise_for_status()
            return r.json()
    except Exception:
        return {
            "disease": "Unknown",
            "severity": "low",
            "confidence": 0.0,
            "remedies": ["ML service unreachable. Showing fallback advice.",
                         "Inspect leaf manually; check for spots, mildew, wilting."],
            "explanation": "Fallback heuristic — ml-service offline.",
        }
