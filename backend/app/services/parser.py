from __future__ import annotations

import re
from dataclasses import dataclass

from app.services.catalog import (
    TIMELINE_ALIASES,
    UNIT_ALIASES,
    URGENT_ALIASES,
    crop_label,
    find_crop_code,
    find_item_code,
    item_category,
    item_default_unit,
    item_display_name,
    normalize_phrase,
)


@dataclass(slots=True)
class ParsedBarterItem:
    normalized_name: str
    display_name: str
    category: str
    quantity: float
    unit: str


@dataclass(slots=True)
class ParsedIntake:
    raw_text: str
    crop_code: str
    crop_label: str
    crop_detected: bool
    crop_display_label: str | None
    timeline_label: str
    timeline_days: int
    radius_km: float
    urgency: str
    confidence: float
    have_item: ParsedBarterItem
    need_item: ParsedBarterItem


QUANTITY_PATTERN = re.compile(
    r"(?P<quantity>\d+(?:\.\d+)?)\s*(?P<unit>kg|kilograms?|grams?|g|liters?|litres?|litres?|l|bags?|packs?|sets?|crates?)?",
    re.IGNORECASE,
)

HAVE_SEGMENT_PATTERNS = [
    re.compile(r"(?:i have|i got|i'm offering|i am offering|surplus|extra|ada|lebihan)\s+(?P<segment>[^.,;]+)", re.IGNORECASE),
]
NEED_SEGMENT_PATTERNS = [
    re.compile(r"(?:i need|looking for|look for|require|need|perlu|perlukan|mencari)\s+(?P<segment>[^.,;]+)", re.IGNORECASE),
]


def parse_intake(raw_text: str) -> ParsedIntake:
    normalized = normalize_phrase(raw_text)
    detected_crop_code = find_crop_code(normalized)
    crop_code = detected_crop_code or "paddy"
    timeline_label, timeline_days = _extract_timeline(normalized)
    radius_km = _extract_radius(normalized)
    urgency = _extract_urgency(normalized, timeline_days)

    have_segment = _extract_segment(raw_text, HAVE_SEGMENT_PATTERNS) or raw_text
    need_segment = _extract_segment(raw_text, NEED_SEGMENT_PATTERNS) or raw_text

    have_item = _parse_item(have_segment, fallback_item_code="nitrogen_fertilizer")
    need_item = _parse_item(need_segment, fallback_item_code="organic_pesticide")

    confidence = 0.72
    if crop_code:
        confidence += 0.08
    if have_item.normalized_name:
        confidence += 0.08
    if need_item.normalized_name:
        confidence += 0.08
    if have_item.quantity > 0:
        confidence += 0.05
    if need_item.quantity > 0:
        confidence += 0.05

    return ParsedIntake(
        raw_text=raw_text.strip(),
        crop_code=crop_code,
        crop_label=crop_label(crop_code),
        crop_detected=detected_crop_code is not None,
        crop_display_label=crop_label(detected_crop_code) if detected_crop_code else None,
        timeline_label=timeline_label,
        timeline_days=timeline_days,
        radius_km=radius_km,
        urgency=urgency,
        confidence=min(round(confidence, 2), 0.98),
        have_item=have_item,
        need_item=need_item,
    )


def _extract_segment(raw_text: str, patterns: list[re.Pattern[str]]) -> str | None:
    for pattern in patterns:
        match = pattern.search(raw_text)
        if match:
            return match.group("segment").strip()
    return None


def _extract_timeline(normalized_text: str) -> tuple[str, int]:
    for alias, label, days in TIMELINE_ALIASES:
        if alias in normalized_text:
            return label, days
    return "Next Week", 7


def _extract_radius(normalized_text: str) -> float:
    match = re.search(r"(\d+(?:\.\d+)?)\s*km", normalized_text)
    if not match:
        return 5.0
    return float(match.group(1))


def _extract_urgency(normalized_text: str, timeline_days: int) -> str:
    if any(alias in normalized_text for alias in URGENT_ALIASES["high"]):
        return "high"
    if any(alias in normalized_text for alias in URGENT_ALIASES["medium"]):
        return "medium"
    return "high" if timeline_days <= 1 else "medium"


def _parse_item(segment: str, fallback_item_code: str) -> ParsedBarterItem:
    normalized_segment = normalize_phrase(segment)
    item_code = find_item_code(normalized_segment) or fallback_item_code
    quantity, unit = _extract_quantity_and_unit(segment, item_default_unit(item_code))

    return ParsedBarterItem(
        normalized_name=item_code,
        display_name=item_display_name(item_code),
        category=item_category(item_code),
        quantity=quantity,
        unit=unit,
    )


def _extract_quantity_and_unit(text: str, default_unit: str) -> tuple[float, str]:
    match = QUANTITY_PATTERN.search(text)
    if not match:
        return 1.0, default_unit

    quantity = float(match.group("quantity"))
    raw_unit = (match.group("unit") or default_unit).lower()
    return quantity, UNIT_ALIASES.get(raw_unit, default_unit)
