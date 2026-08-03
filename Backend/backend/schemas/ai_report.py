from pydantic import BaseModel


class AIReportRequest(BaseModel):
    """
    Request schema for AI event reports.
    """

    event_id: int
    prompt: str


class AIReportResponse(BaseModel):
    """
    AI-generated report response.
    """

    report: str