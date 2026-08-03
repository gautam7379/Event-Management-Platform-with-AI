from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.ai.analytics_context import (
    build_analytics_context,
)

from backend.ai.analytics_generator import (
    generate_event_analytics,
)

from backend.schemas.ai_analytics import (
    AIAnalyticsRequest,
    AIAnalyticsResponse,
)

router = APIRouter(
    prefix="/ai/analytics",
    tags=["AI Analytics"],
)


@router.post(
    "/",
    response_model=AIAnalyticsResponse,
)
def ai_analytics(
    request: AIAnalyticsRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI-powered event analytics.
    """

    try:

        context = build_analytics_context(
            db=db,
            event_id=request.event_id,
        )

        analytics = generate_event_analytics(
            context=context,
            prompt=request.prompt,
        )

        return {
            "analytics": analytics,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )