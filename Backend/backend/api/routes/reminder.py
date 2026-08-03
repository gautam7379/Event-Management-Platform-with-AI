from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.communication.reminder_service import (
    send_event_reminders,
)
from backend.database.database import get_db
from backend.schemas.reminder import (
    ReminderResponse,
)

router = APIRouter(
    prefix="/reminders",
    tags=["Reminders"],
)


@router.post(
    "/event/{event_id}",
    response_model=ReminderResponse,
)
def send_reminder(
    event_id: int,
    db: Session = Depends(get_db),
):
    try:

        return send_event_reminders(
            db,
            event_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )