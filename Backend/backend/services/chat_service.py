from sqlalchemy.orm import Session

from backend.ai.chat_assistant import (
    generate_chat_response,
)

from backend.ai.analytics_context import (
    build_analytics_context,
)


def generate_event_chat_response(
    db: Session,
    event_id: int,
    question: str,
) -> str:
    """
    Generate AI chat response using event analytics.
    """

    # Build analytics context
    context = build_analytics_context(
        db=db,
        event_id=event_id,
    )

    # Generate AI response
    response = generate_chat_response(
        context=context,
        question=question,
    )

    return response