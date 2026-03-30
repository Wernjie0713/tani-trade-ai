from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler

from app.core.config import Settings


def configure_ai_file_logging(settings: Settings) -> None:
    log_path = settings.ai_log_path
    log_path.parent.mkdir(parents=True, exist_ok=True)

    ai_logger = logging.getLogger("app.services.ai")
    file_handler = _get_existing_file_handler(ai_logger, str(log_path))
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
        ai_logger.addHandler(file_handler)

    ai_logger.setLevel(logging.INFO if settings.ai_debug_logging else logging.WARNING)
    ai_logger.propagate = True


def _get_existing_file_handler(logger: logging.Logger, filename: str) -> RotatingFileHandler | None:
    for handler in logger.handlers:
        if isinstance(handler, RotatingFileHandler) and handler.baseFilename == filename:
            return handler
    return None
