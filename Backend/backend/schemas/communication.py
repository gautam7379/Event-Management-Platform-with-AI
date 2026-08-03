from pydantic import BaseModel, EmailStr


class TestEmailRequest(BaseModel):
    recipient: EmailStr


class CommunicationResponse(BaseModel):
    message: str