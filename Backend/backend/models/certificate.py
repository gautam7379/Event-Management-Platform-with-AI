from datetime import datetime

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Certificate(Base, TimestampMixin):
    __tablename__ = "certificates"

    __table_args__ = (
        CheckConstraint(
            "certificate_number <> ''",
            name="ck_certificate_number_not_empty",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True,
    )

    registration_id: Mapped[int] = mapped_column(
        ForeignKey("registrations.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    certificate_number: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    certificate_url: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    issued_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    registration = relationship(
        "Registration",
        back_populates="certificate",
    )

    def __repr__(self):
        return (
            f"<Certificate("
            f"certificate_number='{self.certificate_number}')>"
        )