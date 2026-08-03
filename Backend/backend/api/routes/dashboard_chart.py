from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.dashboard_chart import (
    DashboardChartResponse,
)

from backend.services.dashboard_chart_service import (
    get_dashboard_chart_data,
)

router = APIRouter(
    prefix="/admin/dashboard",
    tags=["Admin Dashboard Charts"],
)


@router.get(
    "/charts",
    response_model=DashboardChartResponse,
)
def dashboard_charts(
    db: Session = Depends(get_db),
):

    return get_dashboard_chart_data(db)