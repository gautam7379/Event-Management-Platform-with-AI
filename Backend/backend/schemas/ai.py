from typing import Optional

from pydantic import BaseModel, Field


class AIPlanningRequest(BaseModel):
    """
    Request schema for the AI Planning Assistant.
    """

    event_id: Optional[int] = Field(
        default=None,
        description="Event ID for context-aware AI."
    )

    prompt: str = Field(
        ...,
        min_length=5,
        max_length=5000,
        description="User request for AI planning."
    )


class AIPlanningResponse(BaseModel):
    """
    Response schema for the AI Planning Assistant.
    """

    response: str