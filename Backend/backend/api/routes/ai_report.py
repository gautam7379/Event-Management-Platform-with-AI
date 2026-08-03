from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from backend.database.database import get_db
from backend.schemas.ai_report import (
    AIReportRequest,
    AIReportResponse,
)
from backend.ai.report_context import (
    build_report_context,
)
from backend.ai.report_generator import (
    generate_event_report,
)

router = APIRouter(
    prefix="/ai/report",
    tags=["AI Reports"],
)

@router.post(
    "/",
    response_model=AIReportResponse,
)
def generate_report(
    request: AIReportRequest,
    db: Session = Depends(get_db),
):
    """
    Generate an AI event report.
    """
    try:
        # Build context from DB
        context = build_report_context(
            db=db,
            event_id=request.event_id,
        )

        # Generate report with AI
        report = generate_event_report(
            context=context,
            prompt=request.prompt,
        )

        return AIReportResponse(report=report)

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
