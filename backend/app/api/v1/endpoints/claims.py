from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.claim import ClaimCreateRequest, ClaimUpdateRequest, ClaimResponse
from app.services import claim_service

router = APIRouter()

@router.post("/", response_model=ClaimResponse, status_code=status.HTTP_201_CREATED)
def create_claim(
    payload: ClaimCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return claim_service.create_claim(db, current_user, payload)

@router.get("/", response_model=List[ClaimResponse])
def list_claims(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return claim_service.list_user_claims(db, current_user, status)

@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return claim_service.get_claim_for_user(db, current_user, claim_id)

@router.put("/{claim_id}", response_model=ClaimResponse)
def update_claim(
    claim_id: UUID,
    payload: ClaimUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return claim_service.update_claim_draft_only(db, current_user, claim_id, payload)
