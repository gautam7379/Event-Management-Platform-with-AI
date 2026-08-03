from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.feedback import (
    FeedbackCreate,
    FeedbackResponse,
)

from backend.services.feedback_service import (
    create_new_feedback,
)

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"],
)


@router.post(
    "/",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
):
    """
    Submit event feedback.
    """

    try:
        return create_new_feedback(
            db=db,
            feedback=feedback,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )