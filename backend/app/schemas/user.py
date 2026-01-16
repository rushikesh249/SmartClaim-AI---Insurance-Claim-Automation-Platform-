from pydantic import BaseModel, ConfigDict
from datetime import datetime
from uuid import UUID
from typing import Optional


class UserResponse(BaseModel):
    """User response schema - excludes password_hash for security."""
    
    id: UUID
    name: str
    phone: str
    email: Optional[str] = None
    language_preference: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
