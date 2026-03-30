from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta


@dataclass(slots=True)
class HarvestProjection:
    area_hectares: float
    estimated_yield_min_kg: int
    estimated_yield_max_kg: int
    harvest_window_start: date
    harvest_window_end: date
    quality_band: str
    confidence_score: float
    soil_vitality_label: str
    yield_probability_label: str
    reservation_discount_pct: int
    early_incentive_label: str
    listing_note: str


def convert_area_to_hectares(area_value: float, area_unit: str) -> float:
    normalized_unit = area_unit.strip().lower()
    if normalized_unit in {"hectare", "hectares", "ha"}:
        return area_value
    if normalized_unit in {"acre", "acres"}:
        return round(area_value * 0.404686, 4)
    if normalized_unit in {"sqm", "m2", "square meter", "square meters"}:
        return round(area_value / 10000, 4)
    return area_value


def build_harvest_projection(
    crop_profile: dict,
    planting_date: date,
    area_value: float,
    area_unit: str,
    input_summary: str,
) -> HarvestProjection:
    area_hectares = convert_area_to_hectares(area_value, area_unit)
    normalized_summary = input_summary.strip().lower()
    organic_bonus = 1.08 if any(word in normalized_summary for word in ("organic", "bio", "premium")) else 1.0
    confidence_score = 94.8 if organic_bonus > 1 else 91.5

    estimated_yield_min = crop_profile["yield_min_kg_per_hectare"] * area_hectares * organic_bonus
    estimated_yield_max = crop_profile["yield_max_kg_per_hectare"] * area_hectares * organic_bonus

    growth_days = int(crop_profile["growth_days"])
    harvest_center = planting_date + timedelta(days=growth_days)
    harvest_window_start = harvest_center - timedelta(days=7)
    harvest_window_end = harvest_center + timedelta(days=7)

    quality_band = "Grade A Premium" if organic_bonus > 1 else crop_profile["default_quality_band"]
    soil_vitality_label = "Optimal Nitrate" if organic_bonus > 1 else "Stable Soil Health"
    yield_probability_label = quality_band
    reservation_discount_pct = 10
    early_incentive_label = f"{reservation_discount_pct}% off for reservations"

    listing_note = (
        "High-quality crop grown with carefully tracked inputs. "
        "Projection generated from seeded crop baselines and planted area."
    )

    return HarvestProjection(
        area_hectares=round(area_hectares, 2),
        estimated_yield_min_kg=int(round(estimated_yield_min / 10) * 10),
        estimated_yield_max_kg=int(round(estimated_yield_max / 10) * 10),
        harvest_window_start=harvest_window_start,
        harvest_window_end=harvest_window_end,
        quality_band=quality_band,
        confidence_score=confidence_score,
        soil_vitality_label=soil_vitality_label,
        yield_probability_label=yield_probability_label,
        reservation_discount_pct=reservation_discount_pct,
        early_incentive_label=early_incentive_label,
        listing_note=listing_note,
    )
