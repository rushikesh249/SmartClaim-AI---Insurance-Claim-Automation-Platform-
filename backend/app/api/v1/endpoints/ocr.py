from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.ocr import OCRExtractRequest, OCRExtractResponse
from app.services import ocr_service

router = APIRouter()

@router.post("/extract", response_model=OCRExtractResponse)
def ocr_extract(
    request: OCRExtractRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    document = ocr_service.extract_ocr_for_document(db, current_user, request.document_id)
    return OCRExtractResponse(
        document_id=document.id,
        extracted_text=document.ocr_text,
        confidence_score=document.ocr_confidence
    )
