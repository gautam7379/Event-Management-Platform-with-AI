from pydantic import BaseModel


class ChatRequest(BaseModel):
    """
    AI Chat Assistant request.

    event_id:
        Optional.

        If provided:
        answer using that event.

        If omitted:
        answer using platform-wide data.
    """

    event_id: int | None = None

    question: str


class ChatResponse(BaseModel):
    """
    AI Chat Assistant response.
    """

    answer: str