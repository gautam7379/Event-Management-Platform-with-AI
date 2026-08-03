from pydantic import BaseModel
from typing import Dict, List


class TopEvent(BaseModel):
    event_name: str
    registrations: int


class DashboardChartResponse(BaseModel):

    monthly_registrations: Dict[str, int]

    monthly_revenue: Dict[str, float]

    event_status_distribution: Dict[str, int]

    feedback_rating_distribution: Dict[str, int]

    top_events: List[TopEvent]