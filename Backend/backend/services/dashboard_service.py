from sqlalchemy.orm import Session

from backend.ai.dashboard_generator import (
    generate_dashboard,
)


from backend.ai.analytics_context import (
    build_analytics_context,
)

def generate_dashboard_insights(
    db: Session,
    event_id: int,
    prompt: str,
) -> str:
    """
    Generate AI Organizer Dashboard Insights.
    """

    # Build analytics context
    context = build_analytics_context(
        db=db,
        event_id=event_id,
    )

    # Generate dashboard
    dashboard = generate_dashboard(
        context=context,
        prompt=prompt,
    )

    return dashboard