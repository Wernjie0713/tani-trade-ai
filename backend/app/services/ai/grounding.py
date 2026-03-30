from __future__ import annotations

import json
from typing import Any

from app.services.catalog import CROP_CATALOG, ITEM_CATALOG, TIMELINE_ALIASES, URGENT_ALIASES


def _compact_json(data: dict[str, Any]) -> str:
    return json.dumps(data, ensure_ascii=True, separators=(",", ":"), sort_keys=True)


def build_intake_grounding(raw_text: str, farmer_profile: dict[str, Any], inventory_rows: list[dict[str, Any]]) -> str:
    context = {
        "raw_text": raw_text,
        "farmer_profile": {
            "display_name": farmer_profile["display_name"],
            "preferred_language": farmer_profile["preferred_language"],
            "village": farmer_profile["village"],
            "state": farmer_profile["state"],
        },
        "supported_crops": {
            code: {"label": crop["label"], "aliases": crop["aliases"]}
            for code, crop in CROP_CATALOG.items()
        },
        "supported_items": {
            code: {
                "display_name": item["display_name"],
                "category": item["category"],
                "default_unit": item["default_unit"],
                "aliases": item["aliases"],
            }
            for code, item in ITEM_CATALOG.items()
        },
        "existing_inventory": [
            {
                "item_name": row["item_name"],
                "normalized_item_name": row["normalized_item_name"],
                "quantity": float(row["quantity"]),
                "unit": row["unit"],
            }
            for row in inventory_rows
        ],
        "timeline_hints": [
            {"alias": alias, "label": label, "days": days}
            for alias, label, days in TIMELINE_ALIASES
        ],
        "urgency_values": list(URGENT_ALIASES.keys()),
    }
    return _compact_json(context)


def build_proposal_grounding(
    *,
    request_row: dict[str, Any],
    have_item: dict[str, Any],
    need_item: dict[str, Any],
    counterparty: dict[str, Any],
    counterparty_offer: dict[str, Any],
    offered_price: dict[str, Any],
    requested_price: dict[str, Any],
    ratio_text: str,
    meeting_point: dict[str, Any],
    fallback_explanation: str,
) -> str:
    context = {
        "request": {
            "crop_label": request_row["crop_label"],
            "timeline_label": request_row["timeline_label"],
            "urgency": request_row["urgency"],
        },
        "farmer_offer": {
            "display_name": have_item["display_name"],
            "quantity": float(have_item["quantity"]),
            "unit": have_item["unit"],
            "reference_price_per_unit": float(offered_price["price_per_unit"]),
        },
        "farmer_need": {
            "display_name": need_item["display_name"],
            "quantity": float(need_item["quantity"]),
            "unit": need_item["unit"],
        },
        "counterparty": {
            "name": counterparty["display_name"],
            "trust_score": float(counterparty["trust_score"]),
            "distance_km": float(counterparty_offer.get("distance_km", 0)),
            "offered_item_name": counterparty_offer["item_name"],
            "offered_quantity": float(counterparty_offer["quantity"]),
            "offered_unit": counterparty_offer["unit"],
            "reference_price_per_unit": float(requested_price["price_per_unit"]),
        },
        "computed_trade": {
            "ratio_text": ratio_text,
            "meeting_point": meeting_point["name"],
            "fallback_explanation": fallback_explanation,
        },
    }
    return _compact_json(context)


def build_listing_grounding(
    *,
    crop_profile: dict[str, Any],
    planting_row: dict[str, Any],
    listing_payload: dict[str, Any],
    fallback_listing_title: str,
    fallback_listing_note: str,
    fallback_soil_vitality_label: str,
    fallback_yield_probability_label: str,
) -> str:
    context = {
        "crop_profile": {
            "crop_code": crop_profile["crop_code"],
            "label": crop_profile["label"],
            "growth_days": int(crop_profile["growth_days"]),
            "default_quality_band": crop_profile["default_quality_band"],
        },
        "planting": {
            "crop_label": planting_row["crop_label"],
            "planting_date": planting_row["planting_date"],
            "area_value": float(planting_row["area_value"]),
            "area_unit": planting_row["area_unit"],
            "area_hectares": float(planting_row["area_hectares"]),
            "input_summary": planting_row["input_summary"],
        },
        "projection": {
            "listing_title": fallback_listing_title,
            "estimated_yield_min_kg": int(listing_payload["estimated_yield_min_kg"]),
            "estimated_yield_max_kg": int(listing_payload["estimated_yield_max_kg"]),
            "harvest_window_start": listing_payload["harvest_window_start"],
            "harvest_window_end": listing_payload["harvest_window_end"],
            "quality_band": listing_payload["quality_band"],
            "confidence_score": float(listing_payload["confidence_score"]),
            "reservation_discount_pct": int(listing_payload["reservation_discount_pct"]),
            "early_incentive_label": listing_payload["early_incentive_label"],
            "fallback_listing_note": fallback_listing_note,
            "fallback_soil_vitality_label": fallback_soil_vitality_label,
            "fallback_yield_probability_label": fallback_yield_probability_label,
        },
    }
    return _compact_json(context)
