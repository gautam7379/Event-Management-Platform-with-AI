from fastapi import Depends, HTTPException, status

from backend.dependencies.auth import get_current_user
from backend.models.user import User


def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow only Admin users.
    """
    if current_user.role.role_name != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )

    return current_user

def require_admin_or_organizer(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Allow only Admin or Organizer users.
    """

    allowed_roles = [
        "Admin",
        "Organizer",
    ]

    if current_user.role.role_name not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin or Organizer access required.",
        )

    return current_user