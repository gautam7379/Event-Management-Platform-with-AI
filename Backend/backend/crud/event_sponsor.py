from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.sponsor import Sponsor
from backend.models.event_sponsor import EventSponsor


def create_event_sponsor(
    db: Session,
    event_id: int,
    sponsor_id: int,
):
    """
    Assign a sponsor to an event.
    """

    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        raise ValueError(
            "Event not found."
        )

    sponsor = (
        db.query(Sponsor)
        .filter(Sponsor.id == sponsor_id)
        .first()
    )

    if not sponsor:
        raise ValueError(
            "Sponsor not found."
        )

    existing = (
        db.query(EventSponsor)
        .filter(
            EventSponsor.event_id == event_id,
            EventSponsor.sponsor_id == sponsor_id,
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Sponsor is already assigned to this event."
        )

    assignment = EventSponsor(
        event_id=event_id,
        sponsor_id=sponsor_id,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


def get_event_sponsors(
    db: Session,
):
    """
    Get all event-sponsor assignments.
    """

    return (
        db.query(EventSponsor)
        .order_by(EventSponsor.id)
        .all()
    )


def get_sponsors_by_event(
    db: Session,
    event_id: int,
):
    """
    Get sponsor assignments for an event.
    """

    return (
        db.query(EventSponsor)
        .filter(
            EventSponsor.event_id == event_id
        )
        .order_by(EventSponsor.id)
        .all()
    )


def get_events_by_sponsor(
    db: Session,
    sponsor_id: int,
):
    """
    Get event assignments for a sponsor.
    """

    return (
        db.query(EventSponsor)
        .filter(
            EventSponsor.sponsor_id == sponsor_id
        )
        .order_by(EventSponsor.id)
        .all()
    )


def delete_event_sponsor(
    db: Session,
    assignment_id: int,
):
    """
    Delete an event-sponsor assignment.
    """

    assignment = (
        db.query(EventSponsor)
        .filter(
            EventSponsor.id == assignment_id
        )
        .first()
    )

    if not assignment:
        raise ValueError(
            "Event sponsor assignment not found."
        )

    db.delete(assignment)
    db.commit()