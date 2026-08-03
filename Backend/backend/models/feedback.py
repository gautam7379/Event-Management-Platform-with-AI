from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Feedback(Base, TimestampMixin):
    __tablename__ = "feedback"

    __table_args__ = (
        CheckConstraint(
            "rating >= 1 AND rating <= 5",
            name="ck_feedback_rating_range",
        ),
        CheckConstraint(
            "sentiment IN ('Positive','Neutral','Negative')",
            name="ck_feedback_sentiment",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    event_id: Mapped[int] = mapped_column(
        ForeignKey("events.id"),
        nullable=False,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    registration_id: Mapped[int] = mapped_column(
        ForeignKey("registrations.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    rating: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    comments: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    sentiment: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    submitted_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    event = relationship(
        "Event",
        back_populates="feedbacks",
    )

    user = relationship(
        "User",
        back_populates="feedbacks",
    )

    registration = relationship(
        "Registration",
        back_populates="feedback",
    )

    def __repr__(self):
        return (
            f"<Feedback("
            f"id={self.id}, "
            f"rating={self.rating}, "
            f"sentiment='{self.sentiment}')>"
        )