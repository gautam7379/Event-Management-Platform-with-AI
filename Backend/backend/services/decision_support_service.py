from sqlalchemy.orm import Session

from backend.ai.decision_advisor import (
    generate_decision_advice,
)

from backend.ai.analytics_context import (
    build_analytics_context,
)

def generate_event_decision_support(
    db: Session,
    event_id: int,
    prompt: str,
) -> str:
    """
    Generate AI Decision Support recommendations.
    """

    # Build analytics context
    context = build_analytics_context(
        db=db,
        event_id=event_id,
    )

    # Generate AI advice
    advice = generate_decision_advice(
        context=context,
        prompt=prompt,
    )

    return advice