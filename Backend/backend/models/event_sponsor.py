from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class EventSponsor(Base, TimestampMixin):
    __tablename__ = "event_sponsors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False
    )

    sponsor_id: Mapped[int] = mapped_column(
        ForeignKey("sponsors.id"),
        nullable=False
    )

    event = relationship(
        "Event",
        back_populates="event_sponsors"
    )

    sponsor = relationship(
        "Sponsor",
        back_populates="event_sponsors"
    )

    def __repr__(self):
        return (
            f"<EventSponsor(event_id={self.event_id}, "
            f"sponsor_id={self.sponsor_id})>"
        )