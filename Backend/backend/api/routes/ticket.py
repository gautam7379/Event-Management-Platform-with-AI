from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.ticket import (
    TicketCreate,
    TicketResponse,
    TicketViewResponse,
)

from backend.services.ticket_service import (
    create_new_ticket,
    get_ticket,
    get_event_tickets,
     get_ticket_view,
)

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


@router.post(
    "/",
    response_model=TicketResponse,
    status_code=status.HTTP_201_CREATED,
)


def create_ticket(
    ticket: TicketCreate,
    db: Session = Depends(get_db),
):
    """
    Create a ticket category.
    """
    try:
        return create_new_ticket(
            db=db,
            ticket=ticket,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/{ticket_id}",
    response_model=TicketResponse,
)
def get_ticket_by_id(
    ticket_id: int,
    db: Session = Depends(get_db),
):
    """
    Get ticket category by ID.
    """
    try:
        return get_ticket(
            db=db,
            ticket_id=ticket_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.get(
    "/event/{event_id}",
    response_model=list[TicketResponse],
)
def get_event_ticket_categories(
    event_id: int,
    db: Session = Depends(get_db),
):
    """
    Get all ticket categories of an event.
    """
    return get_event_tickets(
        db=db,
        event_id=event_id,
    )

@router.get(
    "/view/{registration_id}",
    response_model=TicketViewResponse,
)
def view_ticket(
    registration_id: int,
    db: Session = Depends(get_db),
):
    """
    Return complete ticket details for a registration.
    """

    try:

        return get_ticket_view(
            db=db,
            registration_id=registration_id,
        )

    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )