from sqlalchemy.orm import Session
from datetime import datetime, date

from app.models.claim import Claim
from app.models.policy import Policy
from app.models.document import Document
from app.services.timeline_service import add_event

REQUIRED_DOCS_HEALTH = {"hospital_bill", "discharge_summary", "prescription"}
REQUIRED_DOCS_MOTOR = {"accident_photo", "repair_estimate", "rc_book"}

def validate_claim(db: Session, claim: Claim) -> dict:
    """
    Validate a claim against business rules.
    Returns: {"passed": bool, "reasons": list[str]}
    """
    reasons = []
    passed = True
    
    # 1. Fetch policy
    policy = db.query(Policy).filter(Policy.id == claim.policy_id).first()
    
    # Rule: Policy must exist and belong to user (claim.user_id)
    if not policy:
        reasons.append("Policy not found")
        passed = False
    elif policy.user_id != claim.user_id:
        reasons.append("Policy does not belong to the user")
        passed = False
    
    if not passed:
        return {"passed": False, "reasons": reasons}

    # Rule: Policy must be active AND today between start_date and end_date
    today = date.today()
    if policy.status != "active":
        reasons.append(f"Policy status is {policy.status}")
        passed = False
    
    if not (policy.start_date <= today <= policy.end_date):
        reasons.append("Policy is not currently active (date mismatch)")
        passed = False

    # Rule: claimed_amount <= policy.sum_insured
    # Ensure types are compatible (Decimal)
    if claim.claimed_amount > policy.sum_insured:
        reasons.append(f"Claimed amount ({claim.claimed_amount}) exceeds sum insured ({policy.sum_insured})")
        passed = False

    # Rule: Required documents must exist based on claim.claim_type
    required_docs = set()
    if claim.claim_type == "health":
        required_docs = REQUIRED_DOCS_HEALTH
    elif claim.claim_type == "motor":
        required_docs = REQUIRED_DOCS_MOTOR
    
    if required_docs:
        uploaded_docs = db.query(Document.document_type).filter(
            Document.claim_id == claim.id,
            Document.is_duplicate == False
        ).all()
        uploaded_types = {row[0] for row in uploaded_docs}
        
        missing = required_docs - uploaded_types
        if missing:
            reasons.append(f"Missing required documents: {', '.join(missing)}")
            passed = False

    return {"passed": passed, "reasons": reasons}
