from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.registration import Registration


def build_user_context(
    db: Session,
    user_id: int,
) -> str:
    """
    Build safe AI context for a normal EventAI user.

    Includes:
    - available event information
    - current user's registrations
    - current user's tickets
    - current user's payments
    - current user's check-in information

    Does NOT expose:
    - other users
    - platform revenue
    - admin analytics
    - all attendee details
    """

    # ==========================================
    # AVAILABLE EVENTS
    # ==========================================

    events = (
        db.query(Event)
        .order_by(Event.start_date)
        .all()
    )

    event_lines = []

    for event in events:

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
Description: {event.description or "Not available"}
Status: {event.status}
Start Date: {event.start_date}
End Date: {event.end_date}
Start Time: {event.start_time}
End Time: {event.end_time}
Venue: {venue_name}
Capacity: {event.capacity}
"""
        )

    if not event_lines:
        event_lines.append(
            "No events are currently available."
        )

    # ==========================================
    # CURRENT USER REGISTRATIONS
    # ==========================================

    registrations = (
        db.query(Registration)
        .filter(
            Registration.user_id == user_id
        )
        .order_by(
            Registration.registration_date.desc()
        )
        .all()
    )

    registration_lines = []

    total_paid = 0.0
    total_refunded = 0.0
    checked_in_count = 0
    issued_ticket_count = 0

    for registration in registrations:

        event = registration.event
        ticket = registration.ticket
        payment = registration.payment
        check_in = registration.check_in

        # --------------------------------------
        # Ticket
        # --------------------------------------

        if ticket:

            issued_ticket_count += 1

            ticket_info = f"""
Ticket ID: {ticket.id}
Ticket Category: {ticket.ticket_category}
Ticket Price: INR {float(ticket.price):,.2f}
Ticket Status: {ticket.status}
QR Enabled: {"Yes" if ticket.qr_enabled else "No"}
"""

        else:

            ticket_info = """
Ticket: Not assigned
"""

        # --------------------------------------
        # Payment
        # --------------------------------------

        if payment:

            amount = float(
                payment.amount or 0
            )

            refund = float(
                payment.refund_amount or 0
            )

            if payment.payment_status == "Paid":
                total_paid += amount

            total_refunded += refund

            payment_info = f"""
Payment Amount: INR {amount:,.2f}
Payment Status: {payment.payment_status}
Payment Method: {payment.payment_method}
Payment Date: {payment.payment_date}
Refund Amount: INR {refund:,.2f}
"""

        else:

            payment_info = """
Payment: No payment record
"""

        # --------------------------------------
        # Check-In
        # --------------------------------------

        if check_in:

            if (
                check_in.attendance_status
                == "Checked-In"
            ):
                checked_in_count += 1

            checkin_info = f"""
Attendance Status: {check_in.attendance_status}
Check-In Time: {check_in.check_in_time}
Entry Gate: {check_in.entry_gate or "Not available"}
Badge Printed: {"Yes" if check_in.badge_printed else "No"}
"""

        else:

            checkin_info = """
Attendance Status: Not Checked-In
"""

        # --------------------------------------
        # Registration
        # --------------------------------------

        registration_lines.append(
            f"""
Registration ID: {registration.id}
Registration Number: {registration.registration_number or "Not available"}

Event ID: {event.id}
Event Name: {event.event_name}
Event Status: {event.status}

Event Start Date: {event.start_date}
Event End Date: {event.end_date}
Event Start Time: {event.start_time}
Event End Time: {event.end_time}

Registration Date: {registration.registration_date}
Registration Status: {registration.status}

{ticket_info}

{payment_info}

{checkin_info}
"""
        )

    if not registration_lines:

        registration_lines.append(
            "The current user has no event registrations."
        )

    # ==========================================
    # USER SUMMARY
    # ==========================================

    net_paid = (
        total_paid
        - total_refunded
    )

    # ==========================================
    # FINAL USER-SAFE CONTEXT
    # ==========================================

    context = f"""
==================================================
EVENTAI USER ASSISTANT CONTEXT
==================================================

This information belongs to the currently
authenticated EventAI user.

The assistant may answer questions about:

- available events
- event information
- event schedules
- venues
- the user's own registrations
- the user's own tickets
- the user's own payments
- the user's own refunds
- the user's own check-in status
- the user's EventAI activity

The assistant MUST NOT claim access to other
users' private information or admin-only
platform analytics.

==================================================
AVAILABLE EVENTS
==================================================

{"".join(event_lines)}

==================================================
MY EVENTAI SUMMARY
==================================================

My Total Registrations: {len(registrations)}

My Tickets Issued: {issued_ticket_count}

My Checked-In Events: {checked_in_count}

My Total Paid Amount: INR {total_paid:,.2f}

My Total Refund Amount: INR {total_refunded:,.2f}

My Net Paid Amount: INR {net_paid:,.2f}

==================================================
MY REGISTRATIONS / TICKETS / PAYMENTS
==================================================

{"".join(registration_lines)}

==================================================
END USER CONTEXT
==================================================
"""

    return context