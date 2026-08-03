from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class SponsorCreate(BaseModel):
    """
    Schema for creating a sponsor.
    """

    sponsor_name: str
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    sponsorship_level: str
    contribution: Decimal
    logo: str | None = None


class SponsorUpdate(BaseModel):
    """
    Schema for updating a sponsor.
    """

    sponsor_name: str | None = None
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    sponsorship_level: str | None = None
    contribution: Decimal | None = None
    logo: str | None = None


class SponsorResponse(BaseModel):
    """
    Sponsor response schema.
    """

    id: int
    sponsor_name: str
    contact_person: str | None
    email: str | None
    phone: str | None
    sponsorship_level: str
    contribution: Decimal
    logo: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )