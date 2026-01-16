from sqlalchemy import Column, String, Numeric, DateTime, Text, Integer, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base import Base

class Claim(Base):
    """
    Claim model representing an insurance claim against a policy.
    """
    __tablename__ = "claims"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_number = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    policy_id = Column(UUID(as_uuid=True), ForeignKey("policies.id"), nullable=False)
    claim_type = Column(String, nullable=False)  # "health" or "motor"
    incident_date = Column(DateTime(timezone=True), nullable=False)
    incident_location = Column(String, nullable=True)
    incident_description = Column(Text, nullable=True)
    
    claimed_amount = Column(Numeric(12, 2), nullable=False)
    approved_amount = Column(Numeric(12, 2), nullable=True)
    
    status = Column(String, default="DRAFT") 
    # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, PAID
    
    readiness_score = Column(Integer, nullable=True)
    fraud_score = Column(Integer, nullable=True)
    decision_type = Column(String, nullable=True) # auto_approved, auto_rejected, human_reviewed
    rejection_reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        onupdate=func.now()
    )
