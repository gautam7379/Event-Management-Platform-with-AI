from sqlalchemy.orm import Session

from backend.crud.vendor import (
    create_vendor,
    get_all_vendors,
    get_vendor_by_id,
    update_vendor,
    delete_vendor,
)
from backend.models.vendor import Vendor
from backend.schemas.vendor import (
    VendorCreate,
    VendorUpdate,
)


def create_new_vendor(
    db: Session,
    vendor: VendorCreate,
) -> Vendor:
    """
    Create a new vendor.
    """

    return create_vendor(
        db=db,
        vendor=vendor,
    )


def get_vendor(
    db: Session,
    vendor_id: int,
) -> Vendor:
    """
    Get vendor by ID.
    """

    db_vendor = get_vendor_by_id(
        db=db,
        vendor_id=vendor_id,
    )

    if db_vendor is None:
        raise ValueError(
            "Vendor not found."
        )

    return db_vendor


def get_vendors(
    db: Session,
) -> list[Vendor]:
    """
    Get all vendors.
    """

    return get_all_vendors(db=db)


def update_existing_vendor(
    db: Session,
    vendor_id: int,
    vendor: VendorUpdate,
) -> Vendor:
    """
    Update an existing vendor.
    """

    db_vendor = get_vendor_by_id(
        db=db,
        vendor_id=vendor_id,
    )

    if db_vendor is None:
        raise ValueError(
            "Vendor not found."
        )

    return update_vendor(
        db=db,
        db_vendor=db_vendor,
        vendor=vendor,
    )


def delete_existing_vendor(
    db: Session,
    vendor_id: int,
) -> None:
    """
    Delete an existing vendor.
    """

    db_vendor = get_vendor_by_id(
        db=db,
        vendor_id=vendor_id,
    )

    if db_vendor is None:
        raise ValueError(
            "Vendor not found."
        )

    delete_vendor(
        db=db,
        db_vendor=db_vendor,
    )