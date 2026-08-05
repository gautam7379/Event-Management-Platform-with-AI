from datetime import date

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
from backend.models.check_in import CheckIn
from backend.models.user import User

def get_dashboard_analytics(
    db: Session,
):
    """
    Generate admin dashboard analytics
    directly from database data.
    """

    # ==========================================
    # Event Statistics
    # ==========================================

    total_events = (
        db.query(Event)
        .count()
    )

    published_events = (
        db.query(Event)
        .filter(
            Event.status == "Published"
        )
        .count()
    )

    draft_events = (
        db.query(Event)
        .filter(
            Event.status == "Draft"
        )
        .count()
    )

    completed_events = (
        db.query(Event)
        .filter(
            Event.status == "Completed"
        )
        .count()
    )

    # ==========================================
    # Upcoming Events
    # ==========================================

    upcoming_events = (
        db.query(Event)
        .filter(
            Event.start_date >= date.today(),
            Event.status != "Completed",
        )
        .count()
    )

    # ==========================================
    # Registration Statistics
    # ==========================================

    total_registrations = (
        db.query(Registration)
        .filter(
            Registration.status != "Cancelled"
        )
        .count()
    )

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

    # ==========================================
    # Tickets Generated
    # ==========================================
    #
    # The Ticket table contains ticket
    # categories/configuration.
    #
    # A registration containing a ticket_id
    # represents a ticket assigned to an
    # attendee.
    #
    # Cancelled registrations are excluded.
    # ==========================================

    total_tickets = (
        db.query(Registration)
        .filter(
            Registration.ticket_id.isnot(None),
            Registration.status != "Cancelled",
        )
        .count()
    )

    # ==========================================
    # Checked-In Attendees
    # ==========================================

    checked_in_count = (
        db.query(CheckIn)
        .filter(
            CheckIn.attendance_status
            == "Checked-In"
        )
        .count()
    )

    # ==========================================
    # Total Event Capacity
    # ==========================================

    total_capacity = (
        db.query(
            func.coalesce(
                func.sum(Event.capacity),
                0,
            )
        )
        .scalar()
    )

    # ==========================================
    # Registration Rate
    # ==========================================
    #
    # Registration Rate =
    #
    # active registrations
    # -------------------- x 100
    # total event capacity
    #
    # ==========================================

    if total_capacity:

        registration_rate = (
            total_registrations
            / int(total_capacity)
        ) * 100

    else:

        registration_rate = 0.0

    registration_rate = round(
        registration_rate,
        2,
    )

    # ==========================================
    # Revenue Statistics
    # ==========================================

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0,
            )
        )
        .scalar()
    )

    total_revenue = float(
        total_revenue
        or 0
    )

    # ==========================================
    # Speaker Statistics
    # ==========================================

    total_speakers = (
        db.query(Speaker)
        .count()
    )

    # ==========================================
    # Session Statistics
    # ==========================================

    total_sessions = (
        db.query(Session)
        .count()
    )

    # ==========================================
    # Sponsor Statistics
    # ==========================================

    total_sponsors = (
        db.query(Sponsor)
        .count()
    )

    # ==========================================
    # Vendor Statistics
    # ==========================================

    total_vendors = (
        db.query(Vendor)
        .count()
    )

    # ==========================================
    # Feedback Statistics
    # ==========================================

    total_feedback = (
        db.query(Feedback)
        .count()
    )

    average_feedback_rating = (
        db.query(
            func.coalesce(
                func.avg(
                    Feedback.rating
                ),
                0,
            )
        )
        .scalar()
    )

    average_feedback_rating = round(
        float(
            average_feedback_rating
            or 0
        ),
        2,
    )

        # ==========================================
    # Recent Activity
    # ==========================================

    recent_activity = []

    # ------------------------------------------
    # Recent Events
    # ------------------------------------------

    recent_events = (
        db.query(Event)
        .order_by(
            Event.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for event in recent_events:

        recent_activity.append(
            {
                "type": "event",
                "message": (
                    f"Event '{event.event_name}' "
                    f"was created."
                ),
                "created_at":
                    event.created_at,
            }
        )

    # ------------------------------------------
    # Recent Registrations
    # ------------------------------------------

    recent_registrations = (
        db.query(
            Registration,
            User,
            Event,
        )
        .join(
            User,
            Registration.user_id
            == User.id,
        )
        .join(
            Event,
            Registration.event_id
            == Event.id,
        )
        .order_by(
            Registration.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for registration, user, event in recent_registrations:

        user_name = (
            f"{user.first_name} "
            f"{user.last_name}"
        ).strip()

        recent_activity.append(
            {
                "type": "registration",
                "message": (
                    f"{user_name} registered "
                    f"for '{event.event_name}'."
                ),
                "created_at":
                    registration.created_at,
            }
        )

    # ------------------------------------------
    # Recent Payments
    # ------------------------------------------

    recent_payments = (
        db.query(
            Payment,
            Registration,
            User,
            Event,
        )
        .join(
            Registration,
            Payment.registration_id
            == Registration.id,
        )
        .join(
            User,
            Registration.user_id
            == User.id,
        )
        .join(
            Event,
            Registration.event_id
            == Event.id,
        )
        .order_by(
            Payment.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for payment, registration, user, event in recent_payments:

        user_name = (
            f"{user.first_name} "
            f"{user.last_name}"
        ).strip()

        amount = float(
            payment.amount
            or 0
        )

        recent_activity.append(
            {
                "type": "payment",
                "message": (
                    f"Payment of ₹"
                    f"{amount:,.2f} received "
                    f"from {user_name} for "
                    f"'{event.event_name}'."
                ),
                "created_at":
                    payment.created_at,
            }
        )

    # ------------------------------------------
    # Recent Check-Ins
    # ------------------------------------------

    recent_checkins = (
        db.query(
            CheckIn,
            Registration,
            User,
            Event,
        )
        .join(
            Registration,
            CheckIn.registration_id
            == Registration.id,
        )
        .join(
            User,
            Registration.user_id
            == User.id,
        )
        .join(
            Event,
            Registration.event_id
            == Event.id,
        )
        .filter(
            CheckIn.attendance_status
            == "Checked-In"
        )
        .order_by(
            CheckIn.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for checkin, registration, user, event in recent_checkins:

        user_name = (
            f"{user.first_name} "
            f"{user.last_name}"
        ).strip()

        recent_activity.append(
            {
                "type": "checkin",
                "message": (
                    f"{user_name} checked in "
                    f"for '{event.event_name}'."
                ),
                "created_at":
                    checkin.created_at,
            }
        )

    # ------------------------------------------
    # Recent Sponsors
    # ------------------------------------------

    recent_sponsors = (
        db.query(Sponsor)
        .order_by(
            Sponsor.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for sponsor in recent_sponsors:

        recent_activity.append(
            {
                "type": "sponsor",
                "message": (
                    f"Sponsor "
                    f"'{sponsor.sponsor_name}' "
                    f"was added."
                ),
                "created_at":
                    sponsor.created_at,
            }
        )

    # ------------------------------------------
    # Recent Vendors
    # ------------------------------------------

    recent_vendors = (
        db.query(Vendor)
        .order_by(
            Vendor.created_at.desc()
        )
        .limit(5)
        .all()
    )

    for vendor in recent_vendors:

        vendor_name = getattr(
            vendor,
            "vendor_name",
            None,
        )

        if not vendor_name:

            vendor_name = (
                f"Vendor #{vendor.id}"
            )

        recent_activity.append(
            {
                "type": "vendor",
                "message": (
                    f"Vendor "
                    f"'{vendor_name}' "
                    f"was added."
                ),
                "created_at":
                    vendor.created_at,
            }
        )

    # ------------------------------------------
    # Sort All Activity
    # ------------------------------------------

    recent_activity = [
        activity
        for activity in recent_activity
        if activity["created_at"]
        is not None
    ]

    recent_activity.sort(
        key=lambda activity:
            activity["created_at"],
        reverse=True,
    )

    # Keep only latest 10 activities

    recent_activity = (
        recent_activity[:10]
    )
    
    # ==========================================
    # Dashboard Response
    # ==========================================

    return {

        # --------------------------------------
        # Events
        # --------------------------------------

        "total_events":
            total_events,

        "published_events":
            published_events,

        "draft_events":
            draft_events,

        "completed_events":
            completed_events,

        "upcoming_events":
            upcoming_events,

        # --------------------------------------
        # Registrations
        # --------------------------------------

        "total_registrations":
            total_registrations,

        "confirmed_registrations":
            confirmed_registrations,

        "pending_registrations":
            pending_registrations,

        "registration_rate":
            registration_rate,

        # --------------------------------------
        # Tickets
        # --------------------------------------

        "total_tickets":
            total_tickets,

        # --------------------------------------
        # Check-Ins
        # --------------------------------------

        "checked_in_count":
            checked_in_count,

        # --------------------------------------
        # Revenue
        # --------------------------------------

        "total_revenue":
            total_revenue,

        # --------------------------------------
        # Speakers
        # --------------------------------------

        "total_speakers":
            total_speakers,

        # --------------------------------------
        # Sessions
        # --------------------------------------

        "total_sessions":
            total_sessions,

        # --------------------------------------
        # Sponsors
        # --------------------------------------

        "total_sponsors":
            total_sponsors,

        # --------------------------------------
        # Vendors
        # --------------------------------------

        "total_vendors":
            total_vendors,

        # --------------------------------------
        # Feedback
        # --------------------------------------

        "total_feedback":
            total_feedback,

        "average_feedback_rating":
            average_feedback_rating,

        "recent_activity":
            recent_activity,
    }
