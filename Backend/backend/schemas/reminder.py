from pydantic import BaseModel


class ReminderResponse(BaseModel):
    emails_sent: int
    total_registrations: int