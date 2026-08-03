from datetime import datetime

from pydantic import BaseModel, ConfigDict


class CheckInCreate(BaseModel):
    """
    Schema for attendee check-in.
    """

    registration_id: int
    checked_in_by: int
    entry_gate: str
    badge_printed: bool = False
    attendance_status: str = "Checked-In"


class CheckInResponse(BaseModel):
    """
    Check-in response schema.
    """

    id: int
    registration_id: int
    checked_in_by: int
    check_in_time: datetime
    entry_gate: str | None
    badge_printed: bool
    attendance_status: str

    model_config = ConfigDict(
        from_attributes=True
    )