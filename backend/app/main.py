import logging

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from postgrest.exceptions import APIError as PostgrestAPIError

from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_ai_file_logging

settings = get_settings()
configure_ai_file_logging(settings)
logger = logging.getLogger("uvicorn.error")

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Backend API for the TaniTrade AI platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.exception_handler(httpx.HTTPError)
def handle_httpx_error(_: Request, exc: httpx.HTTPError) -> JSONResponse:
    logger.exception("HTTP integration error", exc_info=exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Upstream service request failed. Check backend connectivity and credentials."},
    )


@app.exception_handler(PostgrestAPIError)
def handle_postgrest_error(_: Request, exc: PostgrestAPIError) -> JSONResponse:
    logger.exception("Supabase API error", exc_info=exc)
    return JSONResponse(
        status_code=502,
        content={"detail": "Supabase rejected the request. Check your schema, RLS, and service key."},
    )


@app.exception_handler(Exception)
def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled application error", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error."},
    )


@app.get("/", tags=["root"])
def read_root() -> dict[str, str]:
    return {
        "message": "TaniTrade AI API is running.",
        "docs_url": "/docs",
    }
