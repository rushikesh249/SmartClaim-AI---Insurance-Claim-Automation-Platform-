from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, Dict, Any

from app.models.timeline_event import TimelineEvent

def add_event(
    db: Session, 
    claim_id: UUID, 
    event_type: str, 
    message: str, 
    actor: str = "system", 
    metadata: Optional[Dict[str, Any]] = None
) -> TimelineEvent:
    """
    Add a new event to the timeline.
    """
    event = TimelineEvent(
        claim_id=claim_id,
        event_type=event_type,
        message=message,
        actor=actor,
        event_metadata=metadata
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def get_timeline(db: Session, claim_id: UUID, limit: int = 100):
    return db.query(TimelineEvent).filter(
        TimelineEvent.claim_id == claim_id
    ).order_by(TimelineEvent.created_at.desc()).limit(limit).all()
