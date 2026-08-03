from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
)
from backend.services.event_service import (
    create_new_event,
    get_all_events,
    get_event,
    update_existing_event,
    delete_existing_event,
)
from backend.dependencies.role import require_admin_or_organizer

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


@router.post(
    "/",
    response_model=EventResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_event(
    event: EventCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_organizer),
):
    """
    Create a new event.
    """
    try:
        return create_new_event(
            db=db,
            event=event,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.get(
    "/",
    response_model=list[EventResponse],
)
def read_events(
    db: Session = Depends(get_db),
):
    """
    Get all events.
    """
    return get_all_events(db)

@router.get(
    "/{event_id}",
    response_model=EventResponse,
)
def read_event(
    event_id: int,
    db: Session = Depends(get_db),
):
    """
    Get event by ID.
    """
    try:
        return get_event(
            db=db,
            event_id=event_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
@router.put(
    "/{event_id}",
    response_model=EventResponse,
)
def update_event_route(
    event_id: int,
    event: EventUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_organizer),
):
    """
    Update an existing event.
    """
    try:
        return update_existing_event(
            db=db,
            event_id=event_id,
            event=event,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.delete(
    "/{event_id}",
    status_code=status.HTTP_200_OK,
)
def delete_event_route(
    event_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_organizer),
):
    """
    Delete an existing event.
    """
    try:
        delete_existing_event(
            db=db,
            event_id=event_id,
        )

        return {
            "message": "Event deleted successfully."
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )