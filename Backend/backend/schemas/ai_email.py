from pydantic import BaseModel


class AIEmailRequest(BaseModel):
    prompt: str
    event_id: int | None = None


class AIEmailResponse(BaseModel):
    subject: str
    body: str