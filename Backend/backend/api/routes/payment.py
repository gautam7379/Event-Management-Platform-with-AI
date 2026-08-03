from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db

from backend.schemas.payment import (
    PaymentCreate,
    PaymentResponse,
)

from backend.services.payment_service import (
    create_new_payment,
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"],
)


@router.post(
    "/",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
):
    """
    Create a payment.
    """
    try:
        return create_new_payment(
            db=db,
            payment=payment,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )