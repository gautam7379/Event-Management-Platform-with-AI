from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.session import Session as EventSession
from backend.models.event_speaker import EventSpeaker
from backend.models.event_sponsor import EventSponsor
from backend.models.event_vendor import EventVendor
from backend.models.check_in import CheckIn
from backend.models.payment import Payment


def safe(value, default="Not available"):
    """
    Convert nullable database values into
    AI-friendly text.
    """

    if value is None:
        return default

    return str(value)


def build_analytics_context(
    db: Session,
    event_id: int,
) -> str:
    """
    Build complete database-backed context
    for the EventAI chatbot.

    IMPORTANT:
    All factual information supplied to the
    LLM comes from PostgreSQL.
    """

    # ==========================================
    # EVENT
    # ==========================================

    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if event is None:
        raise ValueError("Event not found.")

    # ==========================================
    # VENUE
    # ==========================================

    venue = event.venue

    if venue:

        venue_details = f"""
Venue Name: {safe(venue.venue_name)}
Address: {safe(venue.address)}
City: {safe(venue.city)}
State: {safe(venue.state)}
Country: {safe(venue.country)}
Postal Code: {safe(venue.postal_code)}
Venue Capacity: {venue.capacity}
Contact Person: {safe(venue.contact_person)}
Venue Phone: {safe(venue.phone)}
"""

    else:

        venue_details = """
Venue: Not available
"""

    # ==========================================
    # REGISTRATIONS
    # ==========================================

    registrations = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id
        )
        .all()
    )

    total_registrations = len(registrations)

    confirmed = sum(
        1
        for registration in registrations
        if registration.status == "Confirmed"
    )

    pending = sum(
        1
        for registration in registrations
        if registration.status == "Pending"
    )

    cancelled = sum(
        1
        for registration in registrations
        if registration.status == "Cancelled"
    )

    transferred = sum(
        1
        for registration in registrations
        if registration.status == "Transferred"
    )

    available_capacity = max(
        event.capacity - total_registrations,
        0,
    )

    if event.capacity > 0:

        registration_percentage = (
            total_registrations
            / event.capacity
        ) * 100

    else:

        registration_percentage = 0

    # ==========================================
    # CHECK-INS / ATTENDANCE
    # ==========================================

    checked_in = (
        db.query(CheckIn)
        .join(
            Registration,
            CheckIn.registration_id
            == Registration.id,
        )
        .filter(
            Registration.event_id == event_id,
            CheckIn.attendance_status
            == "Checked-In",
        )
        .count()
    )

    no_show = (
        db.query(CheckIn)
        .join(
            Registration,
            CheckIn.registration_id
            == Registration.id,
        )
        .filter(
            Registration.event_id == event_id,
            CheckIn.attendance_status
            == "No-Show",
        )
        .count()
    )

    not_checked_in = max(
        total_registrations
        - checked_in
        - no_show,
        0,
    )

    if total_registrations > 0:

        attendance_percentage = (
            checked_in
            / total_registrations
        ) * 100

    else:

        attendance_percentage = 0

    # ==========================================
    # SESSIONS
    # ==========================================

    sessions = (
        db.query(EventSession)
        .filter(
            EventSession.event_id == event_id
        )
        .order_by(
            EventSession.start_time
        )
        .all()
    )

    session_lines = []

    for session in sessions:

        speaker_name = "Not assigned"

        if session.speaker:

            speaker_name = (
                f"{session.speaker.first_name} "
                f"{session.speaker.last_name}"
            )

        session_lines.append(
            f"""
Session ID: {session.id}
Title: {session.session_title}
Description: {safe(session.description)}
Speaker: {speaker_name}
Room: {safe(session.room_number)}
Start Time: {session.start_time}
End Time: {session.end_time}
""".strip()
        )

    sessions_text = (
        "\n\n".join(session_lines)
        if session_lines
        else "No sessions assigned."
    )

    # ==========================================
    # SPEAKERS
    # ==========================================

    event_speakers = (
        db.query(EventSpeaker)
        .filter(
            EventSpeaker.event_id == event_id
        )
        .all()
    )

    speaker_lines = []

    for relation in event_speakers:

        speaker = relation.speaker

        if not speaker:
            continue

        speaker_lines.append(
            f"""
Name: {speaker.first_name} {speaker.last_name}
Organization: {safe(speaker.organization)}
Designation: {safe(speaker.designation)}
Experience: {safe(speaker.experience)}
Expertise: {safe(speaker.expertise)}
Speaker Type: {safe(speaker.speaker_type)}
Bio: {safe(speaker.bio)}
""".strip()
        )

    speakers_text = (
        "\n\n".join(speaker_lines)
        if speaker_lines
        else "No speakers assigned."
    )

    # ==========================================
    # VENDORS
    # ==========================================

    event_vendors = (
        db.query(EventVendor)
        .filter(
            EventVendor.event_id == event_id
        )
        .all()
    )

    vendor_lines = []

    total_vendor_cost = 0.0

    for relation in event_vendors:

        vendor = relation.vendor

        if not vendor:
            continue

        vendor_cost = float(
            vendor.cost or 0
        )

        total_vendor_cost += vendor_cost

        vendor_lines.append(
            f"""
Vendor Name: {vendor.vendor_name}
Type: {vendor.vendor_type}
Service: {safe(vendor.service_description)}
Cost: ₹{vendor_cost:.2f}
Status: {vendor.status}
Contact Person: {safe(vendor.contact_person)}
""".strip()
        )

    vendors_text = (
        "\n\n".join(vendor_lines)
        if vendor_lines
        else "No vendors assigned."
    )

    # ==========================================
    # SPONSORS
    # ==========================================

    event_sponsors = (
        db.query(EventSponsor)
        .filter(
            EventSponsor.event_id == event_id
        )
        .all()
    )

    sponsor_lines = []

    total_sponsorship = 0.0

    for relation in event_sponsors:

        sponsor = relation.sponsor

        if not sponsor:
            continue

        contribution = float(
            sponsor.contribution or 0
        )

        total_sponsorship += contribution

        sponsor_lines.append(
            f"""
Sponsor Name: {sponsor.sponsor_name}
Level: {sponsor.sponsorship_level}
Contribution: ₹{contribution:.2f}
Contact Person: {safe(sponsor.contact_person)}
""".strip()
        )

    sponsors_text = (
        "\n\n".join(sponsor_lines)
        if sponsor_lines
        else "No sponsors assigned."
    )

    # ==========================================
    # PAYMENTS
    # ==========================================

    payment_stats = (
        db.query(
            Payment.payment_status,
            func.count(Payment.id),
            func.coalesce(
                func.sum(Payment.amount),
                0,
            ),
        )
        .join(
            Registration,
            Payment.registration_id
            == Registration.id,
        )
        .filter(
            Registration.event_id == event_id
        )
        .group_by(
            Payment.payment_status
        )
        .all()
    )

    payment_counts = {
        "Paid": 0,
        "Pending": 0,
        "Failed": 0,
        "Refunded": 0,
    }

    payment_amounts = {
        "Paid": 0.0,
        "Pending": 0.0,
        "Failed": 0.0,
        "Refunded": 0.0,
    }

    for (
        payment_status,
        count,
        amount,
    ) in payment_stats:

        payment_counts[
            payment_status
        ] = count

        payment_amounts[
            payment_status
        ] = float(amount or 0)

    total_paid_revenue = (
        payment_amounts["Paid"]
    )

    # ==========================================
    # BUILD FINAL AI CONTEXT
    # ==========================================

    context = f"""
==================================================
EVENTAI DATABASE CONTEXT
==================================================

EVENT INFORMATION

Event ID: {event.id}
Event Name: {event.event_name}
Event Type: {event.event_type}
Status: {event.status}
Description: {safe(event.description)}
Agenda: {safe(event.agenda)}

Start Date: {event.start_date}
End Date: {event.end_date}
Start Time: {event.start_time}
End Time: {event.end_time}

Event Capacity: {event.capacity}


--------------------------------------------------
VENUE
--------------------------------------------------

{venue_details}


--------------------------------------------------
REGISTRATION ANALYTICS
--------------------------------------------------

Total Registrations: {total_registrations}
Confirmed Registrations: {confirmed}
Pending Registrations: {pending}
Cancelled Registrations: {cancelled}
Transferred Registrations: {transferred}

Available Capacity: {available_capacity}

Registration Utilization:
{registration_percentage:.2f}%


--------------------------------------------------
ATTENDANCE / CHECK-IN
--------------------------------------------------

Checked In: {checked_in}
No Show: {no_show}
Not Checked In: {not_checked_in}

Current Attendance Rate:
{attendance_percentage:.2f}%


--------------------------------------------------
SESSIONS
--------------------------------------------------

Total Sessions: {len(sessions)}

{sessions_text}


--------------------------------------------------
SPEAKERS
--------------------------------------------------

Total Speakers: {len(speaker_lines)}

{speakers_text}


--------------------------------------------------
VENDORS
--------------------------------------------------

Total Vendors: {len(vendor_lines)}

Estimated Vendor Cost:
₹{total_vendor_cost:.2f}

{vendors_text}


--------------------------------------------------
SPONSORS
--------------------------------------------------

Total Sponsors: {len(sponsor_lines)}

Total Sponsorship:
₹{total_sponsorship:.2f}

{sponsors_text}


--------------------------------------------------
PAYMENT ANALYTICS
--------------------------------------------------

Paid Payments: {payment_counts["Paid"]}
Pending Payments: {payment_counts["Pending"]}
Failed Payments: {payment_counts["Failed"]}
Refunded Payments: {payment_counts["Refunded"]}

Confirmed Paid Revenue:
₹{total_paid_revenue:.2f}


==================================================
END DATABASE CONTEXT
==================================================
"""

    return context