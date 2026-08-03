from sqlalchemy import Numeric, String, CheckConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Sponsor(Base, TimestampMixin):
    __tablename__ = "sponsors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    sponsor_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    contact_person: Mapped[str] = mapped_column(
        String(100),
        nullable=True
    )

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=True
    )

    sponsorship_level: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    contribution: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    logo: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    event_sponsors = relationship(
        "EventSponsor",
        back_populates="sponsor"
    )

    __table_args__ = (
        CheckConstraint(
            "contribution >= 0",
            name="ck_sponsor_contribution_positive",
        ),
        CheckConstraint(
            "sponsor_name <> ''",
             name="ck_sponsor_name_not_empty",
        ),
)

    def __repr__(self):
        return (
            f"<Sponsor(id={self.id}, sponsor_name='{self.sponsor_name}')>"
        )