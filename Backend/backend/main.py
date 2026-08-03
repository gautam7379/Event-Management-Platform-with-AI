from fastapi import FastAPI
from backend.core.config import settings
import backend.models
from backend.api.routes.auth import router as auth_router
from backend.api.routes.admin import router as admin_router
from backend.api.routes.event import router as event_router
from backend.api.routes.venue import router as venue_router
from backend.api.routes.registration import router as registration_router
from backend.api.routes.ticket import router as ticket_router
from backend.api.routes.payment import router as payment_router
from backend.api.routes.checkin import router as checkin_router
from backend.api.routes.feedback import router as feedback_router
from backend.api.routes.vendor import router as vendor_router
from backend.api.routes.sponsor import router as sponsor_router
from backend.api.routes.speaker import router as speaker_router
from backend.api.routes.session import router as session_router
from backend.api.routes.ai import router as ai_router
from backend.api.routes.ai_dashboard import router as ai_dashboard_router
from backend.api.routes.ai_budget import router as ai_budget_router
from backend.api.routes.ai_success import router as ai_success_router
from backend.api.routes.attendance_prediction import (
    router as attendance_prediction_router,
)
from backend.api.routes.ai_decision import (
    router as ai_decision_router,
)
from backend.api.routes.ai_health import router as ai_health_router
from backend.api.routes.communication import (
    router as communication_router,
)

from backend.api.routes.reminder import (
    router as reminder_router,
)
from backend.api.routes.ai_email import (
    router as ai_email_router,
)
from backend.api.routes import ai_report
from backend.api.routes.ai_analytics import router as ai_analytics_router
from backend.api.routes.ai_chat import (
    router as ai_chat_router,
)


from backend.api.routes.dashboard_analytics import (
    router as dashboard_analytics_router,
)
from backend.api.routes.dashboard_chart import (
    router as dashboard_chart_router,
)

from backend.api.routes.health import (
    router as health_router,
)

from backend.api.routes.info import (
    router as info_router,
)
from backend.core.logging_config import (
    setup_logging,
)

from backend.core.exception_handler import (
    global_exception_handler,
)



app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION
)

app.add_exception_handler(
    Exception,
    global_exception_handler,
)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(event_router)
app.include_router(venue_router)
app.include_router(registration_router)
app.include_router(ticket_router)
app.include_router(payment_router)
app.include_router(checkin_router)
app.include_router(feedback_router)
app.include_router(vendor_router)
app.include_router(sponsor_router)
app.include_router(speaker_router)
app.include_router(session_router)
app.include_router(ai_router)
app.include_router(communication_router)
app.include_router(reminder_router)
app.include_router(ai_email_router)
app.include_router(ai_report.router)
app.include_router(ai_analytics_router)
app.include_router(ai_health_router)
app.include_router(attendance_prediction_router)
app.include_router(ai_success_router)
app.include_router(ai_budget_router)
app.include_router(ai_dashboard_router)
app.include_router(ai_decision_router)
app.include_router(ai_chat_router)
app.include_router(dashboard_analytics_router)
app.include_router(dashboard_chart_router)
app.include_router(health_router)
app.include_router(info_router)
app.add_exception_handler(
    Exception,
    global_exception_handler,
)


setup_logging()

@app.get("/")
def root():
    return {
        "message": settings.APP_NAME
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/config-test")
def config_test():
    return {
        "database": settings.DB_NAME,
        "host": settings.DB_HOST,
        "port": settings.DB_PORT
    }