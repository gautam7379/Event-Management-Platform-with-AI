from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class Role(Base, TimestampMixin):
    __tablename__ = "roles"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    role_name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    users = relationship(
        "User",
        back_populates="role"
    )

    def __repr__(self):
        return f"<Role(id={self.id}, role_name='{self.role_name}')>"