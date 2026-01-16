from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Any
from uuid import UUID

class Signal(BaseModel):
    type: str
    score: int
    message: str

class SubmitClaimResponse(BaseModel):
    claim_id: UUID
    claim_number: str
    status: str
    readiness_score: Optional[int]
    fraud_score: Optional[int]
    decision_type: Optional[str]
    rejection_reason: Optional[str]
    signals: List[Signal] = []

    model_config = ConfigDict(from_attributes=True)
