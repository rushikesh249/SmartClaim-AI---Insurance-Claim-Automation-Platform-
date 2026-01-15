from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.document import DocumentUploadResponse, DocumentListResponse
from app.services import document_service

router = APIRouter()

@router.post("/claims/{claim_id}/documents", response_model=DocumentUploadResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    claim_id: UUID,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return document_service.upload_document(db, current_user, claim_id, document_type, file)

@router.get("/claims/{claim_id}/documents", response_model=List[DocumentUploadResponse])
def list_documents(
    claim_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return document_service.list_documents_for_claim(db, current_user, claim_id)
