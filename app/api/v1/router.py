from fastapi import APIRouter

from app.api.v1.endpoints import healthcheck, auth, policies, claims, documents, ocr, timeline, workflow, summary_pdf

# Create API v1 router
api_router = APIRouter()

# Include endpoint routers
api_router.include_router(healthcheck.router)
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(policies.router, prefix="/policies", tags=["Policies"])
api_router.include_router(claims.router, prefix="/claims", tags=["Claims"])
api_router.include_router(documents.router, tags=["Documents"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
api_router.include_router(timeline.router, tags=["Timeline"])
api_router.include_router(workflow.router, tags=["Workflow"])
api_router.include_router(summary_pdf.router, tags=["PDF"])

