from sqlalchemy.orm import Session

from backend.models.payment import Payment
from backend.models.registration import Registration
from backend.schemas.payment import PaymentCreate


def create_payment(
    db: Session,
    payment: PaymentCreate,
    transaction_id: str,
) -> Payment:
    """
    Create a new payment.
    """

    db_payment = Payment(
        registration_id=payment.registration_id,
        transaction_id=transaction_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        payment_status=payment.payment_status,
    )

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return db_payment


def get_payment_by_id(
    db: Session,
    payment_id: int,
) -> Payment | None:
    """
    Get payment by ID.
    """

    return (
        db.query(Payment)
        .filter(Payment.id == payment_id)
        .first()
    )


def get_payment_by_registration(
    db: Session,
    registration_id: int,
) -> Payment | None:
    """
    Get payment by registration ID.
    """

    return (
        db.query(Payment)
        .filter(
            Payment.registration_id == registration_id
        )
        .first()
    )


def get_payments_by_user(
    db: Session,
    user_id: int,
) -> list[Payment]:
    """
    Get all payments made by a user.
    """

    return (
        db.query(Payment)
        .join(
            Registration,
            Payment.registration_id == Registration.id,
        )
        .filter(
            Registration.user_id == user_id
        )
        .order_by(
            Payment.id
        )
        .all()
    )


def update_payment_status(
    db: Session,
    payment: Payment,
    status: str,
) -> Payment:
    """
    Update payment status.
    """

    payment.payment_status = status

    db.commit()
    db.refresh(payment)

    return payment