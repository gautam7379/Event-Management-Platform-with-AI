from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.payment import Payment
from backend.models.speaker import Speaker
from backend.models.session import Session
from backend.models.sponsor import Sponsor
from backend.models.vendor import Vendor
from backend.models.feedback import Feedback


def get_dashboard_analytics(
    db: Session,
):
    """
    Generate admin dashboard analytics.
    """

    # ==========================
    # Event Statistics
    # ==========================

    total_events = db.query(Event).count()

    published_events = (
        db.query(Event)
        .filter(Event.status == "Published")
        .count()
    )

    draft_events = (
        db.query(Event)
        .filter(Event.status == "Draft")
        .count()
    )

    completed_events = (
        db.query(Event)
        .filter(Event.status == "Completed")
        .count()
    )

    # ==========================
    # Registration Statistics
    # ==========================

    total_registrations = db.query(
        Registration
    ).count()

    confirmed_registrations = (
        db.query(Registration)
        .filter(
            Registration.status == "Confirmed"
        )
        .count()
    )

    pending_registrations = (
        db.query(Registration)
        .filter(
            Registration.status == "Pending"
        )
        .count()
    )

    # ==========================
    # Revenue Statistics
    # ==========================

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .scalar()
    )

    # ==========================
    # Speaker Statistics
    # ==========================

    total_speakers = db.query(
        Speaker
    ).count()

    # ==========================
    # Session Statistics
    # ==========================

    total_sessions = db.query(
        Session
    ).count()

    # ==========================
    # Sponsor Statistics
    # ==========================

    total_sponsors = db.query(
        Sponsor
    ).count()

    # ==========================
    # Vendor Statistics
    # ==========================

    total_vendors = db.query(
        Vendor
    ).count()

    # ==========================
    # Feedback Statistics
    # ==========================

    total_feedback = db.query(
        Feedback
    ).count()

    average_feedback_rating = (
        db.query(
            func.coalesce(
                func.avg(Feedback.rating),
                0,
            )
        )
        .scalar()
    )

    return {
        "total_events": total_events,
        "published_events": published_events,
        "draft_events": draft_events,
        "completed_events": completed_events,

        "total_registrations": total_registrations,
        "confirmed_registrations": confirmed_registrations,
        "pending_registrations": pending_registrations,

        "total_revenue": total_revenue,

        "total_speakers": total_speakers,
        "total_sessions": total_sessions,
        "total_sponsors": total_sponsors,
        "total_vendors": total_vendors,

        "total_feedback": total_feedback,
        "average_feedback_rating": round(
            float(average_feedback_rating),
            2,
        ),
    }