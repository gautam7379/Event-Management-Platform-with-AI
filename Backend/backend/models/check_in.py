from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class CheckIn(Base, TimestampMixin):
    __tablename__ = "check_ins"

    __table_args__ = (
        CheckConstraint(
            "attendance_status IN ('Checked-In', 'No-Show')",
            name="ck_attendance_status",
        ),
        CheckConstraint(
            "entry_gate <> ''",
            name="ck_entry_gate_not_empty",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    registration_id: Mapped[int] = mapped_column(
        ForeignKey("registrations.id"),
        unique=True,
        nullable=False,
        index=True,
    )

    checked_in_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        index=True,
    )

    check_in_time: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )

    entry_gate: Mapped[str] = mapped_column(
        String(50),
        nullable=True,
    )

    badge_printed: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    attendance_status: Mapped[str] = mapped_column(
        String(20),
        default="Checked-In",
        nullable=False,
    )

    registration = relationship(
        "Registration",
        back_populates="check_in",
    )

    staff = relationship(
        "User",
        foreign_keys=[checked_in_by],
    )

    def __repr__(self):
        return (
            f"<CheckIn("
            f"registration_id={self.registration_id}, "
            f"status='{self.attendance_status}')>"
        )