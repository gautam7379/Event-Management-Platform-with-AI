from sqlalchemy.orm import Session

from backend.crud.event import get_event_by_id
from backend.crud.session import (
    create_session,
    delete_session,
    get_all_sessions,
    get_session_by_id,
    update_session,
)
from backend.crud.speaker import get_speaker_by_id
from backend.models.session import Session as SessionModel
from backend.schemas.session import (
    SessionCreate,
    SessionUpdate,
)


def create_new_session(
    db: Session,
    session: SessionCreate,
) -> SessionModel:
    """
    Create a new session.
    """

    if get_event_by_id(db, session.event_id) is None:
        raise ValueError("Event not found.")

    if get_speaker_by_id(db, session.speaker_id) is None:
        raise ValueError("Speaker not found.")

    if session.start_time >= session.end_time:
        raise ValueError(
            "Start time must be earlier than end time."
        )

    return create_session(
        db=db,
        session=session,
    )


def get_session(
    db: Session,
    session_id: int,
) -> SessionModel:
    """
    Get session by ID.
    """

    db_session = get_session_by_id(
        db=db,
        session_id=session_id,
    )

    if db_session is None:
        raise ValueError(
            "Session not found."
        )

    return db_session


def get_sessions(
    db: Session,
) -> list[SessionModel]:
    """
    Get all sessions.
    """

    return get_all_sessions(db=db)


def update_existing_session(
    db: Session,
    session_id: int,
    session: SessionUpdate,
) -> SessionModel:
    """
    Update an existing session.
    """

    db_session = get_session_by_id(
        db=db,
        session_id=session_id,
    )

    if db_session is None:
        raise ValueError(
            "Session not found."
        )

    if (
        session.event_id is not None
        and get_event_by_id(db, session.event_id) is None
    ):
        raise ValueError("Event not found.")

    if (
        session.speaker_id is not None
        and get_speaker_by_id(db, session.speaker_id) is None
    ):
        raise ValueError("Speaker not found.")

    start_time = (
        session.start_time
        if session.start_time is not None
        else db_session.start_time
    )

    end_time = (
        session.end_time
        if session.end_time is not None
        else db_session.end_time
    )

    if start_time >= end_time:
        raise ValueError(
            "Start time must be earlier than end time."
        )

    return update_session(
        db=db,
        db_session=db_session,
        session=session,
    )


def delete_existing_session(
    db: Session,
    session_id: int,
) -> None:
    """
    Delete an existing session.
    """

    db_session = get_session_by_id(
        db=db,
        session_id=session_id,
    )

    if db_session is None:
        raise ValueError(
            "Session not found."
        )

    delete_session(
        db=db,
        db_session=db_session,
    )