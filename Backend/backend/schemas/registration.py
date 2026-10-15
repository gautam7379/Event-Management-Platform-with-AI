from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RegistrationCreate(BaseModel):
    """
    Schema for registering a user to an event.
    """

    user_id: int
    event_id: int


class RegistrationResponse(BaseModel):
    """
    Registration response schema.
    """

    id: int
    user_id: int
    event_id: int

    ticket_id: int | None = None

    registration_number: str | None = None

    registration_date: datetime

    status: str

    qr_code: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )

class AttendeeResponse(BaseModel):
    """
    Detailed attendee information for
    admin/organizer attendee management.
    """

    registration_id: int
    registration_number: str | None = None

    user_id: int
    event_id: int

    name: str
    email: str
    phone: str | None = None

    event_name: str

    registration_date: datetime
    registration_status: str

    attendance_status: str
    check_in_time: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )

class AdminAttendeeCreate(BaseModel):
    """
    Schema used by admin/organizer
    to register an attendee.
    """

    name: str
    email: str
    phone: str | None = None
    event_id: int
    attendance_status: str = "Pending"

class AdminAttendeeCreate(BaseModel):
    """
    Register an attendee from the
    admin/organizer attendee dashboard.
    """

    name: str
    email: str
    phone: str | None = None
    event_id: int
    attendance_status: str = "Pending"