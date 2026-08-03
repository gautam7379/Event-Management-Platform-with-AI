from typing import Optional

from sqlalchemy.orm import Session

from backend.ai.context_builder import build_event_context
from backend.ai.llm import llm
from backend.ai.prompt_builder import (
    build_event_planning_prompt,
)


def generate_event_plan(
    user_request: str,
    db: Optional[Session] = None,
    event_id: Optional[int] = None,
) -> str:
    """
    Generate an AI-powered event planning response.
    """

    context = ""

    if db is not None and event_id is not None:
        context = build_event_context(
            db=db,
            event_id=event_id,
        )

    prompt = build_event_planning_prompt(
        f"""
{context}

User Request:
{user_request}
"""
    )

    response = llm.invoke(prompt)

    return response.content