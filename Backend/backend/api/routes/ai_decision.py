from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.decision_support import (
    DecisionSupportRequest,
    DecisionSupportResponse,
)

from backend.services.decision_support_service import (
    generate_event_decision_support,
)

router = APIRouter(
    prefix="/ai/decision",
    tags=["AI Decision Support"],
)


@router.post(
    "/",
    response_model=DecisionSupportResponse,
)
def ai_decision_support(
    request: DecisionSupportRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI Decision Support recommendations.
    """

    try:

        advice = generate_event_decision_support(
            db=db,
            event_id=request.event_id,
            prompt=request.prompt,
        )

        return {
            "advice": advice,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )