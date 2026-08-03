from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.sponsor import (
    SponsorCreate,
    SponsorResponse,
    SponsorUpdate,
)
from backend.services.sponsor_service import (
    create_new_sponsor,
    delete_existing_sponsor,
    get_sponsor,
    get_sponsors,
    update_existing_sponsor,
)

router = APIRouter(
    prefix="/sponsors",
    tags=["Sponsors"],
)


@router.post(
    "/",
    response_model=SponsorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sponsor(
    sponsor: SponsorCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new sponsor.
    """

    return create_new_sponsor(
        db=db,
        sponsor=sponsor,
    )


@router.get(
    "/",
    response_model=list[SponsorResponse],
)
def read_sponsors(
    db: Session = Depends(get_db),
):
    """
    Get all sponsors.
    """

    return get_sponsors(db=db)


@router.get(
    "/{sponsor_id}",
    response_model=SponsorResponse,
)
def read_sponsor(
    sponsor_id: int,
    db: Session = Depends(get_db),
):
    """
    Get sponsor by ID.
    """

    try:
        return get_sponsor(
            db=db,
            sponsor_id=sponsor_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{sponsor_id}",
    response_model=SponsorResponse,
)
def update_sponsor(
    sponsor_id: int,
    sponsor: SponsorUpdate,
    db: Session = Depends(get_db),
):
    """
    Update sponsor.
    """

    try:
        return update_existing_sponsor(
            db=db,
            sponsor_id=sponsor_id,
            sponsor=sponsor,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{sponsor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_sponsor(
    sponsor_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete sponsor.
    """

    try:
        delete_existing_sponsor(
            db=db,
            sponsor_id=sponsor_id,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )