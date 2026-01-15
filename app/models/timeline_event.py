from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy import Index
import uuid

from app.db.base import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False)
    
    event_type = Column(String, nullable=False)
    # CLAIM_CREATED, DOC_UPLOADED, OCR_EXTRACTED, READINESS_UPDATED, STATUS_CHANGED
    
    actor = Column(String, nullable=False, default="system")
    message = Column(Text, nullable=False)
    
    # We name the python attribute 'event_metadata' and the DB column 'metadata'
    # 'metadata' is a reserved attribute in SQLAlchemy models (for MetaData)
    event_metadata = Column("metadata", JSONB, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("ix_timeline_events_claim_id_created_at", "claim_id", "created_at"),
    )
