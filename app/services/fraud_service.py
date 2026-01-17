from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import collections

from app.models.claim import Claim
from app.models.policy import Policy
from app.models.document import Document

def calculate_fraud_score(db: Session, claim: Claim) -> dict:
    """
    Calculate fraud score (0-100) based on signals.
    Returns: { "fraud_score": int, "signals": list[dict] }
    """
    score = 0
    signals = []
    
    # 1. Duplicates check
    # if any document.is_duplicate true => +40
    has_duplicates = db.query(Document).filter(
        Document.claim_id == claim.id,
        Document.is_duplicate == True
    ).first()
    
    if has_duplicates:
        mod = 40
        score += mod
        signals.append({"type": "document_anomaly", "score": mod, "message": "Duplicate documents detected"})

    # 2. Amount anomaly
    # if claimed_amount > 0.8 * policy.sum_insured => +20
    policy = db.query(Policy).filter(Policy.id == claim.policy_id).first()
    if policy:
        limit = policy.sum_insured * 0.8
        # Ensure conversion if needed, sqlalchemy usually handles Decimal comparison
        if claim.claimed_amount > limit:
            mod = 20
            score += mod
            signals.append({"type": "amount_anomaly", "score": mod, "message": "Claim amount > 80% of sum insured"})

    # 3. Too many claims
    # if same user has >3 claims in last 365 days => +15
    one_year_ago = datetime.now() - timedelta(days=365)
    claim_count = db.query(Claim).filter(
        Claim.user_id == claim.user_id,
        Claim.created_at >= one_year_ago
    ).count()
    
    # Current claim counts as one, so >3 means check if count > 3 inclusive?
    # Requirement: ">3 claims". logic: if count > 3.
    if claim_count > 3:
        mod = 15
        score += mod
        signals.append({"type": "frequency_anomaly", "score": mod, "message": f"High claim frequency ({claim_count} in last year)"})

    # 4. Low doc quality
    # if average document quality_score < 50 => +15
    docs = db.query(Document).filter(Document.claim_id == claim.id).all()
    if docs:
        avg_quality = sum(d.quality_score for d in docs) / len(docs)
        if avg_quality < 50:
            mod = 15
            score += mod
            signals.append({"type": "quality_anomaly", "score": mod, "message": "Low average document quality"})

    # 5. Missing OCR confidence
    # if health claim and hospital_bill OCR confidence < 50 => +10
    if claim.claim_type == "health":
        bill_doc = next((d for d in docs if d.document_type == "hospital_bill"), None)
        if bill_doc:
            # Check confidence. Handle None as 0
            conf = bill_doc.ocr_confidence or 0
            if conf < 50:
                mod = 10
                score += mod
                signals.append({"type": "ocr_anomaly", "score": mod, "message": "Low OCR confidence for hospital bill"})

    return {
        "fraud_score": min(score, 100),
        "signals": signals
    }
