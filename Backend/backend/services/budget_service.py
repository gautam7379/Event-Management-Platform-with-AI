from sqlalchemy.orm import Session

from backend.ai.analytics_context import (
    build_analytics_context,
)

from backend.ai.budget_advisor import (
    generate_budget_advice,
)


def generate_event_budget_analysis(
    db: Session,
    event_id: int,
    prompt: str,
) -> str:
    """
    Generate AI-powered budget analysis for an event.
    """

    # Build analytics context
    context = build_analytics_context(
        db=db,
        event_id=event_id,
    )

    # Generate budget advice
    analysis = generate_budget_advice(
        context=context,
        prompt=prompt,
    )

    return analysis