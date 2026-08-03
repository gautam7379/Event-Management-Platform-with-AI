from fastapi import APIRouter, Depends

from backend.dependencies.role import require_admin
from backend.models.user import User

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)

@router.get("/dashboard")
def admin_dashboard(
    current_user: User = Depends(require_admin),
):
    """
    Admin-only endpoint.
    """
    return {
        "message": f"Welcome Admin {current_user.first_name}",
        "role": current_user.role.role_name,
    }