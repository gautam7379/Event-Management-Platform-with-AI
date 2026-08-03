from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin
from sqlalchemy import (
    CheckConstraint,
    String,
)

class Venue(Base, TimestampMixin):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    venue_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    address: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    postal_code: Mapped[str] = mapped_column(
        String(20),
        nullable=True
    )

    capacity: Mapped[int] = mapped_column(
        nullable=False
    )

    contact_person: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=True
    )

    events = relationship(
        "Event",
        back_populates="venue"
    )

    

    def __repr__(self):
        return (
            f"<Venue(id={self.id}, venue_name='{self.venue_name}')>"
        )