from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.dependencies.auth import get_current_user

from fastapi.responses import FileResponse

from backend.dependencies.role import require_admin_or_organizer
from backend.services.ticket_pdf_service import generate_ticket_pdf

from backend.crud.registration import (
    get_registration_by_id,
    get_all_registrations,
)
from backend.crud.user import get_user_by_id
from backend.crud.event import get_event_by_id
from backend.crud.ticket import get_ticket_by_id

from backend.schemas.registration import (
    RegistrationCreate,
    RegistrationResponse,
    AttendeeResponse,
    AdminAttendeeCreate,
)

from backend.services.registration_service import (
    register_for_event,
    get_my_registrations,
    cancel_my_registration,
    get_all_attendee_details,
    register_attendee_by_admin,
)

router = APIRouter(
    prefix="/registrations",
    tags=["Registrations"],
)


@router.post(
    "/",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_registration(
    registration: RegistrationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Register a user for an event.
    """

    try:
        return register_for_event(
            db=db,
            registration=registration,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.get(
    "/my",
    response_model=list[RegistrationResponse],
)
def my_registrations(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Get all registrations of the logged-in user.
    """
    return get_my_registrations(
        db=db,
        user_id=current_user.id,
    )

@router.delete(
    "/{registration_id}",
    response_model=RegistrationResponse,
)
def cancel_registration_route(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Cancel a registration.
    """
    try:
        return cancel_my_registration(
            db=db,
            registration_id=registration_id,
            user_id=current_user.id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[RegistrationResponse],
)
def all_registrations(
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_organizer),
):
    """
    Get all event registrations.
    Admin / organizer only.
    """

    return get_all_registrations(db)


@router.get(
    "/attendees",
    response_model=list[AttendeeResponse],
)
def get_attendees(
    db: Session = Depends(get_db),
    current_user=Depends(
        require_admin_or_organizer
    ),
):
    """
    Get detailed attendee list.

    Admin / organizer only.
    """

    return get_all_attendee_details(
        db=db
    )


@router.post(
    "/admin-attendee",
    response_model=RegistrationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_attendee_by_admin(
    attendee: AdminAttendeeCreate,
    db: Session = Depends(get_db),
    current_user=Depends(
        require_admin_or_organizer
    ),
):
    """
    Register an attendee from the
    admin/organizer attendee dashboard.
    """

    try:

        return register_attendee_by_admin(

            db=db,

            attendee=attendee,

            admin_user_id=current_user.id,
        )


    except ValueError as e:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.get("/{registration_id}/download")
def download_ticket(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):

    registration = get_registration_by_id(
        db,
        registration_id
    )

    if registration is None:
        raise HTTPException(
            status_code=404,
            detail="Registration not found."
        )

    if registration.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Unauthorized."
        )

    user = get_user_by_id(
        db,
        current_user.id
    )

    event = get_event_by_id(
        db,
        registration.event_id
    )

    ticket = get_ticket_by_id(
        db,
        registration.ticket_id
    )

    pdf = generate_ticket_pdf(
        registration,
        event,
        user,
        ticket
    )

    return FileResponse(

        path=f"uploads/tickets/{pdf}",

        media_type="application/pdf",

        filename=pdf

    )