from fastapi import APIRouter, HTTPException, status

from backend.communication.email_service import EmailService
from backend.communication.email_templates import (
    registration_confirmation,
)
from backend.schemas.communication import (
    CommunicationResponse,
    TestEmailRequest,
)

router = APIRouter(
    prefix="/communication",
    tags=["Communication"],
)


@router.post(
    "/email/test",
    response_model=CommunicationResponse,
    status_code=status.HTTP_200_OK,
)
def send_test_email(
    request: TestEmailRequest,
):
    """
    Send a test registration confirmation email.
    """

    try:

        subject, body = registration_confirmation(
            user_name="Test User",
            event_name="AI Conference",
        )

        EmailService.send_email(
            recipient=request.recipient,
            subject=subject,
            body=body,
        )

        return CommunicationResponse(
            message="Email sent successfully."
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )