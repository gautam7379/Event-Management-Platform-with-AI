from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.budget_analysis import (
    BudgetAnalysisRequest,
    BudgetAnalysisResponse,
)

from backend.services.budget_service import (
    generate_event_budget_analysis,
)

router = APIRouter(
    prefix="/ai/budget",
    tags=["AI Budget Analysis"],
)


@router.post(
    "/",
    response_model=BudgetAnalysisResponse,
)
def ai_budget_analysis(
    request: BudgetAnalysisRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI Budget Analysis.
    """

    try:

        analysis = generate_event_budget_analysis(
            db=db,
            event_id=request.event_id,
            prompt=request.prompt,
        )

        return {
            "analysis": analysis,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )