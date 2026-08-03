from sqlalchemy.orm import Session

from backend.models.ticket import Ticket
from backend.schemas.ticket import TicketCreate


def create_ticket(
    db: Session,
    ticket: TicketCreate,
) -> Ticket:
    """
    Create a new ticket category.
    """

    db_ticket = Ticket(
        event_id=ticket.event_id,
        ticket_category=ticket.ticket_category,
        price=ticket.price,
        quantity=ticket.quantity,
        qr_enabled=ticket.qr_enabled,
        sale_start_date=ticket.sale_start_date,
        sale_end_date=ticket.sale_end_date,
        status=ticket.status,
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    return db_ticket


def get_ticket_by_id(
    db: Session,
    ticket_id: int,
) -> Ticket | None:
    """
    Get ticket by ID.
    """

    return (
        db.query(Ticket)
        .filter(Ticket.id == ticket_id)
        .first()
    )


def get_ticket_by_category(
    db: Session,
    event_id: int,
    ticket_category: str,
) -> Ticket | None:
    """
    Get a ticket category for an event.
    """

    return (
        db.query(Ticket)
        .filter(
            Ticket.event_id == event_id,
            Ticket.ticket_category == ticket_category,
        )
        .first()
    )


def get_tickets_by_event(
    db: Session,
    event_id: int,
) -> list[Ticket]:
    """
    Get all ticket categories of an event.
    """

    return (
        db.query(Ticket)
        .filter(Ticket.event_id == event_id)
        .order_by(Ticket.id)
        .all()
    )