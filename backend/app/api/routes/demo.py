from fastapi import APIRouter, Depends

from app.api.deps import get_farmer_workflow_service
from app.schemas.farmer_flow import DemoBootstrapResponse
from app.services.farmer_flow import FarmerWorkflowService

router = APIRouter(prefix="/demo", tags=["demo"])


@router.get("/bootstrap", response_model=DemoBootstrapResponse)
def demo_bootstrap(
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> DemoBootstrapResponse:
    return service.get_bootstrap()
