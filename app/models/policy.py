from sqlalchemy import Column, String, Numeric, Date, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
import uuid

from app.db.base import Base

class Policy(Base):
    """
    Policy model representing an insurance policy linked to a user.
    """
    __tablename__ = "policies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    policy_number = Column(String, unique=True, index=True, nullable=False)
    policy_type = Column(String, nullable=False)  # "health" or "motor"
    insurer_name = Column(String, nullable=False)
    sum_insured = Column(Numeric(12, 2), nullable=False)
    premium_amount = Column(Numeric(10, 2), nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String, default="active")  # active/expired/cancelled
    coverage_details = Column(JSONB, nullable=True)
    created_at = Column(
        DateTime(timezone=True), 
        server_default=func.now(), 
        nullable=True
    )

    # No relationships defined as per instructions to avoid circular imports in MVP
