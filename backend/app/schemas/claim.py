from pydantic import BaseModel, Field, ConfigDict, field_validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
from uuid import UUID

class ClaimCreateRequest(BaseModel):
    policy_id: UUID
    claim_type: str = Field(..., pattern="^(health|motor)$")
    incident_date: datetime
    incident_location: Optional[str] = None
    incident_description: Optional[str] = None
    claimed_amount: Decimal = Field(..., gt=0)

class ClaimUpdateRequest(BaseModel):
    incident_date: Optional[datetime] = None
    incident_location: Optional[str] = None
    incident_description: Optional[str] = None
    claimed_amount: Optional[Decimal] = None

    @field_validator('claimed_amount')
    @classmethod
    def validate_amount(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None and v <= 0:
            raise ValueError('Claimed amount must be greater than 0')
        return v

class ClaimResponse(BaseModel):
    id: UUID
    claim_number: str
    policy_id: UUID
    user_id: UUID
    claim_type: str
    incident_date: datetime
    incident_location: Optional[str]
    incident_description: Optional[str]
    claimed_amount: Decimal
    approved_amount: Optional[Decimal]
    status: str
    readiness_score: Optional[int]
    fraud_score: Optional[int]
    decision_type: Optional[str]
    rejection_reason: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
