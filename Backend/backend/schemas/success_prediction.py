from pydantic import BaseModel


class SuccessPredictionRequest(BaseModel):
    """
    Request schema for AI Event Success Prediction.
    """

    event_id: int
    prompt: str


class SuccessPredictionResponse(BaseModel):
    """
    Response schema for AI Event Success Prediction.
    """

    prediction: str