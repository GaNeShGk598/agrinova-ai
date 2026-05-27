from pydantic import BaseModel, Field


class SoilProfile(BaseModel):
    ph: float = Field(ge=2.0, le=10.0)
    n: float = Field(ge=0)
    p: float = Field(ge=0)
    k: float = Field(ge=0)
    organic_matter: float = Field(ge=0, default=1.5)
    moisture: float = Field(ge=0, le=100, default=25)
