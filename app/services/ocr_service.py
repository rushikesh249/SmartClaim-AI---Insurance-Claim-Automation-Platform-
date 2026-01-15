from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
import pytesseract
from PIL import Image

from app.models.document import Document
from app.models.claim import Claim
from app.models.user import User
from app.services.timeline_service import add_event

def extract_ocr_for_document(db: Session, current_user: User, document_id: UUID):
    # 1. Fetch document and verify ownership via claim
    document = db.query(Document).join(Claim).filter(
        Document.id == document_id,
        Claim.user_id == current_user.id
    ).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found or access denied"
        )
        
    # 2. Run OCR
    file_path = document.file_path
    extracted_text = ""
    confidence = 0
    
    try:
        # Check if pytesseract available is implicit in import, but binary might strictly be missing
        # User said "fallback to return empty text... (do not crash)"
        
        # Simple check if image
        if document.mime_type.startswith('image/'):
            text = pytesseract.image_to_string(Image.open(file_path))
            extracted_text = text.strip()
            
            # Simple confidence score heuristic
            if len(extracted_text) > 50:
                confidence = 85
            elif len(extracted_text) > 0:
                confidence = 60
            else:
                confidence = 30
        else:
            # Not an image
            extracted_text = "[OCR not supported for this file type]"
            confidence = 0
            
    except Exception as e:
        # Fallback
        extracted_text = ""
        confidence = 0
        # Optional: log error
        
    # 3. Update document
    document.ocr_text = extracted_text
    document.ocr_confidence = confidence
    db.commit()
    db.refresh(document)
    
    # 4. Timeline Event
    add_event(
        db, 
        document.claim_id, 
        "OCR_EXTRACTED", 
        f"OCR performed on {document.file_name}",
        metadata={
            "document_id": str(document.id),
            "confidence": confidence,
            "text_length": len(extracted_text)
        }
    )
    
    return document
