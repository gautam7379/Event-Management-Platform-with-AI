from pydantic import BaseModel


class DashboardRequest(BaseModel):
    """
    AI Organizer Dashboard request.
    """

    event_id: int
    prompt: str


class DashboardResponse(BaseModel):
    """
    AI Organizer Dashboard response.
    """

    dashboard: str