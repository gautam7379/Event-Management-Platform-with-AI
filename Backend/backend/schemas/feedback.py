from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FeedbackCreate(BaseModel):
    """
    Schema for submitting feedback.
    """

    event_id: int
    user_id: int
    registration_id: int
    rating: int
    comments: str
    sentiment: str


class FeedbackResponse(BaseModel):
    """
    Feedback response schema.
    """

    id: int
    event_id: int
    user_id: int
    registration_id: int
    rating: int
    comments: str
    sentiment: str
    submitted_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )