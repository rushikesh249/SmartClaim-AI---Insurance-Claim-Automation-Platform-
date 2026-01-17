from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from pydantic import BaseModel
from typing import List, Optional

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.claim import Claim
from app.services.readiness_service import calculate_readiness_score
from app.services.fraud_service import calculate_fraud_score

router = APIRouter()

class RiskAssessmentResponse(BaseModel):
    claim_id: UUID
    readiness_score: Optional[int] = None
    fraud_score: Optional[int] = None
    signals: List[dict] = []

@router.get("/claims/{claim_id}/risk", response_model=RiskAssessmentResponse)
def get_risk_assessment(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get risk assessment for a claim including readiness and fraud scores.
    """
    # Verify user owns the claim
    claim = db.query(Claim).filter(
        Claim.id == claim_id, 
        Claim.user_id == current_user.id
    ).first()
    
    if not claim:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Claim not found")
    
    # Calculate readiness score
    readiness_score = calculate_readiness_score(db, claim_id)
    
    # Calculate fraud score
    fraud_result = calculate_fraud_score(db, claim)
    fraud_score = fraud_result.get("fraud_score", 0)
    
    return RiskAssessmentResponse(
        claim_id=claim_id,
        readiness_score=readiness_score,
        fraud_score=fraud_score,
        signals=fraud_result.get("signals", [])
    )