from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
import os
from fastapi.responses import FileResponse

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.services import pdf_service

router = APIRouter()

@router.get("/claims/{claim_id}/summary-pdf")
def get_claim_summary_pdf(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        path = pdf_service.generate_claim_summary_pdf(db, current_user, claim_id)
        # Check if file exists
        if not os.path.exists(path):
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        # Return the actual file
        return FileResponse(
            path=path,
            media_type="application/pdf",
            filename=f"claim_summary_{claim_id}.pdf"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))