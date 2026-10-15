from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.dependencies.auth import (
    get_current_user,
)

from backend.schemas.chat import (
    ChatRequest,
    ChatResponse,
)

from backend.ai.user_agent import (
    generate_user_agent_response,
)

from backend.services.chat_service import (
    generate_event_chat_response,
)

router = APIRouter(
    prefix="/ai/chat",
    tags=["AI Chat Assistant"],
)


# ==========================================
# ADMIN / PLATFORM AI CHAT
# ==========================================

@router.post(
    "/",
    response_model=ChatResponse,
)
def ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    """
    Existing EventAI admin/platform chatbot.

    event_id provided:
        Event-specific analytics.

    event_id None:
        Platform-wide analytics.

    IMPORTANT:
    This endpoint is kept unchanged so the
    existing admin chatbot continues working.
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

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ==========================================
# NORMAL USER AI CHAT
# ==========================================

@router.post(
    "/user",
    response_model=ChatResponse,
)
def user_ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Authenticated normal-user AI assistant.

    The current user is taken from the JWT.

    The frontend must NOT send a user_id.

    The AI receives only:
    - available events
    - current user's registrations
    - current user's tickets
    - current user's payments
    - current user's check-in information
    """

    try:

        answer = generate_user_agent_response(
            db=db,
            question=request.question,
            user_id=current_user.id,
        )

        return {
            "answer": answer,
        }

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )