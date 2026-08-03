from pydantic import BaseModel


class AttendancePredictionRequest(BaseModel):
    """
    Request schema for attendance prediction.
    """

    event_id: int
    prompt: str


class AttendancePredictionResponse(BaseModel):
    """
    Response schema for attendance prediction.
    """

    prediction: str