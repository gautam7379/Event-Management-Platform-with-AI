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
from backend.models.registration import Registration
from backend.models.event import Event
from backend.models.user import User
from backend.crud.registration import get_registration_by_id


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


def get_ticket_view(
    db: Session,
    registration_id: int,
):
    """
    Return complete ticket details for a registration.
    """

    registration = get_registration_by_id(
        db=db,
        registration_id=registration_id,
    )

    if registration is None:
        raise ValueError("Registration not found.")

    event = registration.event
    user = registration.user
    ticket = registration.ticket

    return {

        "registration_id": registration.id,

        "registration_number":
            registration.registration_number,

        "holder_name":
            f"{user.first_name} {user.last_name}",

        "email":
            user.email,

        "event_name":
            event.event_name,

        "venue":
            event.venue.venue_name
            if event.venue else "-",

        "date":
            str(event.start_date),

        "ticket_category":
            ticket.ticket_category
            if ticket else "General",

        "price":
            float(ticket.price)
            if ticket else 0,

        "status":
            registration.status,

        "qr_code":
            registration.qr_code

    }