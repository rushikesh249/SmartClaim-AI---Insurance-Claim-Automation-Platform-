from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.policy import PolicyLinkRequest, PolicyResponse
from app.services import policy_service

router = APIRouter()

@router.post("/link", response_model=PolicyResponse, status_code=status.HTTP_201_CREATED)
def link_policy(
    payload: PolicyLinkRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return policy_service.create_policy(db, current_user, payload)

@router.get("/", response_model=List[PolicyResponse])
def list_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return policy_service.list_user_policies(db, current_user)

@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy(
    policy_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return policy_service.get_policy_for_user(db, current_user, policy_id)
