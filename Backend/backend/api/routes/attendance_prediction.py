from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.ai.analytics_context import (
    build_analytics_context,
)

from backend.ai.attendance_predictor import (
    predict_attendance,
)

from backend.schemas.attendance_prediction import (
    AttendancePredictionRequest,
    AttendancePredictionResponse,
)

router = APIRouter(
    prefix="/ai/predict-attendance",
    tags=["AI Attendance Prediction"],
)


@router.post(
    "/",
    response_model=AttendancePredictionResponse,
)
def attendance_prediction(
    request: AttendancePredictionRequest,
    db: Session = Depends(get_db),
):
    """
    Predict event attendance using AI.
    """

    try:

        context = build_analytics_context(
            db=db,
            event_id=request.event_id,
        )

        prediction = predict_attendance(
            context=context,
            prompt=request.prompt,
        )

        return {
            "prediction": prediction,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )