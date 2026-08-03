from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.session import (
    SessionCreate,
    SessionResponse,
    SessionUpdate,
)
from backend.services.session_service import (
    create_new_session,
    delete_existing_session,
    get_session,
    get_sessions,
    update_existing_session,
)

router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"],
)


@router.post(
    "/",
    response_model=SessionResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_session(
    session: SessionCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new session.
    """

    try:
        return create_new_session(
            db=db,
            session=session,
        )

    except ValueError as e:
        message = str(e)

        if message in (
            "Event not found.",
            "Speaker not found.",
            "Start time must be earlier than end time.",
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=message,
        )


@router.get(
    "/",
    response_model=list[SessionResponse],
)
def read_sessions(
    db: Session = Depends(get_db),
):
    """
    Get all sessions.
    """

    return get_sessions(db=db)


@router.get(
    "/{session_id}",
    response_model=SessionResponse,
)
def read_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    """
    Get session by ID.
    """

    try:
        return get_session(
            db=db,
            session_id=session_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{session_id}",
    response_model=SessionResponse,
)
def update_session(
    session_id: int,
    session: SessionUpdate,
    db: Session = Depends(get_db),
):
    """
    Update session.
    """

    try:
        return update_existing_session(
            db=db,
            session_id=session_id,
            session=session,
        )

    except ValueError as e:
        message = str(e)

        if message == "Session not found.":
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message,
        )


@router.delete(
    "/{session_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete session.
    """

    try:
        delete_existing_session(
            db=db,
            session_id=session_id,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )