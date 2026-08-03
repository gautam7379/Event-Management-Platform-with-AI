from sqlalchemy.orm import Session

from backend.models.vendor import Vendor
from backend.schemas.vendor import (
    VendorCreate,
    VendorUpdate,
)


def create_vendor(
    db: Session,
    vendor: VendorCreate,
) -> Vendor:
    """
    Create a new vendor.
    """

    db_vendor = Vendor(
        vendor_name=vendor.vendor_name,
        vendor_type=vendor.vendor_type,
        contact_person=vendor.contact_person,
        email=vendor.email,
        phone=vendor.phone,
        address=vendor.address,
        service_description=vendor.service_description,
        cost=vendor.cost,
        status=vendor.status,
    )

    db.add(db_vendor)
    db.commit()
    db.refresh(db_vendor)

    return db_vendor


def get_vendor_by_id(
    db: Session,
    vendor_id: int,
) -> Vendor | None:
    """
    Get vendor by ID.
    """

    return (
        db.query(Vendor)
        .filter(Vendor.id == vendor_id)
        .first()
    )


def get_all_vendors(
    db: Session,
) -> list[Vendor]:
    """
    Get all vendors.
    """

    return (
        db.query(Vendor)
        .order_by(Vendor.id)
        .all()
    )


def update_vendor(
    db: Session,
    db_vendor: Vendor,
    vendor: VendorUpdate,
) -> Vendor:
    """
    Update an existing vendor.
    """

    update_data = vendor.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(db_vendor, key, value)

    db.commit()
    db.refresh(db_vendor)

    return db_vendor


def delete_vendor(
    db: Session,
    db_vendor: Vendor,
) -> None:
    """
    Delete an existing vendor.
    """

    db.delete(db_vendor)
    db.commit()