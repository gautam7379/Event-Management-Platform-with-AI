from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.models.registration import Registration
from backend.models.payment import Payment
from backend.models.event import Event
from backend.models.feedback import Feedback


def get_dashboard_chart_data(
    db: Session,
):
    """
    Dashboard chart analytics.
    """

    # ===========================
    # Monthly Registrations
    # ===========================

    monthly_registration_rows = (
        db.query(
            func.extract(
                "month",
                Registration.created_at,
            ),
            func.count(
                Registration.id,
            ),
        )
        .group_by(
            func.extract(
                "month",
                Registration.created_at,
            )
        )
        .all()
    )

    monthly_registrations = {
        str(int(month)): count
        for month, count in monthly_registration_rows
    }

    # ===========================
    # Monthly Revenue
    # ===========================

    monthly_revenue_rows = (
        db.query(
            func.extract(
                "month",
                Payment.created_at,
            ),
            func.coalesce(
                func.sum(
                    Payment.amount,
                ),
                0,
            ),
        )
        .group_by(
            func.extract(
                "month",
                Payment.created_at,
            )
        )
        .all()
    )

    monthly_revenue = {
        str(int(month)): float(total)
        for month, total in monthly_revenue_rows
    }

    # ===========================
    # Event Status Distribution
    # ===========================

    status_rows = (
        db.query(
            Event.status,
            func.count(
                Event.id,
            ),
        )
        .group_by(
            Event.status,
        )
        .all()
    )

    event_status_distribution = {
        status: count
        for status, count in status_rows
    }

    # ===========================
    # Feedback Distribution
    # ===========================

    feedback_rows = (
        db.query(
            Feedback.rating,
            func.count(
                Feedback.id,
            ),
        )
        .group_by(
            Feedback.rating,
        )
        .all()
    )

    feedback_distribution = {
        str(rating): count
        for rating, count in feedback_rows
    }

    # ===========================
    # Top Events
    # ===========================

    top_rows = (
        db.query(
            Event.event_name,
            func.count(
                Registration.id,
            ).label(
                "registrations",
            ),
        )
        .outerjoin(
            Registration,
            Registration.event_id == Event.id,
        )
        .group_by(
            Event.id,
        )
        .order_by(
            func.count(
                Registration.id,
            ).desc()
        )
        .limit(5)
        .all()
    )

    top_events = []

    for event_name, registrations in top_rows:

        top_events.append(
            {
                "event_name": event_name,
                "registrations": registrations,
            }
        )

    return {

        "monthly_registrations": monthly_registrations,

        "monthly_revenue": monthly_revenue,

        "event_status_distribution":
            event_status_distribution,

        "feedback_rating_distribution":
            feedback_distribution,

        "top_events": top_events,
    }