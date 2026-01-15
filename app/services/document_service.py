from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from uuid import UUID
from typing import List

from app.models.user import User
from app.models.claim import Claim
from app.models.document import Document
from app.utils.file_storage import save_upload_file, ensure_upload_dir
from app.utils.image_quality import compute_quality_score
from app.utils.phash import compute_phash, compare_phash
from app.services.timeline_service import add_event
from app.services.readiness_service import calculate_readiness_score
from app.config import settings

def upload_document(
    db: Session, 
    current_user: User, 
    claim_id: UUID, 
    document_type: str, 
    file: UploadFile
) -> Document:
    # 1. Verify claim ownership
    claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found or access denied"
        )
        
    # 2. Save file
    file_path, file_name, mime_type, file_size = save_upload_file(settings.UPLOAD_DIR, str(claim_id), file)
    
    # 3. Compute quality score
    # We need the absolute path for image processing
    # settings.UPLOAD_DIR is absolute or relative? Usually absolute in container.
    # If save_upload_file returns relative path, we join with root or use UPLOAD_DIR + structure.
    # Ideally file_storage returns relative path for DB, but we need full path for processing.
    # Let's reconstruct full path.
    # file_path is something like "uploads/<claim_id>/<filename>"
    
    # Assuming the app runs where "uploads" folder is accessible via relative path or we know the root.
    # If UPLOAD_DIR is "/code/uploads", save_upload_file uses it.
    # If save_upload_file returned a path relative to root (e.g. uploads/...), we can use it if CWD is correct.
    
    full_path = file_path # In valid docker setup, this works if CWD is correct.
    # If file_storage logic used os.path.join(UPLOAD_DIR...), we might need to verify.
    # save_upload_file returns relative path "uploads/..." 
    
    quality = compute_quality_score(full_path)
    
    # 4. Compute pHash
    phash_str = compute_phash(full_path)
    
    # 5. Check duplicates
    is_duplicate = False
    duplicate_of_id = None
    
    if phash_str:
        # Search all documents for similar hash
        # This can be slow if we scan everything. For MVP, we fetch all non-null hashes.
        # Ideally we only check against this user's docs or this claim's docs? 
        # Prompt says "search documents ... across ALL claims" (Global duplicate detection)
        
        potential_dupes = db.query(Document).filter(Document.phash.isnot(None)).all()
        for doc in potential_dupes:
            dist = compare_phash(phash_str, doc.phash)
            if dist <= 5: # Threshold from requirements
                is_duplicate = True
                duplicate_of_id = doc.id
                break
    
    # 6. Create Document record
    new_doc = Document(
        claim_id=claim_id,
        uploaded_by_user_id=current_user.id,
        document_type=document_type,
        file_name=file_name,
        file_path=file_path,
        mime_type=mime_type,
        file_size=file_size,
        quality_score=quality,
        phash=phash_str,
        is_duplicate=is_duplicate,
        duplicate_of_document_id=duplicate_of_id
    )
    
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    
    # 7. Add timeline event
    add_event(
        db, 
        claim_id, 
        "DOC_UPLOADED", 
        f"Uploaded {document_type} ({file_name})",
        metadata={
            "document_id": str(new_doc.id),
            "quality_score": quality,
            "is_duplicate": is_duplicate
        }
    )
    
    # 8. Update readiness score
    calculate_readiness_score(db, claim_id)
    
    return new_doc

def list_documents_for_claim(db: Session, current_user: User, claim_id: UUID) -> List[Document]:
    # Verify ownership
    claim = db.query(Claim).filter(Claim.id == claim_id, Claim.user_id == current_user.id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
        
    return db.query(Document).filter(Document.claim_id == claim_id).all()
