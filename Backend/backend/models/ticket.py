from datetime import date

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Date,
    ForeignKey,
    Numeric,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Ticket(Base, TimestampMixin):
    __tablename__ = "tickets"

    __table_args__ = (
        UniqueConstraint(
            "event_id",
            "ticket_category",
            name="uq_event_ticket_category"
        ),
        CheckConstraint(
            "price >= 0",
            name="ck_ticket_price_positive"
        ),
        CheckConstraint(
            "quantity >= 0",
            name="ck_ticket_quantity_positive"
        ),
        CheckConstraint(
        "sale_start_date <= sale_end_date",
        name="ck_ticket_sale_dates",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
        index=True
    )

    ticket_category: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    price: Mapped[float] = mapped_column(
        Numeric(10, 2),
        nullable=False
    )

    quantity: Mapped[int] = mapped_column(
        nullable=False
    )

    qr_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    sale_start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    sale_end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="Active"
    )

    event = relationship(
        "Event",
        back_populates="tickets"
    )

    registrations = relationship(
        "Registration",
        back_populates="ticket"
    )

    
    def __repr__(self):
        return (
            f"<Ticket(id={self.id}, "
            f"category='{self.ticket_category}')>"
        )