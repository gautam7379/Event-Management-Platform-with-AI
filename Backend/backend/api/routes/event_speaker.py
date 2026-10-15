from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.models.event_speaker import EventSpeaker
from backend.models.event import Event
from backend.models.speaker import Speaker
from backend.schemas.event_speaker import (
    EventSpeakerCreate,
    EventSpeakerResponse,
)


router = APIRouter(
    prefix="/event-speakers",
    tags=["Event Speakers"],
)


@router.get(
    "/",
    response_model=list[EventSpeakerResponse],
)
def get_event_speakers(
    db: Session = Depends(get_db),
):
    return (
        db.query(EventSpeaker)
        .order_by(EventSpeaker.id)
        .all()
    )


@router.post(
    "/",
    response_model=EventSpeakerResponse,
    status_code=status.HTTP_201_CREATED,
)
def assign_speaker_to_event(
    data: EventSpeakerCreate,
    db: Session = Depends(get_db),
):

    # Check event
    event = (
        db.query(Event)
        .filter(Event.id == data.event_id)
        .first()
    )

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found."
        )

    # Check speaker
    speaker = (
        db.query(Speaker)
        .filter(Speaker.id == data.speaker_id)
        .first()
    )

    if not speaker:
        raise HTTPException(
            status_code=404,
            detail="Speaker not found."
        )

    # Prevent duplicate assignment
    existing = (
        db.query(EventSpeaker)
        .filter(
            EventSpeaker.event_id == data.event_id,
            EventSpeaker.speaker_id == data.speaker_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Speaker already assigned to this event."
        )

    assignment = EventSpeaker(
        event_id=data.event_id,
        speaker_id=data.speaker_id,
    )

    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return assignment


@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_event_speaker(
    assignment_id: int,
    db: Session = Depends(get_db),
):

    assignment = (
        db.query(EventSpeaker)
        .filter(EventSpeaker.id == assignment_id)
        .first()
    )

    if not assignment:
        raise HTTPException(
            status_code=404,
            detail="Assignment not found."
        )

    db.delete(assignment)
    db.commit()

    return None