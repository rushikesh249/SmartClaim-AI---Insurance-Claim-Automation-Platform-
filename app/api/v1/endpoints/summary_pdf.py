from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel
import os

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.services import pdf_service

router = APIRouter()

class PDFSummaryResponse(BaseModel):
    claim_id: UUID
    pdf_path: str

@router.get("/claims/{claim_id}/summary-pdf", response_model=PDFSummaryResponse)
def get_claim_summary_pdf(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        path = pdf_service.generate_claim_summary_pdf(db, current_user, claim_id)
        return PDFSummaryResponse(claim_id=claim_id, pdf_path=path)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
