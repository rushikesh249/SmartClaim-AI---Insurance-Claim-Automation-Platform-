from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import api_router
from app.utils.logger import setup_logger
from app.utils.constants import API_WELCOME_MESSAGE

# Setup logger
logger = setup_logger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Insurance Claim Automation Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS (allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Application startup tasks."""
    logger.info(f"Starting {settings.APP_NAME}")
    logger.info(f"API docs available at: /docs")
    logger.info(f"Database URL: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'Not configured'}")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown tasks."""
    logger.info(f"Shutting down {settings.APP_NAME}")


@app.get("/")
async def root() -> dict:
    """
    Root endpoint.
    
    Returns:
        Welcome message
    """
    return {
        "message": API_WELCOME_MESSAGE,
        "version": "1.0.0",
        "docs": "/docs"
    }


# Include API v1 router
app.include_router(api_router, prefix=settings.API_PREFIX)

logger.info("Application initialized successfully")
