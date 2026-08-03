from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.registration import Registration
from backend.models.session import Session as EventSession
from backend.models.speaker import Speaker
from backend.models.sponsor import Sponsor
from backend.models.vendor import Vendor
from backend.models.event_speaker import EventSpeaker
from backend.models.event_sponsor import EventSponsor
from backend.models.event_vendor import EventVendor


def build_analytics_context(
    db: Session,
    event_id: int,
) -> str:
    """
    Build analytics context for AI.
    """

    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        raise ValueError("Event not found.")

    total_registrations = (
        db.query(Registration)
        .filter(Registration.event_id == event_id)
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

    speakers = (
        db.query(EventSpeaker)
        .filter(EventSpeaker.event_id == event_id)
        .count()
    )

    sessions = (
        db.query(EventSession)
        .filter(EventSession.event_id == event_id)
        .count()
    )

    sponsors = (
        db.query(EventSponsor)
        .filter(EventSponsor.event_id == event_id)
        .count()
    )

    vendors = (
        db.query(EventVendor)
        .filter(EventVendor.event_id == event_id)
        .count()
    )

    context = f"""
Event Analytics

Event Name: {event.event_name}
Event Type: {event.event_type}
Status: {event.status}

Capacity: {event.capacity}

Registrations

Total: {total_registrations}
Confirmed: {confirmed}
Pending: {pending}
Cancelled: {cancelled}

Resources

Speakers: {speakers}
Sessions: {sessions}
Sponsors: {sponsors}
Vendors: {vendors}
"""

    return context