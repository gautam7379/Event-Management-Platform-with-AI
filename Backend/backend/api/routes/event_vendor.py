from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)

from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.event_vendor import (
    EventVendorCreate,
    EventVendorResponse,
)

from backend.services.event_vendor_service import (
    assign_vendor_to_event,
    get_all_event_vendor_assignments,
    get_vendor_assignments_for_event,
    get_event_assignments_for_vendor,
    remove_vendor_from_event,
)


router = APIRouter(
    prefix="/event-vendors",
    tags=["Event Vendors"],
)


@router.post(
    "/",
    response_model=EventVendorResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assignment(
    data: EventVendorCreate,
    db: Session = Depends(get_db),
):
    try:
        return assign_vendor_to_event(
            db=db,
            event_id=data.event_id,
            vendor_id=data.vendor_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[EventVendorResponse],
)
def read_assignments(
    db: Session = Depends(get_db),
):
    return get_all_event_vendor_assignments(
        db=db
    )


@router.get(
    "/event/{event_id}",
    response_model=list[EventVendorResponse],
)
def read_event_vendors(
    event_id: int,
    db: Session = Depends(get_db),
):
    return get_vendor_assignments_for_event(
        db=db,
        event_id=event_id,
    )


@router.get(
    "/vendor/{vendor_id}",
    response_model=list[EventVendorResponse],
)
def read_vendor_events(
    vendor_id: int,
    db: Session = Depends(get_db),
):
    return get_event_assignments_for_vendor(
        db=db,
        vendor_id=vendor_id,
    )


@router.delete(
    "/{assignment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
):
    try:
        remove_vendor_from_event(
            db=db,
            assignment_id=assignment_id,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )