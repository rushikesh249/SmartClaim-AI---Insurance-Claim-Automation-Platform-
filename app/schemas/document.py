from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List

# Option to use strict Enum, but user said string is OK
class DocumentUploadResponse(BaseModel):
    id: UUID
    claim_id: UUID
    document_type: str
    file_path: str
    quality_score: int
    is_duplicate: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DocumentListResponse(BaseModel):
    documents: List[DocumentUploadResponse]
