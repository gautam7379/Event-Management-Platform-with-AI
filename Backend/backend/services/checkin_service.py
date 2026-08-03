from sqlalchemy.orm import Session

from backend.crud.checkin import (
    create_checkin,
    checkin_exists,
)
from backend.crud.registration import (
    get_registration_by_id,
)

from backend.crud.user import (
    get_user_by_id,
)

from backend.models.check_in import CheckIn
from backend.schemas.checkin import CheckInCreate


def create_new_checkin(
    db: Session,
    checkin: CheckInCreate,
) -> CheckIn:
    """
    Create a new attendee check-in after business validation.
    """

    # -----------------------------
    # Validate Registration
    # -----------------------------
    registration = get_registration_by_id(
        db=db,
        registration_id=checkin.registration_id,
    )

    if registration is None:
        raise ValueError(
            "Registration not found."
        )

    # -----------------------------
    # Validate Staff User
    # -----------------------------
    staff = get_user_by_id(
        db=db,
        user_id=checkin.checked_in_by,
    )

    if staff is None:
        raise ValueError(
            "Staff user not found."
        )

    # -----------------------------
    # Prevent Duplicate Check-In
    # -----------------------------
    if checkin_exists(
        db=db,
        registration_id=checkin.registration_id,
    ):
        raise ValueError(
            "Attendee has already checked in."
        )

    # -----------------------------
    # Create Check-In
    # -----------------------------
    return create_checkin(
        db=db,
        checkin=checkin,
    )