"""AgriNova AI — Backend API entrypoint."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.settings import settings
from config.db import ensure_indexes
from routers import (
    auth,
    crop,
    disease,
    yield_ as yield_router,
    weather,
    alerts,
    fertilizer,
    market,
    rotation,
)

# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="AgriNova AI Backend",
    version="1.0.0",
    description="AI Powered Smart Agriculture Platform"
)

# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# STARTUP EVENT
# ==========================================

@app.on_event("startup")
def _startup() -> None:
    ensure_indexes()

    print("\n" + "=" * 60)
    print("🚀 AGRINOVA AI BACKEND STARTED")
    print("=" * 60)
    print("🌐 Backend API : http://127.0.0.1:8000")
    print("📄 Swagger Docs: http://127.0.0.1:8000/docs")
    print("📘 ReDoc Docs  : http://127.0.0.1:8000/redoc")
    print("=" * 60 + "\n")

# ==========================================
# ROOT ROUTE
# ==========================================

@app.get("/")
def root():
    return {
        "app": "AgriNova AI",
        "status": "ok",
        "backend_url": "http://127.0.0.1:8000",
        "swagger_docs": "http://127.0.0.1:8000/docs",
        "redoc_docs": "http://127.0.0.1:8000/redoc"
    }

# ==========================================
# ROUTERS
# ==========================================

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(crop.router, tags=["crop"])
app.include_router(disease.router, tags=["disease"])
app.include_router(yield_router.router, tags=["yield"])
app.include_router(weather.router, tags=["weather"])
app.include_router(alerts.router, tags=["alerts"])
app.include_router(fertilizer.router, tags=["fertilizer"])
app.include_router(market.router, tags=["market"])
app.include_router(rotation.router, tags=["rotation"])

# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    import uvicorn

    print("\n" + "=" * 60)
    print("🚀 STARTING AGRINOVA AI BACKEND")
    print("=" * 60)
    print("🌐 URL : http://127.0.0.1:8000")
    print("📄 DOCS: http://127.0.0.1:8000/docs")
    print("=" * 60 + "\n")

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )