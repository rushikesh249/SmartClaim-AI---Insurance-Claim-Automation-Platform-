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

# Configure CORS for development and production
# Development origins
DEV_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Production origins (to be configured via environment)
PROD_ORIGINS = []

# Determine allowed origins based on environment
if settings.DEBUG:
    ALLOWED_ORIGINS = DEV_ORIGINS
else:
    # In production, you can set PROD_ORIGINS via environment variable
    # For now, keeping it restrictive
    ALLOWED_ORIGINS = PROD_ORIGINS

# Apply CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allow_headers=[
        "*",  # Allow all headers
    ],
    expose_headers=["Content-Disposition", "Content-Length", "Content-Type"],
    max_age=86400,  # Cache preflight requests for 24 hours
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


# Include API v1 router AFTER CORS middleware
app.include_router(api_router, prefix=settings.API_PREFIX)

logger.info("Application initialized successfully")
