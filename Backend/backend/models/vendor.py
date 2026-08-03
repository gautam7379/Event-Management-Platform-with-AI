from sqlalchemy import Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin
from sqlalchemy import CheckConstraint

class Vendor(Base, TimestampMixin):
    __tablename__ = "vendors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    vendor_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False
    )

    vendor_type: Mapped[str] = mapped_column(
        String(100),
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

    address: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    service_description: Mapped[str] = mapped_column(
        Text,
        nullable=True
    )

    cost: Mapped[float] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="Active",
        nullable=False
    )

    event_vendors = relationship(
        "EventVendor",
        back_populates="vendor"
    )

    __table_args__ = (
    CheckConstraint(
        "cost >= 0",
        name="ck_vendor_cost_positive",
    ),
    CheckConstraint(
        "vendor_name <> ''",
        name="ck_vendor_name_not_empty",
    ),
)
    def __repr__(self):
        return (
            f"<Vendor(id={self.id}, vendor_name='{self.vendor_name}')>"
        )