from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.ai import (
    AIPlanningRequest,
    AIPlanningResponse,
)
from backend.services.ai_service import (
    generate_ai_plan,
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Planning"],
)


@router.post(
    "/planning",
    response_model=AIPlanningResponse,
    status_code=status.HTTP_200_OK,
)
def generate_plan(
    request: AIPlanningRequest,
    db: Session = Depends(get_db),
):
    """
    Generate an AI-powered event planning response.
    """

    try:
        response = generate_ai_plan(
            prompt=request.prompt,
            db=db,
            event_id=request.event_id,
        )

        return AIPlanningResponse(
            response=response
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI generation failed: {str(e)}",
        )