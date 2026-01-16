from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

class PolicyLinkRequest(BaseModel):
    policy_number: str
    policy_type: str = Field(..., pattern="^(health|motor)$")
    insurer_name: str
    sum_insured: Decimal = Field(..., gt=0)
    premium_amount: Optional[Decimal] = None
    start_date: date
    end_date: date
    coverage_details: Optional[Dict[str, Any]] = None

class PolicyResponse(BaseModel):
    id: UUID
    user_id: UUID
    policy_number: str
    policy_type: str
    insurer_name: str
    sum_insured: Decimal
    premium_amount: Optional[Decimal]
    start_date: date
    end_date: date
    status: str
    coverage_details: Optional[Dict[str, Any]]
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
