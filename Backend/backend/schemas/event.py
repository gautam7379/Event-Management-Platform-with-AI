from datetime import date, time
from typing import Optional

from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    organizer_id: int
    venue_id: int

    event_name: str = Field(..., max_length=200)
    event_type: str = Field(..., max_length=100)

    description: Optional[str] = None
    agenda: Optional[str] = None

    start_date: date
    end_date: date

    start_time: time
    end_time: time

    capacity: int = Field(..., gt=0)

    banner_image: Optional[str] = None

    status: str = Field(
        default="Draft",
        max_length=50,
    )


class EventUpdate(BaseModel):
    organizer_id: int
    venue_id: int

    event_name: str = Field(
        ...,
        max_length=255,
    )

    event_type: str = Field(
        ...,
        max_length=100,
    )

    description: str

    agenda: str | None = None

    start_date: date

    end_date: date

    start_time: time

    end_time: time

    capacity: int = Field(
        ...,
        ge=1,
    )

    banner_image: str | None = None

    status: str = Field(
        ...,
        max_length=50,
    )



class EventResponse(BaseModel):
    id: int

    organizer_id: int
    venue_id: int

    event_name: str
    event_type: str

    description: Optional[str]
    agenda: Optional[str]

    start_date: date
    end_date: date

    start_time: time
    end_time: time

    capacity: int

    banner_image: Optional[str]

    status: str

    model_config = {
        "from_attributes": True
    }