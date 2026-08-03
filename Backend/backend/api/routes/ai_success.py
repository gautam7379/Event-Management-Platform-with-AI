from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.success_prediction import (
    SuccessPredictionRequest,
    SuccessPredictionResponse,
)

from backend.services.success_prediction_service import (
    generate_event_success_prediction,
)

router = APIRouter(
    prefix="/ai/success",
    tags=["AI Success Prediction"],
)


@router.post(
    "/",
    response_model=SuccessPredictionResponse,
)
def ai_success_prediction(
    request: SuccessPredictionRequest,
    db: Session = Depends(get_db),
):
    """
    Generate AI Event Success Prediction.
    """

    try:

        prediction = generate_event_success_prediction(
            db=db,
            event_id=request.event_id,
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