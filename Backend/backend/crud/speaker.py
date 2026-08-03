from sqlalchemy.orm import Session

from backend.models.speaker import Speaker
from backend.schemas.speaker import (
    SpeakerCreate,
    SpeakerUpdate,
)


def create_speaker(
    db: Session,
    speaker: SpeakerCreate,
) -> Speaker:
    """
    Create a new speaker.
    """

    db_speaker = Speaker(
        first_name=speaker.first_name,
        last_name=speaker.last_name,
        email=speaker.email,
        phone=speaker.phone,
        organization=speaker.organization,
        designation=speaker.designation,
        bio=speaker.bio,
        profile_image=speaker.profile_image,
    )

    db.add(db_speaker)
    db.commit()
    db.refresh(db_speaker)

    return db_speaker


def get_speaker_by_id(
    db: Session,
    speaker_id: int,
) -> Speaker | None:
    """
    Get speaker by ID.
    """

    return (
        db.query(Speaker)
        .filter(Speaker.id == speaker_id)
        .first()
    )


def get_speaker_by_email(
    db: Session,
    email: str,
) -> Speaker | None:
    """
    Get speaker by email.
    """

    return (
        db.query(Speaker)
        .filter(Speaker.email == email)
        .first()
    )


def get_all_speakers(
    db: Session,
) -> list[Speaker]:
    """
    Get all speakers.
    """

    return (
        db.query(Speaker)
        .order_by(Speaker.id)
        .all()
    )


def update_speaker(
    db: Session,
    db_speaker: Speaker,
    speaker: SpeakerUpdate,
) -> Speaker:
    """
    Update an existing speaker.
    """

    update_data = speaker.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_speaker, key, value)

    db.commit()
    db.refresh(db_speaker)

    return db_speaker


def delete_speaker(
    db: Session,
    db_speaker: Speaker,
) -> None:
    """
    Delete an existing speaker.
    """

    db.delete(db_speaker)
    db.commit()