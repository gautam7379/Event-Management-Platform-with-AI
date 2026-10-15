from sqlalchemy.orm import Session

from backend.crud.event_sponsor import (
    create_event_sponsor,
    get_event_sponsors,
    get_sponsors_by_event,
    get_events_by_sponsor,
    delete_event_sponsor,
)


def assign_sponsor_to_event(
    db: Session,
    event_id: int,
    sponsor_id: int,
):
    return create_event_sponsor(
        db=db,
        event_id=event_id,
        sponsor_id=sponsor_id,
    )


def get_all_event_sponsor_assignments(
    db: Session,
):
    return get_event_sponsors(
        db=db
    )


def get_sponsor_assignments_for_event(
    db: Session,
    event_id: int,
):
    return get_sponsors_by_event(
        db=db,
        event_id=event_id,
    )


def get_event_assignments_for_sponsor(
    db: Session,
    sponsor_id: int,
):
    return get_events_by_sponsor(
        db=db,
        sponsor_id=sponsor_id,
    )


def remove_sponsor_from_event(
    db: Session,
    assignment_id: int,
):
    return delete_event_sponsor(
        db=db,
        assignment_id=assignment_id,
    )