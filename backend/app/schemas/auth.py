from pydantic import BaseModel, Field, field_validator
from typing import Optional


class RegisterRequest(BaseModel):
    """User registration request schema."""
    
    name: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=10, max_length=15)
    email: Optional[str] = None
    password: str = Field(..., min_length=6)
    
    @field_validator('phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Validate phone number format."""
        if not v.isdigit():
            raise ValueError('Phone must contain only digits')
        return v


class LoginRequest(BaseModel):
    """User login request schema."""
    
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=6)


class TokenResponse(BaseModel):
    """JWT token response schema."""
    
    access_token: str
    token_type: str = "bearer"
