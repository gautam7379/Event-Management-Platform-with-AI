from datetime import time

from sqlalchemy import ForeignKey, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin
from sqlalchemy import CheckConstraint


class Session(Base, TimestampMixin):
    __tablename__ = "sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False
    )

    speaker_id: Mapped[int] = mapped_column(
        ForeignKey("speakers.id"),
        nullable=False
    )

    session_title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    room_number: Mapped[str] = mapped_column(
        String(50),
        nullable=True
    )

    start_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    end_time: Mapped[time] = mapped_column(
        Time,
        nullable=False
    )

    event = relationship(
        "Event",
        back_populates="sessions"
    )

    speaker = relationship(
        "Speaker",
        back_populates="sessions"
    )

    __table_args__ = (
        CheckConstraint(
            "start_time < end_time",
            name="ck_session_time_order",
        ),
    )
    
    def __repr__(self):
        return (
            f"<Session(id={self.id}, session_title='{self.session_title}')>"
        )