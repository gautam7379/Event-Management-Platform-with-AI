from pydantic import BaseModel, Field


class VenueCreate(BaseModel):
    venue_name: str = Field(..., max_length=255)
    address: str
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=100)
    country: str = Field(..., max_length=100)
    postal_code: str = Field(..., max_length=20)
    capacity: int = Field(..., gt=0)
    contact_person: str = Field(..., max_length=100)
    phone: str = Field(..., max_length=20)


class VenueResponse(BaseModel):
    id: int
    venue_name: str
    address: str
    city: str
    state: str
    country: str
    postal_code: str
    capacity: int
    contact_person: str
    phone: str

    model_config = {
        "from_attributes": True
    }


class VenueUpdate(BaseModel):
    venue_name: str | None = Field(None, max_length=255)
    address: str | None = None
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    country: str | None = Field(None, max_length=100)
    postal_code: str | None = Field(None, max_length=20)
    capacity: int | None = Field(None, gt=0)
    contact_person: str | None = Field(None, max_length=100)
    phone: str | None = Field(None, max_length=20)