from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID

from app.models.user import User
from app.models.claim import Claim
from app.models.document import Document
from app.services.timeline_service import add_event
from app.services.readiness_service import calculate_readiness_score
from app.services.validation_service import validate_claim
from app.services.fraud_service import calculate_fraud_score
from app.services.ocr_service import extract_ocr_for_document

def submit_claim(db: Session, current_user: User, claim_id: UUID) -> dict:
    """
    Orchestrate claim submission:
    Validate -> OCR -> Fraud Score -> Decision
    """
    # 1. Fetch claim
    claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    # 2. Only allow submit if DRAFT
    if claim.status != "DRAFT":
        raise HTTPException(status_code=400, detail=f"Claim status is {claim.status}, cannot submit")
    
    # 3. Update status to SUBMITTED
    claim.status = "SUBMITTED"
    add_event(db, claim_id, "STATUS_CHANGED", "Claim submitted for processing")
    
    # 4. Recompute Readiness
    readiness_score = calculate_readiness_score(db, claim_id)
    # add_event handled inside calculate_readiness_score if changed
    
    # 5. Validation
    val_result = validate_claim(db, claim)
    if not val_result["passed"]:
        # Auto Reject
        claim.status = "REJECTED"
        claim.decision_type = "auto_rejected"
        claim.rejection_reason = "; ".join(val_result["reasons"])
        
        add_event(db, claim_id, "VALIDATED", "validation_failed", metadata={"reasons": val_result["reasons"]})
        add_event(db, claim_id, "STATUS_CHANGED", f"Claim rejected due to validation failure")
        
        db.commit()
        return _build_response(claim)
    
    add_event(db, claim_id, "VALIDATED", "Validation passed")
    
    # 6. Run OCR for key docs
    docs = db.query(Document).filter(Document.claim_id == claim.id).all()
    target_type = "hospital_bill" if claim.claim_type == "health" else "repair_estimate"
    
    for doc in docs:
        if doc.document_type == target_type and not doc.ocr_text:
            # Trigger OCR if not already done
            extract_ocr_for_document(db, current_user, doc.id)
            
    # 7. Fraud Scoring
    fraud_result = calculate_fraud_score(db, claim)
    claim.fraud_score = fraud_result["fraud_score"]
    
    add_event(
        db, 
        claim_id, 
        "FRAUD_SCORED", 
        f"Fraud score calculated: {claim.fraud_score}", 
        metadata={"signals": fraud_result["signals"]}
    )
    
    # 8. Decision Engine
    # - fraud_score < 30 AND claimed_amount <= 10000 -> APPROVED (auto_approved)
    # - fraud_score 30..60 -> UNDER_REVIEW
    # - fraud_score > 60 -> REJECTED (auto_rejected)
    
    score = claim.fraud_score
    amount = claim.claimed_amount
    
    decision = "UNDER_REVIEW"
    new_status = "UNDER_REVIEW"
    reason = None
    approved_amt = None
    
    if score < 30 and amount <= 10000:
        new_status = "APPROVED"
        decision = "auto_approved"
        approved_amt = amount
    elif score > 60:
        new_status = "REJECTED"
        decision = "auto_rejected"
        # Extract top logic from signals? Or just generic
        reason = "High fraud risk detected based on scoring model."
    else:
        new_status = "UNDER_REVIEW"
        decision = "human_reviewed" # Waiting for human
    
    claim.status = new_status
    claim.decision_type = decision
    if approved_amt:
        claim.approved_amount = approved_amt
    if reason:
        claim.rejection_reason = reason
        
    add_event(db, claim_id, "STATUS_CHANGED", f"Claim {new_status} by decision engine ({decision})")
    
    db.commit()
    db.refresh(claim)
    
    # Return result with signals
    resp = _build_response(claim)
    resp["signals"] = fraud_result["signals"]
    return resp

def _build_response(claim: Claim) -> dict:
    return {
        "claim_id": str(claim.id),
        "claim_number": claim.claim_number,
        "status": claim.status,
        "readiness_score": claim.readiness_score,
        "fraud_score": claim.fraud_score,
        "decision_type": claim.decision_type,
        "rejection_reason": claim.rejection_reason,
        "signals": [] # Default empty
    }
