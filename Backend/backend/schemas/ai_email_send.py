from pydantic import BaseModel, EmailStr


class AIEmailSendRequest(BaseModel):
    """
    Request schema for AI email sending.
    """

    recipient: EmailStr
    prompt: str
    event_id: int | None = None


class AIEmailSendResponse(BaseModel):
    """
    Response schema.
    """

    message: str
    subject: str