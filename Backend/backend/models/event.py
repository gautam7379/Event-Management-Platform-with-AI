from sqlalchemy import Date, ForeignKey, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date, time
from sqlalchemy import CheckConstraint
from backend.database.database import Base
from backend.models.base import TimestampMixin


class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    organizer_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    venue_id: Mapped[int] = mapped_column(
        ForeignKey("venues.id"),
        nullable=False
    )

    event_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    event_type: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    agenda: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    start_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    end_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    capacity: Mapped[int] = mapped_column(
        nullable=False
    )

    banner_image: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="Draft",
        nullable=False
    )

    organizer = relationship(
        "User",
        back_populates="events"
    )

    venue = relationship(
        "Venue",
        back_populates="events"
    )

    event_speakers = relationship(
        "EventSpeaker",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    event_sponsors = relationship(
        "EventSponsor",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    sessions = relationship(
        "Session",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    event_vendors = relationship(
        "EventVendor",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    tickets = relationship(
        "Ticket",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    feedbacks = relationship(
        "Feedback",
        back_populates="event",
        cascade="all, delete-orphan",
    )

    registrations = relationship(
            "Registration",
            back_populates="event",
        )

    CheckConstraint(
        "capacity > 0",
        name="ck_event_capacity_positive",
    ),
 
    def __repr__(self):
        return (
            f"<Event(id={self.id}, event_name='{self.event_name}')>"
        )