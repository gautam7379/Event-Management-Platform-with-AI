from pydantic import BaseModel


class BudgetAnalysisRequest(BaseModel):
    """
    Request schema for AI Budget Analysis.
    """

    event_id: int
    prompt: str


class BudgetAnalysisResponse(BaseModel):
    """
    Response schema for AI Budget Analysis.
    """

    analysis: str