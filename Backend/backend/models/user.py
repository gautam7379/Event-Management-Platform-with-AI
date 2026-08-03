from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.database.database import Base
from backend.models.base import TimestampMixin


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id"),
        nullable=False
    )

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
        nullable=False,
        index=True
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=True
    )

    profile_image: Mapped[str] = mapped_column(
        String(255),
        nullable=True
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False
    )

    role = relationship(
        "Role",
        back_populates="users"
    )

    events = relationship(
        "Event",
        back_populates="organizer"
    )

    registrations = relationship(
        "Registration",
        foreign_keys="Registration.user_id",
        back_populates="user",
    )

    feedbacks = relationship(
        "Feedback",
        back_populates="user",
    )
    
    def __repr__(self):
        return (
            f"<User(id={self.id}, "
            f"email='{self.email}')>"
        )