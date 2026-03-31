import json

from google.cloud import speech_v2
from google.oauth2 import service_account
from fastapi import Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.db.firebase import get_firestore_client
from app.repositories.farmer_workflow import FarmerWorkflowRepository
from app.services.ai.client import GeminiAiClient
from app.services.ai.orchestrator import FarmerAiOrchestrator
from app.services.farmer_flow import FarmerWorkflowService
from app.services.speech import SpeechTranscriptionService


def get_farmer_workflow_service(
    settings: Settings = Depends(get_settings),
) -> FarmerWorkflowService:
    client = get_firestore_client()
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Firebase is not configured. Set FIREBASE_PROJECT_ID and either "
                "FIREBASE_CREDENTIALS_PATH or FIREBASE_SERVICE_ACCOUNT_JSON."
            ),
        )

    ai_client = None
    if settings.gemini_api_key:
        ai_client = GeminiAiClient(
            api_key=settings.gemini_api_key,
            timeout_seconds=settings.gemini_timeout_seconds,
            max_retries=settings.gemini_max_retries,
            debug_logging=settings.ai_debug_logging,
        )

    return FarmerWorkflowService(
        repo=FarmerWorkflowRepository(client),
        demo_farmer_profile_id=settings.demo_farmer_profile_id,
        ai_orchestrator=FarmerAiOrchestrator(
            client=ai_client,
            primary_model=settings.gemini_model_primary,
            listing_model=settings.gemini_model_listing,
            fallback_enabled=settings.ai_fallback_enabled,
            debug_logging=settings.ai_debug_logging,
        ),
    )


def get_speech_transcription_service(
    settings: Settings = Depends(get_settings),
) -> SpeechTranscriptionService:
    project_id = settings.google_cloud_project
    if not project_id:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Google Speech-to-Text is not configured. Set GOOGLE_CLOUD_PROJECT_ID "
                "or FIREBASE_PROJECT_ID first."
            ),
        )

    try:
        credentials = None
        if settings.firebase_service_account_json:
            credentials = service_account.Credentials.from_service_account_info(
                json.loads(settings.firebase_service_account_json),
            )
        elif settings.firebase_credentials_file is not None:
            credentials = service_account.Credentials.from_service_account_file(
                str(settings.firebase_credentials_file),
            )

        client_kwargs = {"credentials": credentials} if credentials is not None else {}
        client = speech_v2.SpeechClient(**client_kwargs)
    except Exception as exc:  # pragma: no cover - exercised through API tests
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Google Speech-to-Text is not configured correctly. "
                "Check your service account and project settings."
            ),
        ) from exc

    return SpeechTranscriptionService(
        client=client,
        project_id=project_id,
        language_codes=settings.speech_language_codes,
        model=settings.speech_to_text_model,
        max_audio_seconds=settings.speech_max_audio_seconds,
        max_audio_bytes=settings.speech_max_audio_bytes,
        debug_logging=settings.speech_debug_logging,
    )
