from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.ai.analytics_context import (
    build_analytics_context,
)

from backend.ai.health_score_generator import (
    generate_health_score,
)

from backend.schemas.health_score import (
    HealthScoreRequest,
    HealthScoreResponse,
)

router = APIRouter(
    prefix="/ai/health",
    tags=["AI Health"],
)


@router.post(
    "/",
    response_model=HealthScoreResponse,
)
def ai_health(
    request: HealthScoreRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI Event Health Assessment.
    """

    try:

        context = build_analytics_context(
            db=db,
            event_id=request.event_id,
        )

        report = generate_health_score(
            context=context,
            prompt=request.prompt,
        )

        return {
            "health_report": report,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )