from sqlalchemy.orm import Session

from backend.crud.feedback import (
    create_feedback,
    feedback_exists,
)

from backend.crud.registration import (
    get_registration_by_id,
)

from backend.crud.user import (
    get_user_by_id,
)

from backend.crud.event import (
    get_event_by_id,
)

from backend.models.feedback import Feedback
from backend.schemas.feedback import FeedbackCreate


def create_new_feedback(
    db: Session,
    feedback: FeedbackCreate,
) -> Feedback:
    """
    Create feedback after business validation.
    """

    # -----------------------------
    # Validate Registration
    # -----------------------------
    registration = get_registration_by_id(
        db=db,
        registration_id=feedback.registration_id,
    )

    if registration is None:
        raise ValueError(
            "Registration not found."
        )

    # -----------------------------
    # Validate User
    # -----------------------------
    user = get_user_by_id(
        db=db,
        user_id=feedback.user_id,
    )

    if user is None:
        raise ValueError(
            "User not found."
        )

    # -----------------------------
    # Validate Event
    # -----------------------------
    event = get_event_by_id(
        db=db,
        event_id=feedback.event_id,
    )

    if event is None:
        raise ValueError(
            "Event not found."
        )

    # -----------------------------
    # Registration belongs to User
    # -----------------------------
    if registration.user_id != feedback.user_id:
        raise ValueError(
            "Registration does not belong to this user."
        )

    # -----------------------------
    # Registration belongs to Event
    # -----------------------------
    if registration.event_id != feedback.event_id:
        raise ValueError(
            "Registration does not belong to this event."
        )

    # -----------------------------
    # Must be Checked-In
    # -----------------------------
    if registration.check_in is None:
        raise ValueError(
            "Feedback can only be submitted after check-in."
        )

    # -----------------------------
    # Prevent Duplicate Feedback
    # -----------------------------
    if feedback_exists(
        db=db,
        registration_id=feedback.registration_id,
    ):
        raise ValueError(
            "Feedback has already been submitted."
        )

    # -----------------------------
    # Create Feedback
    # -----------------------------
    return create_feedback(
        db=db,
        feedback=feedback,
    )