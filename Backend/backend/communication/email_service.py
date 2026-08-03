import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from backend.communication.smtp_config import (
    SMTPSettings,
)


class EmailService:
    """
    Email sending service.
    """

    @staticmethod
    def send_email(
        recipient: str,
        subject: str,
        body: str,
        html: bool = True,
    ):
        """
        Send email.
        """

        message = MIMEMultipart()

        message["From"] = SMTPSettings.EMAIL_FROM
        message["To"] = recipient
        message["Subject"] = subject

        if html:
            message.attach(
                MIMEText(body, "html")
            )
        else:
            message.attach(
                MIMEText(body, "plain")
            )

        with smtplib.SMTP(
            SMTPSettings.SMTP_SERVER,
            SMTPSettings.SMTP_PORT,
        ) as server:

            server.starttls()

            server.login(
                SMTPSettings.SMTP_USERNAME,
                SMTPSettings.SMTP_PASSWORD,
            )

            server.send_message(message)