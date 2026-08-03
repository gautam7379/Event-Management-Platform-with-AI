from sqlalchemy.orm import Session

from backend.communication.email_service import EmailService
from backend.communication.email_templates import (
    registration_confirmation,
)

from backend.crud.event import get_event_by_id
from backend.crud.registration import (
    cancel_registration,
    count_event_registrations,
    create_registration,
    get_registration,
    get_registration_by_id,
    get_registrations_by_user,
)
from backend.crud.user import get_user_by_id

from backend.models.registration import Registration
from backend.schemas.registration import RegistrationCreate


def register_for_event(
    db: Session,
    registration: RegistrationCreate,
) -> Registration:
    """
    Register a user for an event.
    """

    # ---------------------------------
    # Validate User
    # ---------------------------------

    user = get_user_by_id(
        db,
        registration.user_id,
    )

    if user is None:
        raise ValueError(
            "User not found."
        )

    # ---------------------------------
    # Validate Event
    # ---------------------------------

    event = get_event_by_id(
        db,
        registration.event_id,
    )

    if event is None:
        raise ValueError(
            "Event not found."
        )

    # ---------------------------------
    # Prevent Duplicate Registration
    # ---------------------------------

    existing_registration = get_registration(
        db=db,
        user_id=registration.user_id,
        event_id=registration.event_id,
    )

    if existing_registration:
        raise ValueError(
            "User already registered for this event."
        )

    # ---------------------------------
    # Capacity Check
    # ---------------------------------

    current_registrations = count_event_registrations(
        db=db,
        event_id=registration.event_id,
    )

    if current_registrations >= event.capacity:
        raise ValueError(
            "Event is full."
        )

    # ---------------------------------
    # Save Registration
    # ---------------------------------

    new_registration = create_registration(
        db=db,
        registration=registration,
    )

    # ---------------------------------
    # Send Confirmation Email
    # ---------------------------------

    try:

        subject, body = registration_confirmation(
            user_name=f"{user.first_name} {user.last_name}",
            event_name=event.event_name,
        )

        EmailService.send_email(
            recipient=user.email,
            subject=subject,
            body=body,
        )

    except Exception as email_error:
        print("=" * 60)
        print("EMAIL DELIVERY FAILED")
        print(email_error)
        print("=" * 60)

        # Don't fail registration if email fails.

    return new_registration


def get_my_registrations(
    db: Session,
    user_id: int,
) -> list[Registration]:
    """
    Get all registrations of the current user.
    """

    return get_registrations_by_user(
        db=db,
        user_id=user_id,
    )


def cancel_my_registration(
    db: Session,
    registration_id: int,
    user_id: int,
) -> Registration:
    """
    Cancel a user's registration.
    """

    registration = get_registration_by_id(
        db,
        registration_id,
    )

    if registration is None:
        raise ValueError(
            "Registration not found."
        )

    if registration.user_id != user_id:
        raise ValueError(
            "You can cancel only your own registration."
        )

    if registration.status == "Cancelled":
        raise ValueError(
            "Registration is already cancelled."
        )

    return cancel_registration(
        db=db,
        registration=registration,
    )