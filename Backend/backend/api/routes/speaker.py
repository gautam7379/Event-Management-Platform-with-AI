from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Response,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.speaker import (
    SpeakerCreate,
    SpeakerResponse,
    SpeakerUpdate,
)
from backend.services.speaker_service import (
    create_new_speaker,
    delete_existing_speaker,
    get_speaker,
    get_speakers,
    update_existing_speaker,
)

router = APIRouter(
    prefix="/speakers",
    tags=["Speakers"],
)


@router.post(
    "/",
    response_model=SpeakerResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_speaker(
    speaker: SpeakerCreate,
    db: Session = Depends(get_db),
):
    """
    Create a new speaker.
    """

    try:
        return create_new_speaker(
            db=db,
            speaker=speaker,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[SpeakerResponse],
)
def read_speakers(
    db: Session = Depends(get_db),
):
    """
    Get all speakers.
    """

    return get_speakers(db=db)


@router.get(
    "/{speaker_id}",
    response_model=SpeakerResponse,
)
def read_speaker(
    speaker_id: int,
    db: Session = Depends(get_db),
):
    """
    Get speaker by ID.
    """

    try:
        return get_speaker(
            db=db,
            speaker_id=speaker_id,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{speaker_id}",
    response_model=SpeakerResponse,
)
def update_speaker(
    speaker_id: int,
    speaker: SpeakerUpdate,
    db: Session = Depends(get_db),
):
    """
    Update speaker.
    """

    try:
        return update_existing_speaker(
            db=db,
            speaker_id=speaker_id,
            speaker=speaker,
        )

    except ValueError as e:
        message = str(e)

        if "already exists" in message:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message,
            )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=message,
        )


@router.delete(
    "/{speaker_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_speaker(
    speaker_id: int,
    db: Session = Depends(get_db),
):
    """
    Delete speaker.
    """

    try:
        delete_existing_speaker(
            db=db,
            speaker_id=speaker_id,
        )

        return Response(
            status_code=status.HTTP_204_NO_CONTENT,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )