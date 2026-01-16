from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class OCRExtractRequest(BaseModel):
    document_id: UUID

class OCRExtractResponse(BaseModel):
    document_id: UUID
    extracted_text: Optional[str] = None
    confidence_score: Optional[int] = None
