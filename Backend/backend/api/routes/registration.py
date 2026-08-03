from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.dependencies.auth import get_current_user

from backend.schemas.registration import (
    RegistrationCreate,
    RegistrationResponse,
)

from backend.services.registration_service import (
    register_for_event,
    get_my_registrations,
    cancel_my_registration,
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