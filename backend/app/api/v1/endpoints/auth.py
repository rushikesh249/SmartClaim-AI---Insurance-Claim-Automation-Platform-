from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.schemas.auth import RegisterRequest, TokenResponse
from app.schemas.user import UserResponse
from app.models.user import User
from app.utils.security import hash_password, verify_password, create_access_token
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

router = APIRouter(tags=["Auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Register a new user.

    - **name**: User's full name
    - **phone**: Unique phone number (10-15 digits)
    - **email**: Optional email address
    - **password**: Password (minimum 6 characters)

    Returns JWT access token upon successful registration.
    """

    # Check if phone already exists
    existing_user = db.query(User).filter(User.phone == request.phone).first()
    if existing_user:
        logger.warning(f"Registration attempt with existing phone: {request.phone}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )

    # Hash password
    password_hash = hash_password(request.password)

    # Create new user
    new_user = User(
        name=request.name,
        phone=request.phone,
        email=request.email,
        password_hash=password_hash,
        language_preference="en"  # Default language
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        logger.info(f"New user registered: {new_user.id}")
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )

    # Generate JWT token
    access_token = create_access_token(data={"sub": str(new_user.id)})

    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Login with phone and password.

    Swagger Authorize sends:
    - username = phone
    - password = password

    Returns JWT access token upon successful authentication.
    """

    phone = form_data.username
    password = form_data.password

    # Find user by phone
    user = db.query(User).filter(User.phone == phone).first()

    if not user:
        logger.warning(f"Login attempt with non-existent phone: {phone}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Verify password
    if not verify_password(password, user.password_hash):
        logger.warning(f"Failed login attempt for user: {user.id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT token
    access_token = create_access_token(data={"sub": str(user.id)})

    logger.info(f"User logged in: {user.id}")

    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """
    Get current authenticated user information.

    Requires valid JWT token in Authorization header.

    Returns user profile data (excluding password).
    """
    logger.info(f"User info requested: {current_user.id}")
    return UserResponse.model_validate(current_user)
