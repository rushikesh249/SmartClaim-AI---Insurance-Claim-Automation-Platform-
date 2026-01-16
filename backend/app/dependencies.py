"""
Shared dependencies for the application.
These can be used across different API endpoints.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

from app.db.session import get_db
from app.utils.security import decode_access_token
from app.models.user import User
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

# OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    Dependency to get the current authenticated user from JWT token.
    
    Args:
        db: Database session
        token: JWT token from Authorization header
        
    Returns:
        Current authenticated user
        
    Raises:
        HTTPException: 401 if token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode JWT token
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        
        if user_id is None:
            logger.warning("Token missing 'sub' claim")
            raise credentials_exception
            
    except JWTError as e:
        logger.warning(f"JWT validation failed: {str(e)}")
        raise credentials_exception
    
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        logger.warning(f"User not found for id: {user_id}")
        raise credentials_exception
    
    return user


# Re-export for convenience
__all__ = ["get_db", "get_current_user", "oauth2_scheme"]
