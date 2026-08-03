from pydantic import BaseModel


class ChatRequest(BaseModel):
    """
    AI Chat Assistant request.
    """

    event_id: int
    question: str


class ChatResponse(BaseModel):
    """
    AI Chat Assistant response.
    """

    answer: str