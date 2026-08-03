from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.vendor import (
    VendorCreate,
    VendorResponse,
    VendorUpdate,
)
from backend.services.vendor_service import (
    create_new_vendor,
    delete_existing_vendor,
    get_vendor,
    get_vendors,
    update_existing_vendor,
)

router = APIRouter(
    prefix="/vendors",
    tags=["Vendors"],
)


@router.post(
    "/",
    response_model=VendorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_vendor(
    vendor: VendorCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new vendor.
    """

    return create_new_vendor(
        db=db,
        vendor=vendor,
    )


@router.get(
    "/",
    response_model=list[VendorResponse],
)
def read_vendors(
    db: Session = Depends(get_db),
):
    """
    Get all vendors.
    """

    return get_vendors(db=db)


@router.get(
    "/{vendor_id}",
    response_model=VendorResponse,
)
def read_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
):
    """
    Get vendor by ID.
    """

    try:
        return get_vendor(
            db=db,
            vendor_id=vendor_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{vendor_id}",
    response_model=VendorResponse,
)
def update_vendor(
    vendor_id: int,
    vendor: VendorUpdate,
    db: Session = Depends(get_db),
):
    """
    Update vendor.
    """

    try:
        return update_existing_vendor(
            db=db,
            vendor_id=vendor_id,
            vendor=vendor,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{vendor_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete vendor.
    """

    try:
        delete_existing_vendor(
            db=db,
            vendor_id=vendor_id,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )