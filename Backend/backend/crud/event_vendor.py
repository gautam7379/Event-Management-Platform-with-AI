from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.vendor import Vendor
from backend.models.event_vendor import EventVendor


def create_event_vendor(
    db: Session,
    event_id: int,
    vendor_id: int,
):
    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        raise ValueError("Event not found.")

    vendor = (
        db.query(Vendor)
        .filter(Vendor.id == vendor_id)
        .first()
    )

    if not vendor:
        raise ValueError("Vendor not found.")

    existing = (
        db.query(EventVendor)
        .filter(
            EventVendor.event_id == event_id,
            EventVendor.vendor_id == vendor_id,
        )
        .first()
    )

    if existing:
        raise ValueError(
            "Vendor is already assigned to this event."
        )

    assignment = EventVendor(
        event_id=event_id,
        vendor_id=vendor_id,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


def get_event_vendors(db: Session):
    return (
        db.query(EventVendor)
        .order_by(EventVendor.id)
        .all()
    )


def get_vendors_by_event(
    db: Session,
    event_id: int,
):
    return (
        db.query(EventVendor)
        .filter(EventVendor.event_id == event_id)
        .order_by(EventVendor.id)
        .all()
    )


def get_events_by_vendor(
    db: Session,
    vendor_id: int,
):
    return (
        db.query(EventVendor)
        .filter(EventVendor.vendor_id == vendor_id)
        .order_by(EventVendor.id)
        .all()
    )


def delete_event_vendor(
    db: Session,
    assignment_id: int,
):
    assignment = (
        db.query(EventVendor)
        .filter(EventVendor.id == assignment_id)
        .first()
    )

    if not assignment:
        raise ValueError(
            "Event vendor assignment not found."
        )

    db.delete(assignment)
    db.commit()