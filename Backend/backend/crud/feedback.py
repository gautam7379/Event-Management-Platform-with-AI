from sqlalchemy.orm import Session

from backend.models.feedback import Feedback
from backend.schemas.feedback import FeedbackCreate


def create_feedback(
    db: Session,
    feedback: FeedbackCreate,
) -> Feedback:
    """
    Create a new feedback.
    """

    db_feedback = Feedback(
        event_id=feedback.event_id,
        user_id=feedback.user_id,
        registration_id=feedback.registration_id,
        rating=feedback.rating,
        comments=feedback.comments,
        sentiment=feedback.sentiment,
    )

    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)

    return db_feedback


def get_feedback_by_id(
    db: Session,
    feedback_id: int,
) -> Feedback | None:
    """
    Get feedback by ID.
    """

    return (
        db.query(Feedback)
        .filter(Feedback.id == feedback_id)
        .first()
    )


def get_feedback_by_registration(
    db: Session,
    registration_id: int,
) -> Feedback | None:
    """
    Get feedback by registration ID.
    """

    return (
        db.query(Feedback)
        .filter(
            Feedback.registration_id == registration_id
        )
        .first()
    )


def get_feedback_by_event(
    db: Session,
    event_id: int,
) -> list[Feedback]:
    """
    Get all feedback for an event.
    """

    return (
        db.query(Feedback)
        .filter(
            Feedback.event_id == event_id
        )
        .order_by(Feedback.id)
        .all()
    )


def get_feedback_by_user(
    db: Session,
    user_id: int,
) -> list[Feedback]:
    """
    Get all feedback submitted by a user.
    """

    return (
        db.query(Feedback)
        .filter(
            Feedback.user_id == user_id
        )
        .order_by(Feedback.id)
        .all()
    )

def feedback_exists(
    db: Session,
    registration_id: int,
) -> bool:
    """
    Check whether feedback already exists
    for the registration.
    """

    return (
        db.query(Feedback)
        .filter(
            Feedback.registration_id == registration_id
        )
        .first()
        is not None
    )