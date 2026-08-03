from typing import Optional

from sqlalchemy.orm import Session

from backend.ai.planner import generate_event_plan


def generate_ai_plan(
    prompt: str,
    db: Optional[Session] = None,
    event_id: Optional[int] = None,
) -> str:
    """
    Generate an AI response for an event planning request.
    """

    prompt = prompt.strip()

    if not prompt:
        raise ValueError(
            "Prompt cannot be empty."
        )

    return generate_event_plan(
        user_request=prompt,
        db=db,
        event_id=event_id,
    )