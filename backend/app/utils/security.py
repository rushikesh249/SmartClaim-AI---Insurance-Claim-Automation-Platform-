from datetime import datetime, timedelta
from typing import Dict, Any
from passlib.context import CryptContext
from jose import JWTError, jwt

from app.config import settings
from app.utils.logger import setup_logger
from pathlib import Path

logger = setup_logger(__name__)

# Password hashing context using bcrypt
# Note: bcrypt automatically handles UTF-8 encoding
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a plain text password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    # Ensure password is a string and limit to 72 bytes (bcrypt limitation)
    if not isinstance(password, str):
        raise ValueError("Password must be a string")
    
    # Encode to UTF-8 and truncate to 72 bytes if needed
    password_bytes = password.encode('utf-8')
    if len(password_bytes) > 72:
        password_bytes = password_bytes[:72]
        password = password_bytes.decode('utf-8', errors='ignore')
    
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification failed: {str(e)}")
        return False


def create_access_token(data: Dict[str, Any], expires_minutes: int = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Data to encode in the token (typically {"sub": user_id})
        expires_minutes: Token expiration time in minutes (defaults to settings)
        
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Set expiration time
    if expires_minutes is None:
        expires_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    
    # Create JWT token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a JWT access token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload
        
    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except JWTError as e:
        logger.error(f"JWT decode error: {str(e)}")
        raise


def sanitize_phone(phone: str) -> str:
    """
    Sanitize phone number by removing non-digit characters.
    
    Args:
        phone: Raw phone number string
        
    Returns:
        Cleaned phone number containing only digits
    """
    if not phone:
        return ""
    
    # Remove all non-digit characters
    cleaned = "".join(char for char in phone if char.isdigit())
    
    # Validate length (should be 10-15 digits)
    if len(cleaned) < 10 or len(cleaned) > 15:
        raise ValueError("Phone number must be between 10 and 15 digits")
    
    return cleaned

def sanitize_file_path(file_path: str) -> str:
    """
    Sanitize file path to prevent directory traversal attacks.
    
    Args:
        file_path: Original file path
        
    Returns:
        Sanitized file path
        
    Raises:
        ValueError: If path traversal is detected
    """
    # Check for path traversal patterns
    if '..' in file_path or '../' in file_path or file_path.startswith('../'):
        raise ValueError("Path traversal detected")
    
    # Normalize path separators
    normalized_path = file_path.replace('\\', '/')
    
    # Validate that path starts with uploads/
    if not normalized_path.startswith('uploads/'):
        raise ValueError("Invalid file path format")
    
    return normalized_path
