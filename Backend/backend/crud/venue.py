from sqlalchemy.orm import Session

from backend.models.venue import Venue
from backend.schemas.venue import (
    VenueCreate,
    VenueUpdate,
)


def create_venue(
    db: Session,
    venue: VenueCreate,
) -> Venue:
    """
    Create a new venue.
    """
    db_venue = Venue(
        venue_name=venue.venue_name,
        address=venue.address,
        city=venue.city,
        state=venue.state,
        country=venue.country,
        postal_code=venue.postal_code,
        capacity=venue.capacity,
        contact_person=venue.contact_person,
        phone=venue.phone,
    )

    db.add(db_venue)
    db.commit()
    db.refresh(db_venue)

    return db_venue


def get_venues(
    db: Session,
) -> list[Venue]:
    """
    Return all venues.
    """
    return db.query(Venue).all()


def get_venue_by_id(
    db: Session,
    venue_id: int,
) -> Venue | None:
    """
    Return a venue by ID.
    """
    return (
        db.query(Venue)
        .filter(Venue.id == venue_id)
        .first()
    )

def update_venue(
    db: Session,
    db_venue: Venue,
    venue: VenueUpdate,
) -> Venue:
    """
    Update an existing venue.
    """

    update_data = venue.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(
            db_venue,
            field,
            value,
        )

    db.commit()
    db.refresh(db_venue)

    return db_venue
def delete_venue(
    db: Session,
    venue: Venue,
) -> None:
    """
    Delete a venue.
    """
    db.delete(venue)
    db.commit()