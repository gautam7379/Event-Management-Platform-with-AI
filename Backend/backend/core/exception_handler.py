import logging

from fastapi import Request
from fastapi.responses import JSONResponse


logger = logging.getLogger(__name__)


async def global_exception_handler(
    request: Request,
    exc: Exception,
):
    """
    Handle unexpected exceptions globally.
    """

    logger.exception(
        "Unhandled Exception: %s",
        str(exc),
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal Server Error",
            "detail": str(exc),
        },
    )