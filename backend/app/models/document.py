from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.db.base import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_id = Column(UUID(as_uuid=True), ForeignKey("claims.id"), nullable=False, index=True)
    uploaded_by_user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    document_type = Column(String, nullable=False)
    # types: hospital_bill, discharge_summary, prescription, rc_book, repair_estimate, fir, accident_photo
    
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)
    
    ocr_text = Column(Text, nullable=True)
    ocr_confidence = Column(Integer, nullable=True) # 0-100
    
    quality_score = Column(Integer, nullable=False, default=0) # 0-100
    
    phash = Column(String, nullable=True, index=True) # perceptual hash (hex)
    is_duplicate = Column(Boolean, nullable=False, default=False)
    duplicate_of_document_id = Column(UUID(as_uuid=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
