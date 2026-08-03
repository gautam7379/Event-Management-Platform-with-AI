from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.dashboard import (
    DashboardRequest,
    DashboardResponse,
)

from backend.services.dashboard_service import (
    generate_dashboard_insights,
)

router = APIRouter(
    prefix="/ai/dashboard",
    tags=["AI Dashboard"],
)


@router.post(
    "/",
    response_model=DashboardResponse,
)
def ai_dashboard(
    request: DashboardRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI Organizer Dashboard Insights.
    """

    try:

        dashboard = generate_dashboard_insights(
            db=db,
            event_id=request.event_id,
            prompt=request.prompt,
        )

        return {
            "dashboard": dashboard,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )