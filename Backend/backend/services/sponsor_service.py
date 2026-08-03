from sqlalchemy.orm import Session

from backend.crud.sponsor import (
    create_sponsor,
    delete_sponsor,
    get_all_sponsors,
    get_sponsor_by_id,
    update_sponsor,
)
from backend.models.sponsor import Sponsor
from backend.schemas.sponsor import (
    SponsorCreate,
    SponsorUpdate,
)


def create_new_sponsor(
    db: Session,
    sponsor: SponsorCreate,
) -> Sponsor:
    """
    Create a new sponsor.
    """

    return create_sponsor(
        db=db,
        sponsor=sponsor,
    )


def get_sponsor(
    db: Session,
    sponsor_id: int,
) -> Sponsor:
    """
    Get sponsor by ID.
    """

    db_sponsor = get_sponsor_by_id(
        db=db,
        sponsor_id=sponsor_id,
    )

    if db_sponsor is None:
        raise ValueError(
            "Sponsor not found."
        )

    return db_sponsor


def get_sponsors(
    db: Session,
) -> list[Sponsor]:
    """
    Get all sponsors.
    """

    return get_all_sponsors(db=db)


def update_existing_sponsor(
    db: Session,
    sponsor_id: int,
    sponsor: SponsorUpdate,
) -> Sponsor:
    """
    Update an existing sponsor.
    """

    db_sponsor = get_sponsor_by_id(
        db=db,
        sponsor_id=sponsor_id,
    )

    if db_sponsor is None:
        raise ValueError(
            "Sponsor not found."
        )

    return update_sponsor(
        db=db,
        db_sponsor=db_sponsor,
        sponsor=sponsor,
    )


def delete_existing_sponsor(
    db: Session,
    sponsor_id: int,
) -> None:
    """
    Delete an existing sponsor.
    """

    db_sponsor = get_sponsor_by_id(
        db=db,
        sponsor_id=sponsor_id,
    )

    if db_sponsor is None:
        raise ValueError(
            "Sponsor not found."
        )

    delete_sponsor(
        db=db,
        db_sponsor=db_sponsor,
    )