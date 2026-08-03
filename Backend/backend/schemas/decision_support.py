from pydantic import BaseModel


class DecisionSupportRequest(BaseModel):
    """
    AI Decision Support request.
    """

    event_id: int
    prompt: str


class DecisionSupportResponse(BaseModel):
    """
    AI Decision Support response.
    """

    advice: str