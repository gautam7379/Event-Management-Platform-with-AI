from sqlalchemy import String,  CheckConstraint,Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Speaker(Base, TimestampMixin):
    __tablename__ = "speakers"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=True
    )

    organization: Mapped[str] = mapped_column(
        String(150),
        nullable=True
    )

    designation: Mapped[str] = mapped_column(
        String(150),
        nullable=True
    )

    bio: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    profile_image: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    event_speakers = relationship(
        "EventSpeaker",
        back_populates="speaker"
    )

    sessions = relationship(
        "Session",
        back_populates="speaker"
    )

    __table_args__ = (
            CheckConstraint("first_name <> ''", name="ck_speaker_first_name_not_empty"),
            CheckConstraint("last_name <> ''", name="ck_speaker_last_name_not_empty"),
            CheckConstraint("email <> ''", name="ck_speaker_email_not_empty"),
        )

    def __repr__(self):
        return (
            f"<Speaker(id={self.id}, email='{self.email}')>"
        )