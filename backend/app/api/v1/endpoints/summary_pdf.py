from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
import os
from fastapi.responses import FileResponse

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.claim import Claim
from app.services import pdf_service
from app.config import settings

router = APIRouter()

@router.get("/claims/{claim_id}/summary-pdf")
def get_claim_summary_pdf(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Verify claim ownership first
        claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
        if not claim:
            raise HTTPException(status_code=404, detail="Claim not found")
        
        # Get the relative path from PDF service
        relative_path = pdf_service.generate_claim_summary_pdf(db, current_user, claim_id)
        
        # Construct full file path
        full_path = os.path.join(settings.UPLOAD_DIR, relative_path)
        
        # Check if file exists
        if not os.path.exists(full_path):
            raise HTTPException(status_code=404, detail="PDF file not found")
        
        # Return the actual file
        return FileResponse(
            path=full_path,
            media_type="application/pdf",
            filename=f"ClaimSummary_{claim.claim_number}.pdf"
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))