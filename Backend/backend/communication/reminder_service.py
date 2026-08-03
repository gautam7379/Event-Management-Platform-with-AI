"""
Reminder Service

This module will send reminder emails
to registered attendees.
"""

from sqlalchemy.orm import Session

from backend.communication.email_service import EmailService
from backend.communication.email_templates import reminder_email

from backend.crud.event import get_event_by_id
from backend.crud.user import get_user_by_id
from backend.models.registration import Registration
from backend.models.venue import Venue


def send_event_reminders(
    db: Session,
    event_id: int,
):
    """
    Send reminder emails to all registered attendees.
    """

    event = get_event_by_id(
        db,
        event_id,
    )

    if event is None:
        raise ValueError(
            "Event not found."
        )

    venue = (
        db.query(Venue)
        .filter(
            Venue.id == event.venue_id
        )
        .first()
    )

    registrations = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id,
            Registration.status != "Cancelled",
        )
        .all()
    )

    total_sent = 0

    for registration in registrations:

        user = get_user_by_id(
            db,
            registration.user_id,
        )

        if user is None:
            continue

        subject, body = reminder_email(
            user_name=f"{user.first_name} {user.last_name}",
            event_name=event.event_name,
            event_date=str(event.start_date),
            venue_name=venue.venue_name if venue else "N/A",
        )

        try:

            EmailService.send_email(
                recipient=user.email,
                subject=subject,
                body=body,
            )

            total_sent += 1

        except Exception as e:

            print("=" * 60)
            print("REMINDER EMAIL FAILED")
            print(user.email)
            print(e)
            print("=" * 60)

    return {
        "emails_sent": total_sent,
        "total_registrations": len(registrations),
    }