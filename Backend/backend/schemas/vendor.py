from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class VendorCreate(BaseModel):
    """
    Schema for creating a vendor.
    """

    vendor_name: str
    vendor_type: str
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    service_description: str | None = None
    cost: Decimal
    status: str = "Active"


class VendorUpdate(BaseModel):
    """
    Schema for updating a vendor.
    """

    vendor_name: str | None = None
    vendor_type: str | None = None
    contact_person: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None
    service_description: str | None = None
    cost: Decimal | None = None
    status: str | None = None


class VendorResponse(BaseModel):
    """
    Vendor response schema.
    """

    id: int
    vendor_name: str
    vendor_type: str
    contact_person: str | None
    email: str | None
    phone: str | None
    address: str | None
    service_description: str | None
    cost: Decimal
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )