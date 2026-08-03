from sqlalchemy.orm import Session

from backend.crud.speaker import (
    create_speaker,
    delete_speaker,
    get_all_speakers,
    get_speaker_by_email,
    get_speaker_by_id,
    update_speaker,
)
from backend.models.speaker import Speaker
from backend.schemas.speaker import (
    SpeakerCreate,
    SpeakerUpdate,
)


def create_new_speaker(
    db: Session,
    speaker: SpeakerCreate,
) -> Speaker:
    """
    Create a new speaker.
    """

    existing_speaker = get_speaker_by_email(
        db=db,
        email=speaker.email,
    )

    if existing_speaker:
        raise ValueError(
            "Speaker with this email already exists."
        )

    return create_speaker(
        db=db,
        speaker=speaker,
    )


def get_speaker(
    db: Session,
    speaker_id: int,
) -> Speaker:
    """
    Get speaker by ID.
    """

    db_speaker = get_speaker_by_id(
        db=db,
        speaker_id=speaker_id,
    )

    if db_speaker is None:
        raise ValueError(
            "Speaker not found."
        )

    return db_speaker


def get_speakers(
    db: Session,
) -> list[Speaker]:
    """
    Get all speakers.
    """

    return get_all_speakers(db=db)


def update_existing_speaker(
    db: Session,
    speaker_id: int,
    speaker: SpeakerUpdate,
) -> Speaker:
    """
    Update an existing speaker.
    """

    db_speaker = get_speaker_by_id(
        db=db,
        speaker_id=speaker_id,
    )

    if db_speaker is None:
        raise ValueError(
            "Speaker not found."
        )

    if (
        speaker.email
        and speaker.email != db_speaker.email
    ):
        existing_speaker = get_speaker_by_email(
            db=db,
            email=speaker.email,
        )

        if existing_speaker:
            raise ValueError(
                "Speaker with this email already exists."
            )

    return update_speaker(
        db=db,
        db_speaker=db_speaker,
        speaker=speaker,
    )


def delete_existing_speaker(
    db: Session,
    speaker_id: int,
) -> None:
    """
    Delete an existing speaker.
    """

    db_speaker = get_speaker_by_id(
        db=db,
        speaker_id=speaker_id,
    )

    if db_speaker is None:
        raise ValueError(
            "Speaker not found."
        )

    delete_speaker(
        db=db,
        db_speaker=db_speaker,
    )