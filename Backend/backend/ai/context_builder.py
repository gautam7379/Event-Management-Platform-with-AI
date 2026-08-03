from sqlalchemy.orm import Session

from backend.models.event import Event
from backend.models.event_speaker import EventSpeaker
from backend.models.event_sponsor import EventSponsor
from backend.models.event_vendor import EventVendor
from backend.models.session import Session as EventSession
from backend.models.speaker import Speaker
from backend.models.sponsor import Sponsor
from backend.models.vendor import Vendor
from backend.models.venue import Venue


def build_event_context(
    db: Session,
    event_id: int,
) -> str:
    """
    Build complete event context for the AI assistant.
    """

    event = (
        db.query(Event)
        .filter(Event.id == event_id)
        .first()
    )

    if not event:
        raise ValueError("Event not found.")

    # ----------------------------
    # Venue
    # ----------------------------

    venue = (
        db.query(Venue)
        .filter(Venue.id == event.venue_id)
        .first()
    )

    # ----------------------------
    # Speakers
    # ----------------------------

    speaker_context = ""

    event_speakers = (
        db.query(EventSpeaker)
        .filter(EventSpeaker.event_id == event.id)
        .all()
    )

    for event_speaker in event_speakers:

        speaker = (
            db.query(Speaker)
            .filter(
                Speaker.id == event_speaker.speaker_id
            )
            .first()
        )

        if speaker:

            speaker_context += f"""
- {speaker.first_name} {speaker.last_name}
  Organization: {speaker.organization}
  Designation: {speaker.designation}
"""

    # ----------------------------
    # Sessions
    # ----------------------------

    session_context = ""

    sessions = (
        db.query(EventSession)
        .filter(EventSession.event_id == event.id)
        .all()
    )

    for session in sessions:

        session_context += f"""
- {session.session_title}
  Room: {session.room_number}
  Time: {session.start_time} - {session.end_time}
"""

    # ----------------------------
    # Sponsors
    # ----------------------------

    sponsor_context = ""

    event_sponsors = (
        db.query(EventSponsor)
        .filter(EventSponsor.event_id == event.id)
        .all()
    )

    for event_sponsor in event_sponsors:

        sponsor = (
            db.query(Sponsor)
            .filter(
                Sponsor.id == event_sponsor.sponsor_id
            )
            .first()
        )

        if sponsor:

            sponsor_context += f"""
- {sponsor.sponsor_name}
  Level: {sponsor.sponsorship_level}
"""

    # ----------------------------
    # Vendors
    # ----------------------------

    vendor_context = ""

    event_vendors = (
        db.query(EventVendor)
        .filter(EventVendor.event_id == event.id)
        .all()
    )

    for event_vendor in event_vendors:

        vendor = (
            db.query(Vendor)
            .filter(
                Vendor.id == event_vendor.vendor_id
            )
            .first()
        )

        if vendor:

            vendor_context += f"""
- {vendor.vendor_name}
  Type: {vendor.vendor_type}
"""

    # ----------------------------
    # Final Context
    # ----------------------------

    context = f"""
==========================
EVENT INFORMATION
==========================

Event Name: {event.event_name}
Event Type: {event.event_type}
Description: {event.description}
Capacity: {event.capacity}
Status: {event.status}

==========================
VENUE
==========================

Venue Name: {venue.venue_name if venue else "N/A"}
Address: {venue.address if venue else "N/A"}
City: {venue.city if venue else "N/A"}
State: {venue.state if venue else "N/A"}
Country: {venue.country if venue else "N/A"}
Capacity: {venue.capacity if venue else "N/A"}

==========================
SPEAKERS
==========================

{speaker_context if speaker_context else "No speakers assigned."}

==========================
SESSIONS
==========================

{session_context if session_context else "No sessions scheduled."}

==========================
SPONSORS
==========================

{sponsor_context if sponsor_context else "No sponsors assigned."}

==========================
VENDORS
==========================

{vendor_context if vendor_context else "No vendors assigned."}
"""

    return context