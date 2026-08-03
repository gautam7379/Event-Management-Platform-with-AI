from sqlalchemy.orm import Session

from backend.ai.context_builder import build_event_context

from backend.models.registration import Registration


def build_report_context(
    db: Session,
    event_id: int,
) -> str:
    """
    Build AI report context.
    """

    event_context = build_event_context(
        db=db,
        event_id=event_id,
    )

    total_registrations = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id
        )
        .count()
    )

    confirmed = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id,
            Registration.status == "Confirmed",
        )
        .count()
    )

    pending = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id,
            Registration.status == "Pending",
        )
        .count()
    )

    cancelled = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id,
            Registration.status == "Cancelled",
        )
        .count()
    )

    context = f"""
{event_context}

--------------------------------------------------

Registration Statistics

Total Registrations : {total_registrations}

Confirmed : {confirmed}

Pending : {pending}

Cancelled : {cancelled}

--------------------------------------------------
"""

    return context