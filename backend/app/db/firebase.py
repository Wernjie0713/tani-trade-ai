from __future__ import annotations

import json
from functools import lru_cache
from threading import Lock

import firebase_admin
from firebase_admin import credentials, firestore

from app.core.config import get_settings

_firebase_init_lock = Lock()


@lru_cache
def get_firestore_client():
    settings = get_settings()

    if not settings.firebase_configured:
        return None

    with _firebase_init_lock:
        try:
            app = firebase_admin.get_app()
        except ValueError:
            credential = None
            options: dict[str, str] = {}

            if settings.firebase_service_account_json:
                credential = credentials.Certificate(
                    json.loads(settings.firebase_service_account_json),
                )
            elif settings.firebase_credentials_file is not None:
                credential = credentials.Certificate(str(settings.firebase_credentials_file))

            if settings.firebase_project_id:
                options["projectId"] = settings.firebase_project_id

            try:
                app = firebase_admin.initialize_app(
                    credential=credential,
                    options=options or None,
                )
            except ValueError as exc:
                # Another request may have initialized the default app between
                # get_app() and initialize_app(). Reuse it instead of failing.
                if "already exists" not in str(exc):
                    raise
                app = firebase_admin.get_app()

    return firestore.client(app=app)
