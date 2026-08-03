from datetime import datetime

from pydantic import BaseModel, ConfigDict


class RegistrationCreate(BaseModel):
    """
    Schema for registering a user to an event.
    """

    user_id: int
    event_id: int


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
    registration_date: datetime
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )