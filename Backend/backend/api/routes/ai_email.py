from fastapi import APIRouter, HTTPException

from backend.ai.email_generator import generate_email
from backend.schemas.ai_email import (
    AIEmailRequest,
    AIEmailResponse,
)

from backend.communication.email_service import EmailService

from backend.schemas.ai_email_send import (
    AIEmailSendRequest,
    AIEmailSendResponse,
)
from backend.templates.ai_email_template import (
    build_ai_email_html,
)

router = APIRouter(
    prefix="/ai/email",
    tags=["AI Email"],
)


@router.post(
    "/",
    response_model=AIEmailResponse,
)
def ai_email(
    request: AIEmailRequest,
):
    """
    Generate an AI email.
    """

    try:
        return generate_email(
            prompt=request.prompt,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )

@router.post(
    "/send",
    response_model=AIEmailSendResponse,
)
def send_ai_email(
    request: AIEmailSendRequest,
):
    """
    Generate an AI email and send it.
    """

    try:

        email = generate_email(
            prompt=request.prompt,
        )

        html = build_ai_email_html(
           recipient_name=request.recipient.split("@")[0].title(),
           subject=email["subject"],
           body=email["body"],
        )

        EmailService.send_email(
            recipient=request.recipient,
            subject=email["subject"],
            body=html,
        )
        


        return {
            "message": "AI email sent successfully.",
            "subject": email["subject"],
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )