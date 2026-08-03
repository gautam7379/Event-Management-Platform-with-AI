from sqlalchemy.orm import Session

from backend.crud.ticket import (
    create_ticket,
    get_ticket_by_id,
    get_ticket_by_category,
    get_tickets_by_event,
)

from backend.crud.event import (
    get_event_by_id,
)

from backend.models.ticket import Ticket
from backend.schemas.ticket import TicketCreate


def create_new_ticket(
    db: Session,
    ticket: TicketCreate,
) -> Ticket:
    """
    Create a new ticket category.
    """

    # -----------------------------
    # Validate Event
    # -----------------------------
    event = get_event_by_id(
        db=db,
        event_id=ticket.event_id,
    )

    if event is None:
        raise ValueError(
            "Event not found."
        )

    # -----------------------------
    # Prevent Duplicate Category
    # -----------------------------
    existing_ticket = get_ticket_by_category(
        db=db,
        event_id=ticket.event_id,
        ticket_category=ticket.ticket_category,
    )

    if existing_ticket:
        raise ValueError(
            "Ticket category already exists for this event."
        )

    # -----------------------------
    # Create Ticket Category
    # -----------------------------
    return create_ticket(
        db=db,
        ticket=ticket,
    )


def get_ticket(
    db: Session,
    ticket_id: int,
) -> Ticket:
    """
    Get ticket category by ID.
    """

    ticket = get_ticket_by_id(
        db=db,
        ticket_id=ticket_id,
    )

    if ticket is None:
        raise ValueError(
            "Ticket not found."
        )

    return ticket


def get_event_tickets(
    db: Session,
    event_id: int,
) -> list[Ticket]:
    """
    Get all ticket categories of an event.
    """

    return get_tickets_by_event(
        db=db,
        event_id=event_id,
    )