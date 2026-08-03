from pydantic import BaseModel


class DashboardAnalyticsResponse(BaseModel):
    """
    Admin dashboard analytics response.
    """

    total_events: int

    published_events: int

    draft_events: int

    completed_events: int

    total_registrations: int

    confirmed_registrations: int

    pending_registrations: int

    total_revenue: float

    total_speakers: int

    total_sessions: int

    total_sponsors: int

    total_vendors: int

    total_feedback: int

    average_feedback_rating: float