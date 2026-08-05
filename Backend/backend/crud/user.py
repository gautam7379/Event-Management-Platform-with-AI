from sqlalchemy.orm import Session

from backend.models.user import User
from backend.schemas.user import UserRegister, UserUpdate


def get_user_by_email(
    db: Session,
    email: str,
) -> User | None:
    """
    Fetch a user by email.
    """
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )
def get_user_by_id(
    db: Session,
    user_id: int,
) -> User | None:
    """
    Fetch a user by ID.
    """
    return (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

def create_user(
    db: Session,
    user: UserRegister,
    hashed_password: str,
) -> User:
    """
    Create a new user.
    """
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        password_hash=hashed_password,
        phone=user.phone,
        role_id=user.role_id,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

def update_user(
    db: Session,
    db_user: User,
    user: UserUpdate,
) -> User:
    """
    Update user profile information.
    """

    update_data = user.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)

    return db_user