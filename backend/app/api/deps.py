from fastapi import Depends, HTTPException, status

from app.core.config import Settings, get_settings
from app.db.supabase import get_supabase_client
from app.repositories.farmer_workflow import FarmerWorkflowRepository
from app.services.farmer_flow import FarmerWorkflowService


def get_farmer_workflow_service(
    settings: Settings = Depends(get_settings),
) -> FarmerWorkflowService:
    client = get_supabase_client()
    if client is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        )

    return FarmerWorkflowService(
        repo=FarmerWorkflowRepository(client),
        demo_farmer_profile_id=settings.demo_farmer_profile_id,
    )
