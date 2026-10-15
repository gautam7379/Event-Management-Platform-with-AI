from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventSponsorCreate(BaseModel):
    """
    Schema for assigning a sponsor to an event.
    """

    event_id: int
    sponsor_id: int


class EventSponsorResponse(BaseModel):
    """
    Event-sponsor assignment response.
    """

    id: int
    event_id: int
    sponsor_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )