from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from pathlib import Path
import mimetypes
from starlette.responses import FileResponse
from typing import Optional

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.document import Document
from app.config import settings
from app.utils.security import sanitize_file_path

router = APIRouter()


def verify_user_can_access_document(db: Session, current_user: User, file_path: str) -> Document:
    """
    Verify that the current user has access to the requested document.
    Checks that the file_path corresponds to a document that belongs to a claim owned by the user.
    Works without model relationships to avoid circular imports.
    """
    # Extract claim_id from file_path (format: uploads/<claim_id>/filename)
    path_parts = file_path.split('/')
    if len(path_parts) < 3 or path_parts[0] != 'uploads':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file path format"
        )
    
    claim_id_str = path_parts[1]
    
    # First, find the document by file_path
    document = db.query(Document).filter(Document.file_path == file_path).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Verify the claim exists and belongs to the current user
    from app.models.claim import Claim  # Import locally to avoid circular imports
    claim = db.query(Claim).filter(
        Claim.id == document.claim_id,
        Claim.user_id == current_user.id
    ).first()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied or file not found"
        )
    
    return document


@router.get("/files/{document_id}/view")
def view_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    View a document by document ID.
    Returns the file with inline Content-Disposition for browser preview.
    """
    # Get document by ID and verify ownership without using relationships
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Verify the claim exists and belongs to the current user
    from app.models.claim import Claim  # Import locally to avoid circular imports
    claim = db.query(Claim).filter(
        Claim.id == document.claim_id,
        Claim.user_id == current_user.id
    ).first()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Construct the full file path
    full_file_path = Path(settings.UPLOAD_DIR) / document.file_path
    
    # Check if file exists
    if not full_file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk"
        )
    
    # Determine content type
    content_type, _ = mimetypes.guess_type(str(full_file_path))
    if not content_type:
        content_type = "application/octet-stream"
    
    # Return the file with inline disposition for viewing
    return FileResponse(
        path=str(full_file_path),
        media_type=content_type,
        headers={"Content-Disposition": f'inline; filename="{document.file_name}"'}
    )


@router.get("/files/{document_id}/download")
def download_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Download a document by document ID.
    Returns the file with attachment Content-Disposition for download.
    """
    # Get document by ID and verify ownership without using relationships
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Verify the claim exists and belongs to the current user
    from app.models.claim import Claim  # Import locally to avoid circular imports
    claim = db.query(Claim).filter(
        Claim.id == document.claim_id,
        Claim.user_id == current_user.id
    ).first()
    
    if not claim:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Construct the full file path
    full_file_path = Path(settings.UPLOAD_DIR) / document.file_path
    
    # Check if file exists
    if not full_file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk"
        )
    
    # Determine content type
    content_type, _ = mimetypes.guess_type(str(full_file_path))
    if not content_type:
        content_type = "application/octet-stream"
    
    # Return the file with attachment disposition for download
    return FileResponse(
        path=str(full_file_path),
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="{document.file_name}"'}
    )


@router.get("/files/{file_path:path}")
def serve_file(
    file_path: str,
    download: Optional[bool] = Query(default=False),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Securely serve uploaded files with user access control.
    
    Args:
        file_path: Path to the file (relative to upload directory)
        download: If True, forces download with Content-Disposition: attachment
    """
    # Sanitize the file path to prevent path traversal attacks
    sanitized_path = sanitize_file_path(file_path)
    if sanitized_path != file_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file path"
        )
    
    # Verify user has access to this file
    document = verify_user_can_access_document(db, current_user, file_path)
    
    # Construct the full file path
    full_file_path = Path(settings.UPLOAD_DIR) / sanitized_path
    
    # Check if file exists
    if not full_file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found"
        )
    
    # Determine content type
    content_type, _ = mimetypes.guess_type(str(full_file_path))
    if not content_type:
        content_type = "application/octet-stream"
    
    # Prepare headers
    headers = {"Content-Type": content_type}
    
    # Set content disposition based on download parameter
    if download:
        headers["Content-Disposition"] = f'attachment; filename="{document.file_name}"'
    else:
        headers["Content-Disposition"] = f'inline; filename="{document.file_name}"'
    
    # Return the file
    return FileResponse(
        path=str(full_file_path),
        media_type=content_type,
        headers=headers,
        filename=document.file_name
    )