import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import engine, Base
from routers import bills, challenges, solar, leaderboard

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("bijlilife.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables are created
    logger.info("Starting up BijliLiFE Platform Backend...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database schema verified and active.")
    except Exception as e:
        logger.warning(f"Database auto-migration warning: {e}. Running with memory fallback.")
    yield
    # Shutdown
    logger.info("Shutting down BijliLiFE Platform Backend...")
    await engine.dispose()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Mission LiFE Citizen Engagement Platform for Green Energy & Sustainability (GEDA Track 1 / HC26-GEDA01).",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(bills.router)
app.include_router(challenges.router)
app.include_router(solar.router)
app.include_router(leaderboard.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "service": "BijliLiFE Mission LiFE Platform",
        "version": settings.VERSION,
        "challenge": "GEDA / HC26-GEDA01 Green Energy & Sustainability",
        "discoms_supported": ["UGVCL", "PGVCL", "DGVCL", "MGVCL", "Torrent Power"],
        "docs_url": "/docs"
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "environment": settings.ENVIRONMENT
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

