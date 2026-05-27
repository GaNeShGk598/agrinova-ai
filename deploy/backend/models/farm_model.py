from pydantic import BaseModel, Field


class FarmIn(BaseModel):
    name: str
    region: str
    area_acres: float = Field(gt=0)
    irrigation_type: str | None = None
    lat: float | None = None
    lon: float | None = None
