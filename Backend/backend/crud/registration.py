from datetime import datetime
from uuid import uuid4

from sqlalchemy.orm import Session

from backend.models.registration import Registration
from backend.schemas.registration import RegistrationCreate


def create_registration(
    db: Session,
    registration: RegistrationCreate,
    ticket_id: int,
) -> Registration:
    """
    Create a new event registration.
    """

    registration_number = (
        "REG-" + uuid4().hex[:8].upper()
    )

    db_registration = Registration(

        user_id=registration.user_id,

        event_id=registration.event_id,

        ticket_id=ticket_id,

        registration_number=registration_number,

        registration_date=datetime.utcnow(),

        status="Pending",
    )

    db.add(db_registration)

    db.commit()

    db.refresh(db_registration)

    return db_registration


def get_registration_by_id(
    db: Session,
    registration_id: int,
) -> Registration | None:
    """
    Fetch registration by ID.
    """
    return (
        db.query(Registration)
        .filter(
            Registration.id == registration_id
        )
        .first()
    )


def cancel_registration(
    db: Session,
    registration: Registration,
) -> Registration:
    """
    Cancel an existing registration.
    """
    registration.status = "Cancelled"

    db.commit()
    db.refresh(registration)

    return registration


def get_registration(
    db: Session,
    user_id: int,
    event_id: int,
) -> Registration | None:
    """
    Fetch a registration for a user and event.
    """
    return (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id,
            Registration.event_id == event_id,
        )
        .first()
    )


def count_event_registrations(
    db: Session,
    event_id: int,
) -> int:
    """
    Count active registrations for an event.
    """
    return (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id,
            Registration.status != "Cancelled",
        )
        .count()
    )


def get_registrations_by_user(
    db: Session,
    user_id: int,
) -> list[Registration]:
    """
    Fetch all registrations for a user.
    """
    return (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id
        )
        .order_by(
            Registration.id
        )
        .all()
    )


def delete_registration(
    db: Session,
    registration: Registration,
) -> None:
    """
    Delete a registration.
    """
    db.delete(registration)
    db.commit()


def get_all_registrations(
    db: Session,
):
    """
    Get all registrations.
    Used by admin/organizer dashboard.
    """
    return (
        db.query(Registration)
        .order_by(Registration.id)
        .all()
    )