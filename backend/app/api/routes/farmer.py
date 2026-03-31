from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.deps import get_farmer_workflow_service, get_speech_transcription_service
from app.schemas.farmer_flow import (
    HarvestListingResponse,
    IntakeCreateRequest,
    IntakeSummaryResponse,
    IntakeUpdateRequest,
    MatchesResponse,
    PlantingCreateRequest,
    ProposalResponse,
    SpeechTranscriptionResponse,
    TradeResponse,
)
from app.services.farmer_flow import FarmerWorkflowService
from app.services.speech import SpeechTranscriptionService, SpeechTranscriptionServiceError

router = APIRouter(prefix="/farmer", tags=["farmer"])


@router.post("/speech/transcriptions", response_model=SpeechTranscriptionResponse)
async def transcribe_speech(
    audio: UploadFile = File(...),
    service: SpeechTranscriptionService = Depends(get_speech_transcription_service),
) -> SpeechTranscriptionResponse:
    try:
        audio_bytes = await audio.read()
        if not audio_bytes:
            raise HTTPException(status_code=400, detail="Audio file is empty.")
        return service.transcribe_audio(
            audio_bytes,
            filename=audio.filename,
            content_type=audio.content_type,
        )
    except SpeechTranscriptionServiceError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message) from exc


@router.post("/intakes", response_model=IntakeSummaryResponse)
def create_intake(
    payload: IntakeCreateRequest,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> IntakeSummaryResponse:
    return service.create_intake(payload.raw_text)


@router.get("/intakes/{request_id}", response_model=IntakeSummaryResponse)
def get_intake(
    request_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> IntakeSummaryResponse:
    return service.get_intake(request_id)


@router.patch("/intakes/{request_id}", response_model=IntakeSummaryResponse)
def update_intake(
    request_id: str,
    payload: IntakeUpdateRequest,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> IntakeSummaryResponse:
    return service.update_intake(request_id, payload)


@router.post("/intakes/{request_id}/matches", response_model=MatchesResponse)
def get_or_create_matches(
    request_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> MatchesResponse:
    return service.get_or_create_matches(request_id)


@router.post("/matches/{match_id}/proposal", response_model=ProposalResponse)
def get_or_create_proposal(
    match_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> ProposalResponse:
    return service.get_or_create_proposal(match_id)


@router.post("/proposals/{proposal_id}/accept", response_model=TradeResponse)
def accept_proposal(
    proposal_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> TradeResponse:
    return service.accept_proposal(proposal_id)


@router.get("/trades/{trade_id}", response_model=TradeResponse)
def get_trade(
    trade_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> TradeResponse:
    return service.get_trade(trade_id)


@router.post("/trades/{trade_id}/planting", response_model=HarvestListingResponse)
def create_or_update_planting(
    trade_id: str,
    payload: PlantingCreateRequest,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> HarvestListingResponse:
    return service.create_or_update_planting(trade_id, payload)


@router.get("/harvest-listings/{listing_id}", response_model=HarvestListingResponse)
def get_harvest_listing(
    listing_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> HarvestListingResponse:
    return service.get_harvest_listing(listing_id)


@router.post("/harvest-listings/{listing_id}/publish", response_model=HarvestListingResponse)
def publish_harvest_listing(
    listing_id: str,
    service: FarmerWorkflowService = Depends(get_farmer_workflow_service),
) -> HarvestListingResponse:
    return service.publish_harvest_listing(listing_id)
