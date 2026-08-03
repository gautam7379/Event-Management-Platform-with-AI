from sqlalchemy.orm import Session

from backend.models.registration import Registration
from backend.schemas.registration import RegistrationCreate

from backend.utils.qr_generator import generate_qr_code
from sqlalchemy.orm import Session

from backend.models.registration import Registration
from backend.schemas.registration import RegistrationCreate


def create_registration(
    db: Session,
    registration: RegistrationCreate,
) -> Registration:
    """
    Create a new registration.
    """

    db_registration = Registration(
        user_id=registration.user_id,
        event_id=registration.event_id,
    )

    # -----------------------------
    # Save Registration
    # -----------------------------
    db.add(db_registration)
    db.commit()
    db.refresh(db_registration)

    # -----------------------------
    # Generate Registration Number
    # -----------------------------
    db_registration.registration_number = (
        f"REG-{db_registration.id:06d}"
    )

    # -----------------------------
    # Generate QR Code
    # -----------------------------
    qr_path = generate_qr_code(
        db_registration.registration_number
    )

    db_registration.qr_code = qr_path

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