from sqlalchemy.orm import Session

from backend.models.event import Event


def get_available_events(
    db: Session,
) -> list[dict]:
    """
    Return EventAI events in structured form.

    This is a generic database tool.

    It does not interpret user questions.
    The LLM decides when this information
    is useful.
    """

    events = (
        db.query(Event)
        .order_by(
            Event.start_date,
            Event.start_time,
        )
        .all()
    )

    results = []

    for event in events:

        venue_name = (
            event.venue.venue_name
            if event.venue
            else None
        )

        results.append(
            {
                "event_id": event.id,
                "event_name": event.event_name,
                "event_type": event.event_type,
                "description": event.description,
                "agenda": event.agenda,
                "status": event.status,

                "start_date": (
                    event.start_date.isoformat()
                    if event.start_date
                    else None
                ),

                "end_date": (
                    event.end_date.isoformat()
                    if event.end_date
                    else None
                ),

                "start_time": (
                    event.start_time.isoformat()
                    if event.start_time
                    else None
                ),

                "end_time": (
                    event.end_time.isoformat()
                    if event.end_time
                    else None
                ),

                "venue": venue_name,
                "capacity": event.capacity,
            }
        )

    return results


def get_event_details(
    db: Session,
    event_id: int,
) -> dict | None:
    """
    Return detailed information for one event.
    """

    event = (
        db.query(Event)
        .filter(
            Event.id == event_id
        )
        .first()
    )

    if event is None:
        return None

    venue_name = (
        event.venue.venue_name
        if event.venue
        else None
    )

    return {
        "event_id": event.id,
        "event_name": event.event_name,
        "event_type": event.event_type,
        "description": event.description,
        "agenda": event.agenda,
        "status": event.status,

        "start_date": (
            event.start_date.isoformat()
            if event.start_date
            else None
        ),

        "end_date": (
            event.end_date.isoformat()
            if event.end_date
            else None
        ),

        "start_time": (
            event.start_time.isoformat()
            if event.start_time
            else None
        ),

        "end_time": (
            event.end_time.isoformat()
            if event.end_time
            else None
        ),

        "venue": venue_name,
        "capacity": event.capacity,
    }


def find_events_by_name(
    db: Session,
    event_name: str,
) -> list[dict]:
    """
    Search events by name.

    Supports partial and case-insensitive
    event-name matching.
    """

    search_value = (
        event_name.strip()
    )

    if not search_value:
        return []

    events = (
        db.query(Event)
        .filter(
            Event.event_name.ilike(
                f"%{search_value}%"
            )
        )
        .order_by(
            Event.start_date,
            Event.start_time,
        )
        .all()
    )

    results = []

    for event in events:

        venue_name = (
            event.venue.venue_name
            if event.venue
            else None
        )

        results.append(
            {
                "event_id": event.id,
                "event_name": event.event_name,
                "event_type": event.event_type,
                "description": event.description,
                "agenda": event.agenda,
                "status": event.status,

                "start_date": (
                    event.start_date.isoformat()
                    if event.start_date
                    else None
                ),

                "end_date": (
                    event.end_date.isoformat()
                    if event.end_date
                    else None
                ),

                "start_time": (
                    event.start_time.isoformat()
                    if event.start_time
                    else None
                ),

                "end_time": (
                    event.end_time.isoformat()
                    if event.end_time
                    else None
                ),

                "venue": venue_name,
                "capacity": event.capacity,
            }
        )

    return results