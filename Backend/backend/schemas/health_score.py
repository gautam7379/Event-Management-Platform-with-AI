from pydantic import BaseModel


class HealthScoreRequest(BaseModel):
    event_id: int
    prompt: str


class HealthScoreResponse(BaseModel):
    health_report: str