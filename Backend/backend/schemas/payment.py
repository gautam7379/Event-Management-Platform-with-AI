from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PaymentCreate(BaseModel):
    """
    Schema for creating a payment.
    """

    registration_id: int
    amount: float
    payment_method: str
    payment_status: str = "Pending"


class PaymentResponse(BaseModel):
    """
    Payment response schema.
    """

    id: int
    registration_id: int
    transaction_id: str
    amount: float
    payment_method: str
    payment_status: str
    payment_date: datetime
    refund_amount: float

    model_config = ConfigDict(
        from_attributes=True
    )