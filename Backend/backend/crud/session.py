from sqlalchemy.orm import Session

from backend.models.session import Session as SessionModel
from backend.schemas.session import (
    SessionCreate,
    SessionUpdate,
)


def create_session(
    db: Session,
    session: SessionCreate,
) -> SessionModel:
    """
    Create a new session.
    """

    db_session = SessionModel(
        event_id=session.event_id,
        speaker_id=session.speaker_id,
        session_title=session.session_title,
        description=session.description,
        room_number=session.room_number,
        start_time=session.start_time,
        end_time=session.end_time,
    )

    db.add(db_session)
    db.commit()
    db.refresh(db_session)

    return db_session


def get_session_by_id(
    db: Session,
    session_id: int,
) -> SessionModel | None:
    """
    Get session by ID.
    """

    return (
        db.query(SessionModel)
        .filter(SessionModel.id == session_id)
        .first()
    )


def get_all_sessions(
    db: Session,
) -> list[SessionModel]:
    """
    Get all sessions.
    """

    return (
        db.query(SessionModel)
        .order_by(SessionModel.id)
        .all()
    )


def update_session(
    db: Session,
    db_session: SessionModel,
    session: SessionUpdate,
) -> SessionModel:
    """
    Update an existing session.
    """

    update_data = session.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_session, key, value)

    db.commit()
    db.refresh(db_session)

    return db_session


def delete_session(
    db: Session,
    db_session: SessionModel,
) -> None:
    """
    Delete an existing session.
    """

    db.delete(db_session)
    db.commit()