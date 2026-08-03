from sqlalchemy.orm import Session

from backend.models.check_in import CheckIn
from backend.schemas.checkin import CheckInCreate


def create_checkin(
    db: Session,
    checkin: CheckInCreate,
) -> CheckIn:
    """
    Create a new attendee check-in.
    """

    db_checkin = CheckIn(
        registration_id=checkin.registration_id,
        checked_in_by=checkin.checked_in_by,
        entry_gate=checkin.entry_gate,
        badge_printed=checkin.badge_printed,
        attendance_status=checkin.attendance_status,
    )

    db.add(db_checkin)
    db.commit()
    db.refresh(db_checkin)

    return db_checkin


def get_checkin_by_id(
    db: Session,
    checkin_id: int,
) -> CheckIn | None:
    """
    Get check-in by ID.
    """

    return (
        db.query(CheckIn)
        .filter(CheckIn.id == checkin_id)
        .first()
    )


def get_checkin_by_registration(
    db: Session,
    registration_id: int,
) -> CheckIn | None:
    """
    Get check-in using registration ID.
    """

    return (
        db.query(CheckIn)
        .filter(
            CheckIn.registration_id == registration_id
        )
        .first()
    )


def get_checkins_by_staff(
    db: Session,
    staff_id: int,
) -> list[CheckIn]:
    """
    Get all check-ins performed by a staff member.
    """

    return (
        db.query(CheckIn)
        .filter(
            CheckIn.checked_in_by == staff_id
        )
        .order_by(CheckIn.id)
        .all()
    )

def checkin_exists(
    db: Session,
    registration_id: int,
) -> bool:
    """
    Check whether a registration has already been checked in.
    """

    return (
        db.query(CheckIn)
        .filter(
            CheckIn.registration_id == registration_id
        )
        .first()
        is not None
    )