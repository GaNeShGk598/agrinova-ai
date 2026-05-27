from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db: str = "agrinova"
    jwt_secret: str = "dev-secret-change-me"
    jwt_algo: str = "HS256"
    jwt_expire_minutes: int = 1440
    ml_service_url: str = "http://localhost:9000"
    weather_api_key: str = ""
    market_api_url: str = ""
    cors_origins: str = "http://localhost:5500,http://127.0.0.1:5500"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
