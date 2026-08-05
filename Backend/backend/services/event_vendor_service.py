from sqlalchemy.orm import Session

from backend.crud.event_vendor import (
    create_event_vendor,
    get_event_vendors,
    get_vendors_by_event,
    get_events_by_vendor,
    delete_event_vendor,
)


def assign_vendor_to_event(
    db: Session,
    event_id: int,
    vendor_id: int,
):
    return create_event_vendor(
        db=db,
        event_id=event_id,
        vendor_id=vendor_id,
    )


def get_all_event_vendor_assignments(
    db: Session,
):
    return get_event_vendors(db=db)


def get_vendor_assignments_for_event(
    db: Session,
    event_id: int,
):
    return get_vendors_by_event(
        db=db,
        event_id=event_id,
    )


def get_event_assignments_for_vendor(
    db: Session,
    vendor_id: int,
):
    return get_events_by_vendor(
        db=db,
        vendor_id=vendor_id,
    )


def remove_vendor_from_event(
    db: Session,
    assignment_id: int,
):
    return delete_event_vendor(
        db=db,
        assignment_id=assignment_id,
    )