from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.schemas.event import (
    EventCreate,
    EventUpdate,
)
from backend.models.user import User
from backend.models.venue import Venue

def create_event(
    db: Session,
    event: EventCreate,
) -> Event:
    """
    Create a new event.
    """
    db_event = Event(
        organizer_id=event.organizer_id,
        venue_id=event.venue_id,
        event_name=event.event_name,
        event_type=event.event_type,
        description=event.description,
        agenda=event.agenda,
        start_date=event.start_date,
        end_date=event.end_date,
        start_time=event.start_time,
        end_time=event.end_time,
        capacity=event.capacity,
        banner_image=event.banner_image,
        status=event.status,
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event

def get_organizer_by_id(
    db: Session,
    organizer_id: int,
) -> User | None:
    """
    Fetch organizer by ID.
    """
    return (
        db.query(User)
        .filter(User.id == organizer_id)
        .first()
    )


def get_venue_by_id(
    db: Session,
    venue_id: int,
) -> Venue | None:
    """
    Fetch venue by ID.
    """
    return (
        db.query(Venue)
        .filter(Venue.id == venue_id)
        .first()
    )
def get_events(
    db: Session,
) -> list[Event]:
    """
    Fetch all events.
    """
    return (
        db.query(Event)
        .order_by(Event.id)
        .all()
    )


def get_event_by_id(
    db: Session,
    event_id: int,
) -> Event | None:
    """
    Fetch event by ID.
    """
    return (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

def update_event(
    db: Session,
    db_event: Event,
    event: EventUpdate,
) -> Event:
    """
    Update an existing event.
    """

    db_event.organizer_id = event.organizer_id
    db_event.venue_id = event.venue_id
    db_event.event_name = event.event_name
    db_event.event_type = event.event_type
    db_event.description = event.description
    db_event.agenda = event.agenda
    db_event.start_date = event.start_date
    db_event.end_date = event.end_date
    db_event.start_time = event.start_time
    db_event.end_time = event.end_time
    db_event.capacity = event.capacity
    db_event.banner_image = event.banner_image
    db_event.status = event.status

    db.commit()
    db.refresh(db_event)

    return db_event

def delete_event(
    db: Session,
    db_event: Event,
) -> None:
    """
    Delete an event.
    """
    db.delete(db_event)
    db.commit()