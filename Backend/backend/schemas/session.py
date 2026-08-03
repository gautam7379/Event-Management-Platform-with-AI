from datetime import datetime, time

from pydantic import BaseModel, ConfigDict


class SessionCreate(BaseModel):
    """
    Schema for creating a session.
    """

    event_id: int
    speaker_id: int
    session_title: str
    description: str | None = None
    room_number: str | None = None
    start_time: time
    end_time: time


class SessionUpdate(BaseModel):
    """
    Schema for updating a session.
    """

    event_id: int | None = None
    speaker_id: int | None = None
    session_title: str | None = None
    description: str | None = None
    room_number: str | None = None
    start_time: time | None = None
    end_time: time | None = None


class SessionResponse(BaseModel):
    """
    Session response schema.
    """

    id: int
    event_id: int
    speaker_id: int
    session_title: str
    description: str | None
    room_number: str | None
    start_time: time
    end_time: time
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )