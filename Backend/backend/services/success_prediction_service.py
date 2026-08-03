from sqlalchemy.orm import Session

from backend.ai.success_predictor import (
    generate_success_prediction,
)

from backend.ai.analytics_context import (
    build_analytics_context,
)


def generate_event_success_prediction(
    db: Session,
    event_id: int,
    prompt: str,
) -> str:
    """
    Generate AI-based event success prediction.
    """

    # Build analytics context
    context = build_analytics_context(
        db=db,
        event_id=event_id,
    )

    # Generate prediction
    prediction = generate_success_prediction(
        context=context,
        prompt=prompt,
    )

    return prediction