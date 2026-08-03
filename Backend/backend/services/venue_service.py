from sqlalchemy.orm import Session

from backend.crud.venue import (
    create_venue,
    get_venues,
    get_venue_by_id,
    update_venue,
    delete_venue,
)
from backend.models.venue import Venue
from backend.schemas.venue import (
    VenueCreate,
    VenueUpdate,
)


def create_new_venue(
    db: Session,
    venue: VenueCreate,
) -> Venue:
    """
    Create a new venue.
    """

    if venue.capacity <= 0:
        raise ValueError(
            "Venue capacity must be greater than zero."
        )

    return create_venue(
        db=db,
        venue=venue,
    )


def get_all_venues(
    db: Session,
) -> list[Venue]:
    """
    Return all venues.
    """
    return get_venues(db)


def get_venue(
    db: Session,
    venue_id: int,
) -> Venue:
    """
    Return a venue by ID.
    """

    db_venue = get_venue_by_id(
        db,
        venue_id,
    )

    if db_venue is None:
        raise ValueError(
            "Venue not found."
        )

    return db_venue

def update_existing_venue(
    db: Session,
    venue_id: int,
    venue: VenueUpdate,
) -> Venue:
    """
    Update an existing venue.
    """

    # -----------------------------
    # Venue Validation
    # -----------------------------
    db_venue = get_venue_by_id(
        db,
        venue_id,
    )

    if db_venue is None:
        raise ValueError(
            "Venue not found."
        )

    # -----------------------------
    # Capacity Validation
    # -----------------------------
    if (
        venue.capacity is not None
        and venue.capacity <= 0
    ):
        raise ValueError(
            "Venue capacity must be greater than zero."
        )

    # -----------------------------
    # Update Venue
    # -----------------------------
    return update_venue(
        db=db,
        db_venue=db_venue,
        venue=venue,
    )

def delete_existing_venue(
    db: Session,
    venue_id: int,
) -> None:
    """
    Delete an existing venue.
    """

    venue = get_venue_by_id(
        db,
        venue_id,
    )

    if venue is None:
        raise ValueError(
            "Venue not found."
        )

    delete_venue(
        db=db,
        venue=venue,
    )