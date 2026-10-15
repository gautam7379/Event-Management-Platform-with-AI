from sqlalchemy import func
from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.check_in import CheckIn
from backend.models.session import Session as EventSession
from backend.models.event_speaker import EventSpeaker
from backend.models.event_sponsor import EventSponsor
from backend.models.event_vendor import EventVendor
from backend.models.payment import Payment
from backend.models.user import User


def build_platform_context(
    db: Session,
) -> str:
    """
    Build platform-wide context for the AI chatbot.

    This context contains aggregate information
    across all events in EventAI.
    """

    # ==========================================
    # EVENTS
    # ==========================================

    events = (
        db.query(Event)
        .order_by(Event.id)
        .all()
    )

    total_events = len(events)

    published_events = sum(
        1
        for event in events
        if event.status == "Published"
    )

    draft_events = sum(
        1
        for event in events
        if event.status == "Draft"
    )

    # ==========================================
    # REGISTRATIONS
    # ==========================================

    total_registrations = (
        db.query(Registration)
        .count()
    )

    confirmed = (
        db.query(Registration)
        .filter(
            Registration.status == "Confirmed"
        )
        .count()
    )

    pending = (
        db.query(Registration)
        .filter(
            Registration.status == "Pending"
        )
        .count()
    )

    cancelled = (
        db.query(Registration)
        .filter(
            Registration.status == "Cancelled"
        )
        .count()
    )

    transferred = (
        db.query(Registration)
        .filter(
            Registration.status == "Transferred"
        )
        .count()
    )

    # ==========================================
    # CHECK-INS
    # ==========================================

    total_checked_in = (
        db.query(CheckIn)
        .filter(
            CheckIn.attendance_status
            == "Checked-In"
        )
        .count()
    )

    total_no_show = (
        db.query(CheckIn)
        .filter(
            CheckIn.attendance_status
            == "No-Show"
        )
        .count()
    )

    # ==========================================
    # EVENT RESOURCES
    # ==========================================

    total_sessions = (
        db.query(EventSession)
        .count()
    )

    total_speakers = (
        db.query(EventSpeaker)
        .count()
    )

    total_sponsors = (
        db.query(EventSponsor)
        .count()
    )

    total_vendors = (
        db.query(EventVendor)
        .count()
    )


    # ==========================================
    # PAYMENT / REVENUE SUMMARY
    # ==========================================

    total_payments = (
        db.query(Payment)
        .count()
    )

    successful_payments = (
        db.query(Payment)
        .filter(
            Payment.payment_status == "Paid"
        )
        .count()
    )

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0
            )
        )
        .filter(
            Payment.payment_status == "Paid"
        )
        .scalar()
    )

    total_refunded_amount = (
        db.query(
            func.coalesce(
                func.sum(Payment.refund_amount),
                0
            )
        )
        .scalar()
    )

    net_revenue = (
        float(total_revenue)
        -
        float(total_refunded_amount)
    )
    # ==========================================
    # PAYMENTS
    # ==========================================

    payment_rows = (
        db.query(
            Payment.payment_status,
            func.count(Payment.id),
            func.coalesce(
                func.sum(Payment.amount),
                0
            ),
        )
        .group_by(
            Payment.payment_status
        )
        .all()
    )

    payment_lines = []

    for status, count, amount in payment_rows:

        payment_lines.append(
            f"- {status}: "
            f"{count} payments, "
            f"amount {float(amount):.2f}"
        )

    if not payment_lines:
        payment_lines.append(
            "- No payment data available."
        )

    # ==========================================
    # EVENT-WISE ANALYTICS
    # ==========================================

    event_lines = []

    for event in events:

        event_registrations = (
            db.query(Registration)
            .filter(
                Registration.event_id == event.id
            )
            .count()
        )

        event_confirmed = (
            db.query(Registration)
            .filter(
                Registration.event_id == event.id,
                Registration.status == "Confirmed",
            )
            .count()
        )

        event_pending = (
            db.query(Registration)
            .filter(
                Registration.event_id == event.id,
                Registration.status == "Pending",
            )
            .count()
        )

        event_cancelled = (
            db.query(Registration)
            .filter(
                Registration.event_id == event.id,
                Registration.status == "Cancelled",
            )
            .count()
        )

        event_checked_in = (
            db.query(CheckIn)
            .join(
                Registration,
                CheckIn.registration_id == Registration.id,
            )
            .filter(
                Registration.event_id == event.id,
                CheckIn.attendance_status == "Checked-In",
            )
            .count()
        )

        event_sessions = (
            db.query(EventSession)
            .filter(
                EventSession.event_id == event.id
            )
            .count()
        )

        event_speakers = (
            db.query(EventSpeaker)
            .filter(
                EventSpeaker.event_id == event.id
            )
            .count()
        )

        event_sponsors = (
            db.query(EventSponsor)
            .filter(
                EventSponsor.event_id == event.id
            )
            .count()
        )

        event_vendors = (
            db.query(EventVendor)
            .filter(
                EventVendor.event_id == event.id
            )
            .count()
        )

        event_revenue = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0
                )
            )
            .join(
                Registration,
                Payment.registration_id == Registration.id,
            )
            .filter(
                Registration.event_id == event.id,
                Payment.payment_status == "Paid",
            )
            .scalar()
        )

        venue_name = (
            event.venue.venue_name
            if event.venue
            else "Not assigned"
        )

        event_lines.append(
            f"""
    Event ID: {event.id}
    Event Name: {event.event_name}
    Event Type: {event.event_type}
    Status: {event.status}
    Description: {event.description or "Not available"}
    Start Date: {event.start_date}
    End Date: {event.end_date}
    Start Time: {event.start_time}
    End Time: {event.end_time}
    Venue: {venue_name}
    Capacity: {event.capacity}

    Registrations: {event_registrations}
    Confirmed Registrations: {event_confirmed}
    Pending Registrations: {event_pending}
    Cancelled Registrations: {event_cancelled}
    Checked-In Attendees: {event_checked_in}

    Sessions: {event_sessions}
    Speakers: {event_speakers}
    Sponsors: {event_sponsors}
    Vendors: {event_vendors}

    Revenue: INR {float(event_revenue):.2f}
    """
        )

    if not event_lines:

        event_lines.append(
            "No events available."
        )

    # ---------------------------------
    # USER REGISTRATION ANALYTICS
    # ---------------------------------

    user_registration_stats = (
        db.query(
            User.id,
            User.first_name,
            User.last_name,
            User.email,
            func.count(
                Registration.id
            ).label("registration_count"),
        )
        .join(
            Registration,
            Registration.user_id == User.id
        )
        .group_by(
            User.id,
            User.first_name,
            User.last_name,
            User.email,
        )
        .order_by(
            func.count(
                Registration.id
            ).desc()
        )
        .all()
    )


    user_registration_lines = []

    for row in user_registration_stats:

        full_name = (
            f"{row.first_name} "
            f"{row.last_name}"
        ).strip()

        user_registration_lines.append(
            f"User ID {row.id}: "
            f"{full_name} | "
            f"Registrations: "
            f"{row.registration_count}"
        )


    # User with most registrations

    if user_registration_stats:

        top_user = user_registration_stats[0]

        top_user_name = (
            f"{top_user.first_name} "
            f"{top_user.last_name}"
        ).strip()

        most_active_user_text = (
            f"{top_user_name} "
            f"(User ID {top_user.id}) "
            f"with "
            f"{top_user.registration_count} "
            f"event registrations"
        )

    else:

        most_active_user_text = (
            "No registered users available"
        )


    # ==========================================
    # TICKET SUMMARY
    # ==========================================

    total_tickets_issued = (
        db.query(Registration)
        .filter(
            Registration.ticket_id.isnot(None)
        )
        .count()
    )

    # ==========================================
    # BUILD CONTEXT
    # ==========================================

    context = f"""
    EVENTAI PLATFORM ANALYTICS

    ==================================================
    PLATFORM SUMMARY
    ==================================================

    Total Events: {total_events}
    Published Events: {published_events}
    Draft Events: {draft_events}


    ==================================================
    REGISTRATIONS
    ==================================================

    Total Registrations: {total_registrations}
    Confirmed Registrations: {confirmed}
    Pending Registrations: {pending}
    Cancelled Registrations: {cancelled}
    Transferred Registrations: {transferred}


    ==================================================
    ATTENDANCE
    ==================================================

    Total Registered Attendees: {total_registrations}
    Total Checked-In Attendees: {total_checked_in}
    Total No-Show Attendees: {total_no_show}
    Pending Check-In Attendees: {
        max(
            total_registrations
            - total_checked_in
            - total_no_show,
            0
        )
    }


    ==================================================
    EVENT RESOURCES
    ==================================================

    Sessions: {total_sessions}
    Speaker Assignments: {total_speakers}
    Sponsor Assignments: {total_sponsors}
    Vendor Assignments: {total_vendors}


    ==================================================
    PAYMENTS AND REVENUE
    ==================================================

    Total Payment Records: {total_payments}
    Successful Paid Payments: {successful_payments}
    Total Revenue: INR {float(total_revenue):.2f}
    Total Refunded Amount: INR {float(total_refunded_amount):.2f}
    Net Revenue: INR {net_revenue:.2f}

    Payment Status Breakdown:
    {chr(10).join(payment_lines)}


    ==================================================
    TICKETS
    ==================================================

    Total Tickets Issued: {total_tickets_issued}


    ==================================================
    EVENT-WISE ANALYTICS
    ==================================================

    {chr(10).join(event_lines)}


    ==================================================
    USER REGISTRATION ANALYTICS
    ==================================================

    {chr(10).join(user_registration_lines)
    if user_registration_lines
    else "No user registration data available."}


    ==================================================
    USER WITH MOST EVENT REGISTRATIONS
    ==================================================

    {most_active_user_text}

    """

    return context