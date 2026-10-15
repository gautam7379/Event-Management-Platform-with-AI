from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class SpeakerCreate(BaseModel):
    """
    Schema for creating a speaker.
    """

    first_name: str
    last_name: str
    email: EmailStr

    phone: str | None = None
    organization: str | None = None
    designation: str | None = None

    experience: int | None = Field(
        default=None,
        ge=0,
    )

    expertise: str | None = None
    speaker_type: str | None = None

    bio: str | None = None


class SpeakerUpdate(BaseModel):
    """
    Schema for updating a speaker.
    """

    first_name: str | None = None
    last_name: str | None = None
    email: EmailStr | None = None

    phone: str | None = None
    organization: str | None = None
    designation: str | None = None

    experience: int | None = Field(
        default=None,
        ge=0,
    )

    expertise: str | None = None
    speaker_type: str | None = None

    bio: str | None = None


class SpeakerResponse(BaseModel):
    """
    Speaker response schema.
    """

    id: int

    first_name: str
    last_name: str
    email: EmailStr

    phone: str | None
    organization: str | None
    designation: str | None

    experience: int | None
    expertise: str | None
    speaker_type: str | None

    bio: str | None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )