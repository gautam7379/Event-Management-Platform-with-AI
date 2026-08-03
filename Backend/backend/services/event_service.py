from sqlalchemy.orm import Session

from backend.crud.event import (
    create_event,
    get_organizer_by_id,
    get_venue_by_id,
    get_events,
    get_event_by_id,
    update_event,
    delete_event,
)
from backend.models.event import Event
from backend.schemas.event import (
    EventCreate,
    EventUpdate,
)


def create_new_event(
    db: Session,
    event: EventCreate,
) -> Event:
    """
    Create a new event after business validation.
    """

    # -----------------------------
    # Date Validation
    # -----------------------------
    if event.start_date > event.end_date:
        raise ValueError(
            "Start date cannot be after end date."
        )

    # -----------------------------
    # Time Validation
    # -----------------------------
    if (
        event.start_date == event.end_date
        and event.start_time >= event.end_time
    ):
        raise ValueError(
            "Start time must be before end time."
        )

    # -----------------------------
    # Organizer Validation
    # -----------------------------
    organizer = get_organizer_by_id(
        db,
        event.organizer_id,
    )

    if organizer is None:
        raise ValueError(
            "Organizer not found."
        )

    # -----------------------------
    # Venue Validation
    # -----------------------------
    venue = get_venue_by_id(
        db,
        event.venue_id,
    )

    if venue is None:
        raise ValueError(
            "Venue not found."
        )

    # -----------------------------
    # Create Event
    # -----------------------------
    return create_event(
        db=db,
        event=event,
    )
def get_all_events(
    db: Session,
) -> list[Event]:
    """
    Fetch all events.
    """
    return get_events(db)


def get_event(
    db: Session,
    event_id: int,
) -> Event:
    """
    Fetch a single event by ID.
    """

    event = get_event_by_id(
        db,
        event_id,
    )

    if event is None:
        raise ValueError(
            "Event not found."
        )

    return event
def update_existing_event(
    db: Session,
    event_id: int,
    event: EventUpdate,
) -> Event:
    """
    Update an existing event after business validation.
    """

    # -----------------------------
    # Event Validation
    # -----------------------------
    db_event = get_event_by_id(
        db,
        event_id,
    )

    if db_event is None:
        raise ValueError(
            "Event not found."
        )

    # -----------------------------
    # Date Validation
    # -----------------------------
    if event.start_date > event.end_date:
        raise ValueError(
            "Start date cannot be after end date."
        )

    # -----------------------------
    # Time Validation
    # -----------------------------
    if (
        event.start_date == event.end_date
        and event.start_time >= event.end_time
    ):
        raise ValueError(
            "Start time must be before end time."
        )

    # -----------------------------
    # Organizer Validation
    # -----------------------------
    organizer = get_organizer_by_id(
        db,
        event.organizer_id,
    )

    if organizer is None:
        raise ValueError(
            "Organizer not found."
        )

    # -----------------------------
    # Venue Validation
    # -----------------------------
    venue = get_venue_by_id(
        db,
        event.venue_id,
    )

    if venue is None:
        raise ValueError(
            "Venue not found."
        )

    # -----------------------------
    # Update Event
    # -----------------------------
    return update_event(
        db=db,
        db_event=db_event,
        event=event,
    )

def delete_existing_event(
    db: Session,
    event_id: int,
) -> None:
    """
    Delete an existing event.
    """

    # -----------------------------
    # Event Validation
    # -----------------------------
    db_event = get_event_by_id(
        db,
        event_id,
    )

    if db_event is None:
        raise ValueError(
            "Event not found."
        )

    # -----------------------------
    # Delete Event
    # -----------------------------
    delete_event(
        db=db,
        db_event=db_event,
    )