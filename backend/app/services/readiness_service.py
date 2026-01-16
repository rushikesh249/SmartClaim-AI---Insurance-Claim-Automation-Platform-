from sqlalchemy.orm import Session
from uuid import UUID
from typing import List, Set

from app.models.claim import Claim
from app.models.document import Document
from app.services.timeline_service import add_event

REQUIRED_DOCS_HEALTH = {"hospital_bill", "discharge_summary", "prescription"}
REQUIRED_DOCS_MOTOR = {"accident_photo", "repair_estimate", "rc_book"}

def calculate_readiness_score(db: Session, claim_id: UUID) -> int:
    """
    Calculate claim readiness score based on presence of required documents.
    Updates the claim record and logs event.
    """
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        return 0

    # Determine required docs
    if claim.claim_type == "health":
        required = REQUIRED_DOCS_HEALTH
    elif claim.claim_type == "motor":
        required = REQUIRED_DOCS_MOTOR
    else:
        # Default or unknown type
        required = set()
    
    if not required:
        return 0

    # Fetch uploaded document types for this claim
    # Count only valid (not duplicate) docs? The prompt says "if doc exists for required type => count"
    # Duplicates usually shouldn't count if they are copies of existing ones, but assuming at least one valid copy exists.
    # Let's count all non-duplicate docs to be safe, or just distinct types.
    
    uploaded_types = db.query(Document.document_type).filter(
        Document.claim_id == claim_id,
        Document.is_duplicate == False
    ).all()
    
    uploaded_set = {row[0] for row in uploaded_types}
    
    # Calculate matches
    matches = required.intersection(uploaded_set)
    
    # Score calculation
    # Each required doc contributes equally.
    # score = (matches / total_required) * 100
    
    if len(required) > 0:
        score = int((len(matches) / len(required)) * 100)
    else:
        score = 0
        
    # Update claim
    old_score = claim.readiness_score or 0
    if score != old_score:
        claim.readiness_score = score
        db.commit()
        
        add_event(
            db, 
            claim_id, 
            "READINESS_UPDATED", 
            f"Readiness score updated from {old_score} to {score}",
            metadata={"old_score": old_score, "new_score": score}
        )
        
    return score
