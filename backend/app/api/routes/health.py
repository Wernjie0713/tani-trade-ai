from fastapi import APIRouter

from app.core.config import get_settings
from app.db.supabase import get_supabase_client

router = APIRouter(tags=["health"])


@router.get("/health")
def health_check() -> dict[str, object]:
    settings = get_settings()

    return {
        "status": "ok",
        "service": settings.app_name,
        "supabase_configured": get_supabase_client() is not None,
        "frontend_url": settings.frontend_url,
    }
