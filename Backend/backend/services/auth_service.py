from sqlalchemy.orm import Session

from backend.crud.user import (
    create_user,
    get_user_by_email,
)
from backend.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from backend.schemas.user import UserRegister
from backend.schemas.auth import UserLogin, Token
from backend.models.user import User
from fastapi.security import OAuth2PasswordRequestForm

def register_user(
    db: Session,
    user: UserRegister,
) -> User:
    """
    Register a new user.
    """

    existing_user = get_user_by_email(
        db,
        user.email,
    )

    if existing_user:
        raise ValueError(
            "Email is already registered."
        )

    hashed_password = hash_password(
        user.password
    )

    return create_user(
        db=db,
        user=user,
        hashed_password=hashed_password,
    )

from backend.schemas.auth import (
    UserLogin,
    Token,
)


def login_user(
    db: Session,
    form_data: OAuth2PasswordRequestForm,
) -> Token:
    """
    Authenticate user and generate JWT token.
    """

    db_user = get_user_by_email(
        db,
        form_data.username,
    )

    if not db_user:
        raise ValueError(
            "Invalid email or password."
        )

    if not verify_password(
        form_data.password,
        db_user.password_hash,
    ):
        raise ValueError(
            "Invalid email or password."
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "user_id": db_user.id,
        }
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
    )