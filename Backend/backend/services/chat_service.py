from sqlalchemy.orm import Session

from backend.ai.chat_assistant import (
    generate_chat_response,
)

from backend.ai.analytics_context import (
    build_analytics_context,
)

from backend.ai.platform_context import (
    build_platform_context,
)

from backend.ai.user_context import (
    build_user_context,
)


def generate_event_chat_response(
    db: Session,
    question: str,
    event_id: int | None = None,
    user_id: int | None = None,
    use_user_context: bool = False,
) -> str:
    """
    Generate EventAI chatbot response.

    Admin/platform:
        Full platform context.

    Normal user:
        User-safe personal context.

    Event-specific:
        Event analytics context.
    """

    # ==========================================
    # NORMAL USER CONTEXT
    # ==========================================

    if use_user_context:

        if user_id is None:
            raise ValueError(
                "Authenticated user is required."
            )

        context = build_user_context(
            db=db,
            user_id=user_id,
        )

    # ==========================================
    # EVENT-SPECIFIC ADMIN CONTEXT
    # ==========================================

    elif event_id is not None:

        context = build_analytics_context(
            db=db,
            event_id=event_id,
        )

    # ==========================================
    # PLATFORM ADMIN CONTEXT
    # ==========================================

    else:

        context = build_platform_context(
            db=db,
        )

    return generate_chat_response(
        context=context,
        question=question,
    )