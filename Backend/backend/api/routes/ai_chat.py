from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from backend.services.chat_service import (
    generate_event_chat_response,
)

router = APIRouter(
    prefix="/ai/chat",
    tags=["AI Chat Assistant"],
)


@router.post(
    "/",
    response_model=ChatResponse,
)
def ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    AI Chat Assistant.
    """

    try:

        answer = generate_event_chat_response(
            db=db,
            event_id=request.event_id,
            question=request.question,
        )

        return {
            "answer": answer,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )