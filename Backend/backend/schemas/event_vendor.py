from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventVendorCreate(BaseModel):
    event_id: int
    vendor_id: int


class EventVendorResponse(BaseModel):
    id: int
    event_id: int
    vendor_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )