from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.user import UserRegister, UserResponse
from backend.schemas.auth import Token
from fastapi.security import OAuth2PasswordRequestForm

from backend.services.auth_service import (
    register_user,
    login_user,
)

from backend.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserRegister,
    db: Session = Depends(get_db),
):
    """
    Register a new user.
    """
    try:
        return register_user(
            db=db,
            user=user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=Token,
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    """
    Login user and return JWT access token.
    """
    try:
        return login_user(
            db=db,
            form_data=form_data,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
@router.get(
    "/me",
    response_model=UserResponse,
)
def get_profile(
    current_user=Depends(get_current_user),
):
    """
    Get currently logged-in user.
    """
    return current_user