import uuid

from sqlalchemy.orm import Session

from backend.crud.payment import (
    create_payment,
    get_payment_by_registration,
)
from backend.crud.registration import (
    get_registration_by_id,
)

from backend.models.payment import Payment
from backend.schemas.payment import PaymentCreate


def create_new_payment(
    db: Session,
    payment: PaymentCreate,
) -> Payment:
    """
    Create a new payment after business validation.
    """

    # -----------------------------
    # Validate Registration
    # -----------------------------
    registration = get_registration_by_id(
        db=db,
        registration_id=payment.registration_id,
    )

    if registration is None:
        raise ValueError(
            "Registration not found."
        )

    # -----------------------------
    # Prevent Duplicate Payment
    # -----------------------------
    existing_payment = get_payment_by_registration(
        db=db,
        registration_id=payment.registration_id,
    )

    if existing_payment:
        raise ValueError(
            "Payment already exists for this registration."
        )

    # -----------------------------
    # Validate Payment Amount
    # -----------------------------
    if payment.amount <= 0:
        raise ValueError(
            "Payment amount must be greater than zero."
        )

    # -----------------------------
    # Generate Transaction ID
    # -----------------------------
    transaction_id = (
        f"TXN-{uuid.uuid4().hex[:12].upper()}"
    )

    # -----------------------------
    # Create Payment
    # -----------------------------
    return create_payment(
        db=db,
        payment=payment,
        transaction_id=transaction_id,
    )