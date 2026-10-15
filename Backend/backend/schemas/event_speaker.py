from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventSpeakerCreate(BaseModel):
    event_id: int
    speaker_id: int


class EventSpeakerResponse(BaseModel):
    id: int
    event_id: int
    speaker_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )