from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.dependencies.role import require_admin

from backend.schemas.venue import (
    VenueCreate,
    VenueResponse,
    VenueUpdate,
)

from backend.services.venue_service import (
    create_new_venue,
    get_all_venues,
    get_venue,
    update_existing_venue,
    delete_existing_venue,
)
router = APIRouter(
    prefix="/venues",
    tags=["Venues"],
)


@router.post(
    "/",
    response_model=VenueResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_venue(
    venue: VenueCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Create a new venue.
    """
    try:
        return create_new_venue(
            db=db,
            venue=venue,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[VenueResponse],
)
def read_venues(
    db: Session = Depends(get_db),
):
    """
    Get all venues.
    """
    return get_all_venues(db)


@router.get(
    "/{venue_id}",
    response_model=VenueResponse,
)
def read_venue(
    venue_id: int,
    db: Session = Depends(get_db),
):
    """
    Get venue by ID.
    """
    try:
        return get_venue(
            db=db,
            venue_id=venue_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

@router.put(
    "/{venue_id}",
    response_model=VenueResponse,
)
def update_venue_route(
    venue_id: int,
    venue: VenueUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Update an existing venue.
    """
    try:
        return update_existing_venue(
            db=db,
            venue_id=venue_id,
            venue=venue,
        )

    except ValueError as e:
        message = str(e)

        if message == "Venue not found.":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )

@router.delete(
    "/{venue_id}",
    status_code=status.HTTP_200_OK,
)
def delete_venue_route(
    venue_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin),
):
    """
    Delete an existing venue.
    """
    try:
        delete_existing_venue(
            db=db,
            venue_id=venue_id,
        )

        return {
            "message": "Venue deleted successfully."
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )