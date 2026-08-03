from fastapi import APIRouter
from datetime import datetime

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get("/")
def health_check():
    """
    Health check endpoint.
    """

    return {
        "status": "healthy",
        "service": "Event Management Platform API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }