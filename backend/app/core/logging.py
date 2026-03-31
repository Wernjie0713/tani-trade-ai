from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler

from app.core.config import Settings


def configure_ai_file_logging(settings: Settings) -> None:
    log_path = settings.ai_log_path
    log_path.parent.mkdir(parents=True, exist_ok=True)

    _configure_namespace_logger(
        logger_name="app.services.ai",
        log_path=str(log_path),
        enabled=settings.ai_debug_logging,
    )
    _configure_namespace_logger(
        logger_name="app.services.speech",
        log_path=str(log_path),
        enabled=settings.speech_debug_logging,
    )


def _configure_namespace_logger(*, logger_name: str, log_path: str, enabled: bool) -> None:
    logger = logging.getLogger(logger_name)
    file_handler = _get_existing_file_handler(logger, log_path)
    if file_handler is None:
        file_handler = RotatingFileHandler(
            log_path,
            maxBytes=1_000_000,
            backupCount=3,
            encoding="utf-8",
        )
        file_handler.setFormatter(
            logging.Formatter("%(asctime)s | %(levelname)s | %(name)s | %(message)s")
        )
        logger.addHandler(file_handler)

    logger.setLevel(logging.INFO if enabled else logging.WARNING)
    logger.propagate = True


def _get_existing_file_handler(logger: logging.Logger, filename: str) -> RotatingFileHandler | None:
    for handler in logger.handlers:
        if isinstance(handler, RotatingFileHandler) and handler.baseFilename == filename:
            return handler
    return None
