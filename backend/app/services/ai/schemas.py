from __future__ import annotations

from pydantic import BaseModel, Field


class GeminiBarterItemExtraction(BaseModel):
    item_name: str | None = None
    normalized_item_name: str | None = None
    quantity: float | None = None
    unit: str | None = None


class GeminiIntakeExtraction(BaseModel):
    crop_code: str | None = None
    crop_name: str | None = None
    have_item: GeminiBarterItemExtraction | None = None
    need_item: GeminiBarterItemExtraction | None = None
    timeline_label: str | None = None
    timeline_days: int | None = None
    radius_km: float | None = None
    urgency: str | None = None
    confidence: float | None = None
    missing_fields: list[str] = Field(default_factory=list)


class GeminiProposalExplanation(BaseModel):
    explanation: str


class GeminiHarvestListingCopy(BaseModel):
    listing_title: str
    listing_note: str
    soil_vitality_label: str
    yield_probability_label: str
