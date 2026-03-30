from datetime import date, datetime

from pydantic import BaseModel, Field


class ActiveFlowIds(BaseModel):
    request_id: str | None = None
    match_id: str | None = None
    proposal_id: str | None = None
    trade_id: str | None = None
    planting_record_id: str | None = None
    harvest_listing_id: str | None = None


class DemoProfile(BaseModel):
    id: str
    display_name: str
    village: str
    state: str
    preferred_language: str
    trust_score: float


class DemoBootstrapResponse(BaseModel):
    profile: DemoProfile
    quick_prompts: list[str]
    active_flow: ActiveFlowIds


class BarterItemDto(BaseModel):
    normalized_name: str
    display_name: str
    category: str
    quantity: float
    unit: str


class IntakeCreateRequest(BaseModel):
    raw_text: str = Field(min_length=3)


class IntakeSummaryResponse(BaseModel):
    request_id: str
    farmer_profile_id: str
    raw_text: str
    crop_code: str
    crop_label: str
    timeline_label: str
    timeline_days: int
    radius_km: float
    urgency: str
    parsed_confidence: float
    market_opportunity_count: int
    status: str
    have_item: BarterItemDto
    need_item: BarterItemDto


class MatchCardResponse(BaseModel):
    match_id: str
    counterparty_profile_id: str
    counterparty_name: str
    counterparty_avatar_url: str | None = None
    distance_km: float
    total_score: int
    exact_need_score: int
    reciprocal_need_score: int
    distance_score: int
    trust_score: int
    offered_item_name: str
    offered_quantity: float
    offered_unit: str
    desired_item_name: str
    desired_item_priority: str
    rationale: str
    insight: str
    is_optimized: bool = False


class MatchesResponse(BaseModel):
    request_id: str
    matches: list[MatchCardResponse]
    total_candidates: int


class ProposalResponse(BaseModel):
    proposal_id: str
    request_id: str
    match_id: str
    counterparty_name: str
    document_number: str
    generated_at: datetime
    offer_item_name: str
    offer_quantity: float
    offer_unit: str
    requested_item_name: str
    requested_quantity: float
    requested_unit: str
    ratio_text: str
    valuation_confidence: float
    explanation: str
    meeting_point_name: str
    meeting_label: str
    meeting_at: datetime
    trade_id: str | None = None


class TradeResponse(BaseModel):
    trade_id: str
    proposal_id: str
    request_id: str
    transaction_code: str
    counterparty_name: str
    trade_status: str
    offer_item_name: str
    offer_quantity: float
    offer_unit: str
    requested_item_name: str
    requested_quantity: float
    requested_unit: str
    meeting_point_name: str
    meeting_at: datetime
    projected_yield_uplift_pct: int
    planting_prompt: str
    created_at: datetime


class PlantingCreateRequest(BaseModel):
    crop_type: str = Field(min_length=2)
    planting_date: date
    area_value: float = Field(gt=0)
    area_unit: str = Field(min_length=2)
    input_summary: str = Field(min_length=3)


class BuyerPreview(BaseModel):
    buyer_name: str
    avatar_url: str | None = None


class HarvestListingResponse(BaseModel):
    planting_record_id: str
    harvest_listing_id: str
    crop_code: str
    crop_label: str
    listing_title: str
    estimated_yield_min_kg: int
    estimated_yield_max_kg: int
    harvest_window_label: str
    harvest_window_start: date
    harvest_window_end: date
    quality_band: str
    confidence_score: float
    reservation_discount_pct: int
    early_incentive_label: str
    listing_note: str
    soil_vitality_label: str
    yield_probability_label: str
    buyer_interest_count: int
    buyer_previews: list[BuyerPreview]
    status: str
