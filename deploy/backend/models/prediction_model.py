from pydantic import BaseModel, Field
from .soil_model import SoilProfile


class CropPredictRequest(BaseModel):
    soil: SoilProfile
    season: str = Field(pattern="^(kharif|rabi|zaid|summer|winter|monsoon)$")
    region: str


class CropCandidate(BaseModel):
    crop: str
    confidence: float
    reasoning: str


class CropPredictResponse(BaseModel):
    candidates: list[CropCandidate]
    explanation: str


class YieldRequest(BaseModel):
    crop: str
    soil: SoilProfile
    rainfall_mm: float = 600
    temperature_c: float = 25
    area_acres: float = 1.0


class YieldResponse(BaseModel):
    crop: str
    yield_q_per_ha: float
    range_low: float
    range_high: float
    category: str  # low | average | high
