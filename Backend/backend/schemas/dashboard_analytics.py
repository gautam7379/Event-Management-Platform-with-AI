from pydantic import BaseModel
from datetime import datetime


class RecentActivityItem(BaseModel):
    type: str
    message: str
    created_at: datetime

class DashboardAnalyticsResponse(BaseModel):
    """
    Admin dashboard analytics response.
    """

    # ==========================
    # Event Statistics
    # ==========================

    total_events: int

    published_events: int

    draft_events: int

    completed_events: int

    upcoming_events: int


    # ==========================
    # Registration Statistics
    # ==========================

    total_registrations: int

    confirmed_registrations: int

    pending_registrations: int

    registration_rate: float


    # ==========================
    # Ticket Statistics
    # ==========================

    total_tickets: int


    # ==========================
    # Check-In Statistics
    # ==========================

    checked_in_count: int


    # ==========================
    # Revenue Statistics
    # ==========================

    total_revenue: float


    # ==========================
    # Platform Statistics
    # ==========================

    total_speakers: int

    total_sessions: int

    total_sponsors: int

    total_vendors: int


    # ==========================
    # Feedback Statistics
    # ==========================

    total_feedback: int

    average_feedback_rating: float

    recent_activity: list[RecentActivityItem]