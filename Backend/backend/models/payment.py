from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Numeric,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Payment(Base, TimestampMixin):
    __tablename__ = "payments"

    __table_args__ = (
        CheckConstraint(
            "amount >= 0",
            name="ck_payment_amount_positive",
        ),
        CheckConstraint(
            "refund_amount >= 0",
            name="ck_refund_amount_positive",
        ),

        CheckConstraint(
            "refund_amount <= amount",
            name="ck_refund_not_greater_than_amount",
        ),
        
        CheckConstraint(
            "payment_status IN ('Pending','Paid','Failed','Refunded')",
            name="ck_payment_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    registration_id: Mapped[int] = mapped_column(
        ForeignKey("registrations.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    transaction_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False,
    )

    payment_method: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    payment_status: Mapped[str] = mapped_column(
        String(20),
        default="Pending",
        nullable=False,
    )

    payment_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    refund_amount: Mapped[float] = mapped_column(
        Numeric(10, 2),
        default=0,
        nullable=False,
    )

    registration = relationship(
        "Registration",
        back_populates="payment",
    )

    def __repr__(self):
        return (
            f"<Payment("
            f"transaction_id='{self.transaction_id}', "
            f"status='{self.payment_status}')>"
        )