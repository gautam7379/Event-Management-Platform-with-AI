from pydantic import BaseModel


class AIAnalyticsRequest(BaseModel):
    """
    Request schema for AI analytics.
    """

    event_id: int
    prompt: str


class AIAnalyticsResponse(BaseModel):
    """
    Response schema for AI analytics.
    """

    analytics: str