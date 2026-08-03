from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class EventVendor(Base, TimestampMixin):
    __tablename__ = "event_vendors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False
    )

    vendor_id: Mapped[int] = mapped_column(
        ForeignKey("vendors.id"),
        nullable=False
    )

    event = relationship(
        "Event",
        back_populates="event_vendors"
    )

    vendor = relationship(
        "Vendor",
        back_populates="event_vendors"
    )

    def __repr__(self):
        return (
            f"<EventVendor(event_id={self.event_id}, "
            f"vendor_id={self.vendor_id})>"
        )