from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)

from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.event_sponsor import (
    EventSponsorCreate,
    EventSponsorResponse,
)

from backend.services.event_sponsor_service import (
    assign_sponsor_to_event,
    get_all_event_sponsor_assignments,
    get_sponsor_assignments_for_event,
    get_event_assignments_for_sponsor,
    remove_sponsor_from_event,
)


router = APIRouter(
    prefix="/event-sponsors",
    tags=["Event Sponsors"],
)


@router.post(
    "/",
    response_model=EventSponsorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(
    data: EventSponsorCreate,
    db: Session = Depends(get_db),
):
    """
    Assign sponsor to event.
    """

    try:

        return assign_sponsor_to_event(
            db=db,
            event_id=data.event_id,
            sponsor_id=data.sponsor_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[EventSponsorResponse],
)
def read_assignments(
    db: Session = Depends(get_db),
):
    """
    Get all sponsor-event assignments.
    """

    return get_all_event_sponsor_assignments(
        db=db
    )


@router.get(
    "/event/{event_id}",
    response_model=list[EventSponsorResponse],
)
def read_event_sponsors(
    event_id: int,
    db: Session = Depends(get_db),
):
    """
    Get sponsors assigned to an event.
    """

    return get_sponsor_assignments_for_event(
        db=db,
        event_id=event_id,
    )


@router.get(
    "/sponsor/{sponsor_id}",
    response_model=list[EventSponsorResponse],
)
def read_sponsor_events(
    sponsor_id: int,
    db: Session = Depends(get_db),
):
    """
    Get events assigned to a sponsor.
    """

    return get_event_assignments_for_sponsor(
        db=db,
        sponsor_id=sponsor_id,
    )


@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
):
    """
    Remove sponsor from event.
    """

    try:

        remove_sponsor_from_event(
            db=db,
            assignment_id=assignment_id,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )