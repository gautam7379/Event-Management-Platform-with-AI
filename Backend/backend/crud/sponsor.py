from sqlalchemy.orm import Session

from backend.models.sponsor import Sponsor
from backend.schemas.sponsor import (
    SponsorCreate,
    SponsorUpdate,
)


def create_sponsor(
    db: Session,
    sponsor: SponsorCreate,
) -> Sponsor:
    """
    Create a new sponsor.
    """

    db_sponsor = Sponsor(
        sponsor_name=sponsor.sponsor_name,
        contact_person=sponsor.contact_person,
        email=sponsor.email,
        phone=sponsor.phone,
        sponsorship_level=sponsor.sponsorship_level,
        contribution=sponsor.contribution,
        logo=sponsor.logo,
    )

    db.add(db_sponsor)
    db.commit()
    db.refresh(db_sponsor)

    return db_sponsor


def get_sponsor_by_id(
    db: Session,
    sponsor_id: int,
) -> Sponsor | None:
    """
    Get sponsor by ID.
    """

    return (
        db.query(Sponsor)
        .filter(Sponsor.id == sponsor_id)
        .first()
    )


def get_all_sponsors(
    db: Session,
) -> list[Sponsor]:
    """
    Get all sponsors.
    """

    return (
        db.query(Sponsor)
        .order_by(Sponsor.id)
        .all()
    )


def update_sponsor(
    db: Session,
    db_sponsor: Sponsor,
    sponsor: SponsorUpdate,
) -> Sponsor:
    """
    Update an existing sponsor.
    """

    update_data = sponsor.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_sponsor, key, value)

    db.commit()
    db.refresh(db_sponsor)

    return db_sponsor


def delete_sponsor(
    db: Session,
    db_sponsor: Sponsor,
) -> None:
    """
    Delete an existing sponsor.
    """

    db.delete(db_sponsor)
    db.commit()