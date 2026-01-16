from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from uuid import UUID

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.workflow import SubmitClaimResponse
from app.services import workflow_service

router = APIRouter()

@router.post("/claims/{claim_id}/submit", response_model=SubmitClaimResponse)
def submit_claim(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return workflow_service.submit_claim(db, current_user, claim_id)