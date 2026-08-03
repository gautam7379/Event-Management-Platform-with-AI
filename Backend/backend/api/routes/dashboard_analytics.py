from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.services.dashboard_analytics_service import (
    get_dashboard_analytics,
)
from backend.schemas.dashboard_analytics import (
    DashboardAnalyticsResponse,
)

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard Analytics"],
)


@router.get(
    "/analytics",
    response_model=DashboardAnalyticsResponse,
)
def dashboard_analytics(
    db: Session = Depends(get_db),
):
    """
    Get admin dashboard analytics.
    """

    return get_dashboard_analytics(db)