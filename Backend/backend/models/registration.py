from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Registration(Base, TimestampMixin):
    __tablename__ = "registrations"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "event_id",
            name="uq_user_event_registration",
        ),
        CheckConstraint(
            "status IN ('Pending', 'Confirmed', 'Cancelled', 'Transferred')",
            name="ck_registration_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
        index=True,
    )

    ticket_id: Mapped[int | None] = mapped_column(
       ForeignKey("tickets.id"),
       nullable=True,
   )

    registration_number: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        index=True,
        nullable=True,
   )

    registration_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="Pending",
        nullable=False,
    )

    qr_code: Mapped[str] = mapped_column(
        String(255),
        nullable=True,
    )

    transfer_to_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True,
    )

    user = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="registrations",
    )

    transfer_user = relationship(
        "User",
        foreign_keys=[transfer_to_user_id],
    )

    event = relationship(
        "Event",
        back_populates="registrations",
    )

    ticket = relationship(
        "Ticket",
        back_populates="registrations",
    )

    payment = relationship(
        "Payment",
        back_populates="registration",
        uselist=False,
    )

    check_in = relationship(
        "CheckIn",
        back_populates="registration",
        uselist=False,
    )

    feedback = relationship(
        "Feedback",
        back_populates="registration",
        uselist=False,
    )

    def __repr__(self):
        return (
            f"<Registration("
            f"registration_number='{self.registration_number}', "
            f"status='{self.status}')>"
        )