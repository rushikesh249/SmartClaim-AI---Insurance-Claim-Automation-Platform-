import os
import shutil
from pathlib import Path
from datetime import datetime
from fastapi import UploadFile, HTTPException, status
from typing import Tuple

from app.config import settings

def ensure_upload_dir(directory: str) -> None:
    """Ensure the upload directory exists."""
    os.makedirs(directory, exist_ok=True)

def save_upload_file(
    upload_dir: str, 
    claim_id: str, 
    uploaded_file: UploadFile
) -> Tuple[str, str, str, int]:
    """
    Save an uploaded file to the disk with security validation.
    
    Returns:
        (file_path, file_name, mime_type, file_size)
    """
    """
    Save an uploaded file to the disk.
    
    Returns:
        (file_path, file_name, mime_type, file_size)
    """
    # Validate claim_id to prevent path traversal
    if not claim_id or ".." in str(claim_id) or "/" in str(claim_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid claim ID"
        )
    
    claim_dir = os.path.join(upload_dir, str(claim_id))
    ensure_upload_dir(claim_dir)
    
    original_filename = uploaded_file.filename or "unnamed_file"
    # Sanitize filename to prevent path traversal and invalid characters
    original_filename = os.path.basename(original_filename)
    # Remove dangerous characters
    original_filename = "".join(c for c in original_filename if c.isalnum() or c in "._- ()[]")
    if not original_filename:
        original_filename = "unnamed_file"
    
    timestamp = int(datetime.utcnow().timestamp())
    file_name = f"{timestamp}_{original_filename}"
    file_path = os.path.join(claim_dir, file_name)
    
    # Write file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(uploaded_file.file, buffer)
            
        file_size = os.path.getsize(file_path)
        
        # Calculate relative path for storage
        # Store path format: uploads/<claim_id>/<timestamp>_<original_filename>
        # This ensures consistent format for file serving verification
            
        relative_path = os.path.join("uploads", str(claim_id), file_name)
        
        return relative_path, original_filename, uploaded_file.content_type or "application/octet-stream", file_size
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
    finally:
        uploaded_file.file.close()
