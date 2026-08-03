from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class EventSpeaker(Base, TimestampMixin):
    __tablename__ = "event_speakers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False
    )

    speaker_id: Mapped[int] = mapped_column(
        ForeignKey("speakers.id"),
        nullable=False
    )

    event = relationship(
        "Event",
        back_populates="event_speakers"
    )

    speaker = relationship(
        "Speaker",
        back_populates="event_speakers"
    )

    def __repr__(self):
        return (
            f"<EventSpeaker(event_id={self.event_id}, "
            f"speaker_id={self.speaker_id})>"
        )