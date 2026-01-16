from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Any
from pydantic import BaseModel
from datetime import datetime

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.services import timeline_service

router = APIRouter()

# Simple schema for Timeline Event response
class TimelineEventResponse(BaseModel):
    id: UUID
    claim_id: UUID
    event_type: str
    description: str  # Changed from 'message' to 'description' to match frontend
    timestamp: datetime  # Changed from 'created_at' to 'timestamp' to match frontend
    user_id: str = None
    metadata: Any = None
    
    class Config:
        from_attributes = True

@router.get("/claims/{claim_id}/timeline", response_model=List[TimelineEventResponse])
def get_claim_timeline(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify access (simple check via document/claim service logic or direct here)
    # Reusing the get_claim_for_user logic is better, but for speed let's just query
    # In a real app we'd strict check first.
    # Assuming timeline checks aren't sensitive if ID is guessed, but we should check.
    # For MVP, `timeline_service.get_timeline` just returns events, we should filter by ownership.
    
    # We'll use the service but logic needs to ensure user owns the claim first.
    # Let's verify via services or direct DB check (since timeline_service doesn't check owner)
    # Using claim service is a good way to verify, or just check ownership.
    
    from app.models.claim import Claim
    from fastapi import HTTPException
    
    claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
    if not claim:
         raise HTTPException(status_code=404, detail="Claim not found")
         
    events = timeline_service.get_timeline(db, claim_id)
    # Transform the events to match the expected frontend format
    transformed_events = []
    for event in events:
        transformed_events.append({
            'id': event.id,
            'claim_id': event.claim_id,
            'event_type': event.event_type,
            'description': event.message,  # Map message to description
            'timestamp': event.created_at,  # Map created_at to timestamp
            'user_id': getattr(event, 'user_id', None),
            'metadata': event.event_metadata
        })
    return transformed_events