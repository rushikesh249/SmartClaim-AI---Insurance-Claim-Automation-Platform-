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
    Save an uploaded file to the disk.
    
    Returns:
        (file_path, file_name, mime_type, file_size)
    """
    claim_dir = os.path.join(upload_dir, str(claim_id))
    ensure_upload_dir(claim_dir)
    
    original_filename = uploaded_file.filename or "unnamed_file"
    # sanitize filename simple approach
    original_filename = os.path.basename(original_filename)
    
    timestamp = int(datetime.utcnow().timestamp())
    file_name = f"{timestamp}_{original_filename}"
    file_path = os.path.join(claim_dir, file_name)
    
    # Write file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(uploaded_file.file, buffer)
            
        file_size = os.path.getsize(file_path)
        
        # Calculate relative path for storage
        # We need the path relative to UPLOAD_DIR or just from 'uploads'
        # Let's store relative to the app root or just 'uploads/...'
        # User requirement: "Store path format: uploads/<claim_id>/<timestamp>_<original_filename>"
        # Assuming UPLOAD_DIR is 'uploads' or absolute path ending in 'uploads'
        
        relative_path = os.path.join("uploads", str(claim_id), file_name)
        # Assuming 'uploads' is the folder name in root. 
        # Ideally we should construct this based on settings.UPLOAD_DIR name.
        # But hardcoding 'uploads' as per user format request if plausible.
        
        # Adjust relative path if settings.UPLOAD_DIR is deeper. 
        # But generally we store the path we can use to serve or find it later.
        
        return relative_path, original_filename, uploaded_file.content_type or "application/octet-stream", file_size
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
    finally:
        uploaded_file.file.close()
