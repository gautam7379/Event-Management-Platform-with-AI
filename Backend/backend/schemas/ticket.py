from datetime import date

from pydantic import BaseModel, ConfigDict


class TicketCreate(BaseModel):
    """
    Schema for creating a ticket category.
    """

    event_id: int
    ticket_category: str
    price: float
    quantity: int
    qr_enabled: bool = True
    sale_start_date: date
    sale_end_date: date
    status: str = "Active"


class TicketResponse(BaseModel):
    """
    Ticket response schema.
    """

    id: int
    event_id: int
    ticket_category: str
    price: float
    quantity: int
    qr_enabled: bool
    sale_start_date: date
    sale_end_date: date
    status: str

    model_config = ConfigDict(
        from_attributes=True
    )