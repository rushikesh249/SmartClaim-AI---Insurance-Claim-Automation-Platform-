from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import List, Optional
from datetime import datetime

from app.models.claim import Claim
from app.models.policy import Policy
from app.models.user import User
from app.schemas.claim import ClaimCreateRequest, ClaimUpdateRequest

def generate_claim_number(db: Session) -> str:
    """
    Generate claim number in format CLM-<YYYY>-<6digit>
    Example: CLM-2026-000123
    """
    year = datetime.now().year
    prefix = f"CLM-{year}-"
    
    # Efficiently find the latest claim number for the current year
    # This matches CLM-2026-%
    latest_claim = db.query(Claim.claim_number)\
        .filter(Claim.claim_number.like(f"{prefix}%"))\
        .order_by(Claim.claim_number.desc())\
        .first()
        
    if latest_claim:
        # Extract the sequence part
        # schema: CLM-YYYY-NNNNNN
        # len("CLM-2026-") is 9
        try:
            last_seq_str = latest_claim[0].split('-')[-1]
            new_seq = int(last_seq_str) + 1
        except (ValueError, IndexError):
            new_seq = 1
    else:
        new_seq = 1
        
    return f"{prefix}{new_seq:06d}"

def create_claim(db: Session, current_user: User, payload: ClaimCreateRequest) -> Claim:
    # Validate policy ownership
    policy = db.query(Policy).filter(Policy.id == payload.policy_id, Policy.user_id == current_user.id).first()
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found or does not belong to user"
        )
        
    # Generate claim number
    claim_num = generate_claim_number(db)
    
    new_claim = Claim(
        claim_number=claim_num,
        user_id=current_user.id,
        policy_id=payload.policy_id,
        claim_type=payload.claim_type,
        incident_date=payload.incident_date,
        incident_location=payload.incident_location,
        incident_description=payload.incident_description,
        claimed_amount=payload.claimed_amount,
        status="DRAFT"
    )
    
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    return new_claim

def list_user_claims(db: Session, current_user: User, status_filter: Optional[str] = None) -> List[Claim]:
    query = db.query(Claim).filter(Claim.user_id == current_user.id)
    if status_filter:
        query = query.filter(Claim.status == status_filter)
    return query.all()

def get_claim_for_user(db: Session, current_user: User, claim_id: UUID) -> Claim:
    claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )
    return claim

def update_claim_draft_only(db: Session, current_user: User, claim_id: UUID, payload: ClaimUpdateRequest) -> Claim:
    claim = get_claim_for_user(db, current_user, claim_id)
    
    if claim.status != "DRAFT":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only DRAFT claims can be updated"
        )
    
    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(claim, key, value)
        
    db.commit()
    db.refresh(claim)
    return claim
