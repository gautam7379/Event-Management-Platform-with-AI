from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.checkin import (
    CheckInCreate,
    CheckInResponse,
)

from backend.services.checkin_service import (
    create_new_checkin,
)

router = APIRouter(
    prefix="/checkins",
    tags=["Check-In"],
)


@router.post(
    "/",
    response_model=CheckInResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_checkin(
    checkin: CheckInCreate,
    db: Session = Depends(get_db),
):
    """
    Create attendee check-in.
    """

    try:
        return create_new_checkin(
            db=db,
            checkin=checkin,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )