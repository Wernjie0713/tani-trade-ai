from fastapi import Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.db.firebase import get_firestore_client
from app.repositories.farmer_workflow import FarmerWorkflowRepository
from app.services.ai.client import GeminiAiClient
from app.services.ai.orchestrator import FarmerAiOrchestrator
from app.services.farmer_flow import FarmerWorkflowService


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
