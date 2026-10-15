from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.dependencies.role import require_admin
from backend.database.database import get_db
from backend.models.user import User
from backend.schemas.user import UserResponse


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@router.get("/dashboard")
def admin_dashboard(
    current_user: User = Depends(require_admin),
):
    """
    Admin-only dashboard endpoint.
    """

    return {
        "message": f"Welcome Admin {current_user.first_name}",
        "role": current_user.role.role_name,
    }


# ==========================================
# GET ALL USERS
# ==========================================

@router.get(
    "/users",
    response_model=list[UserResponse],
)
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    """
    Get all registered users.
    Admin only.
    """

    return (
        db.query(User)
        .order_by(User.id)
        .all()
    )