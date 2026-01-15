from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from typing import List, Optional

from app.models.policy import Policy
from app.models.user import User
from app.schemas.policy import PolicyLinkRequest

def create_policy(db: Session, current_user: User, payload: PolicyLinkRequest) -> Policy:
    # Check uniqueness
    existing = db.query(Policy).filter(Policy.policy_number == payload.policy_number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Policy number already exists"
        )
    
    new_policy = Policy(
        user_id=current_user.id,
        policy_number=payload.policy_number,
        policy_type=payload.policy_type,
        insurer_name=payload.insurer_name,
        sum_insured=payload.sum_insured,
        premium_amount=payload.premium_amount,
        start_date=payload.start_date,
        end_date=payload.end_date,
        coverage_details=payload.coverage_details,
        status="active"
    )
    db.add(new_policy)
    db.commit()
    db.refresh(new_policy)
    return new_policy

def list_user_policies(db: Session, current_user: User) -> List[Policy]:
    return db.query(Policy).filter(Policy.user_id == current_user.id).all()

def get_policy_for_user(db: Session, current_user: User, policy_id: UUID) -> Policy:
    policy = db.query(Policy).filter(Policy.id == policy_id, Policy.user_id == current_user.id).first()
    if not policy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Policy not found"
        )
    return policy
