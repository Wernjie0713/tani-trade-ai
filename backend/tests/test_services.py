from __future__ import annotations

import unittest
from datetime import date

from app.services.matching import distance_score, total_match_score, trust_score
from app.services.parser import parse_intake
from app.services.projections import build_harvest_projection


class IntakeParserTests(unittest.TestCase):
    def test_parse_english_intake(self) -> None:
        parsed = parse_intake(
            "I am planting paddy next week. I have 50kg extra nitrogen fertilizer. I need pesticide within 5km.",
        )

        self.assertEqual(parsed.crop_code, "paddy")
        self.assertTrue(parsed.crop_detected)
        self.assertEqual(parsed.crop_display_label, "Paddy (MR269)")
        self.assertEqual(parsed.timeline_label, "Next Week")
        self.assertEqual(parsed.radius_km, 5.0)
        self.assertEqual(parsed.have_item.normalized_name, "nitrogen_fertilizer")
        self.assertEqual(parsed.have_item.quantity, 50.0)
        self.assertEqual(parsed.have_item.unit, "kg")
        self.assertEqual(parsed.need_item.normalized_name, "organic_pesticide")
        self.assertGreaterEqual(parsed.confidence, 0.9)

    def test_parse_bahasa_intake(self) -> None:
        parsed = parse_intake(
            "Saya ada 5 bags baja nitrogen lebih dan perlukan racun organik minggu depan.",
        )

        self.assertEqual(parsed.timeline_label, "Next Week")
        self.assertEqual(parsed.have_item.normalized_name, "nitrogen_fertilizer")
        self.assertEqual(parsed.have_item.quantity, 5.0)
        self.assertEqual(parsed.have_item.unit, "bag")
        self.assertEqual(parsed.need_item.normalized_name, "organic_pesticide")

    def test_parse_without_crop_keeps_internal_default_but_marks_not_detected(self) -> None:
        parsed = parse_intake(
            "I have 5 bags of surplus fertilizer and I need organic pesticide.",
        )

        self.assertEqual(parsed.crop_code, "paddy")
        self.assertFalse(parsed.crop_detected)
        self.assertIsNone(parsed.crop_display_label)

    def test_parse_extended_aliases(self) -> None:
        parsed = parse_intake(
            "Saya tanam cili dan ada 2 roll mulch sheet lebih, perlukan racun kulat minggu ini.",
        )

        self.assertEqual(parsed.crop_code, "chili")
        self.assertEqual(parsed.have_item.normalized_name, "mulch_sheet")
        self.assertEqual(parsed.need_item.normalized_name, "fungicide")
        self.assertEqual(parsed.timeline_label, "This Week")


class MatchingTests(unittest.TestCase):
    def test_total_match_score_prefers_exact_need_and_trust(self) -> None:
        near_distance_points = distance_score(distance_km=1.2, radius_km=5.0)
        trusted_points = trust_score(4.8)
        strong_total, exact_points, reciprocal_points = total_match_score(
            exact_need_match=True,
            reciprocal_need_match=True,
            distance_points=near_distance_points,
            trust_points=trusted_points,
        )

        weak_total, _, _ = total_match_score(
            exact_need_match=False,
            reciprocal_need_match=False,
            distance_points=distance_score(distance_km=4.9, radius_km=5.0),
            trust_points=trust_score(2.0),
        )

        self.assertEqual(exact_points, 50)
        self.assertEqual(reciprocal_points, 25)
        self.assertGreater(strong_total, weak_total)


class HarvestProjectionTests(unittest.TestCase):
    def test_projection_returns_stable_range_and_labels(self) -> None:
        crop_profile = {
            "crop_code": "paddy",
            "label": "Paddy (MR269)",
            "growth_days": 110,
            "yield_min_kg_per_hectare": 4200,
            "yield_max_kg_per_hectare": 5600,
            "default_quality_band": "Grade A",
        }

        projection = build_harvest_projection(
            crop_profile=crop_profile,
            planting_date=date(2026, 4, 1),
            area_value=2.5,
            area_unit="hectares",
            input_summary="Organic fertilizer and premium pesticide treatment",
        )

        self.assertEqual(projection.area_hectares, 2.5)
        self.assertGreater(projection.estimated_yield_max_kg, projection.estimated_yield_min_kg)
        self.assertEqual(projection.quality_band, "Grade A Premium")
        self.assertEqual(projection.soil_vitality_label, "Optimal Nitrate")
        self.assertEqual(projection.reservation_discount_pct, 10)
        self.assertEqual(projection.harvest_window_start.isoformat(), "2026-07-13")
        self.assertEqual(projection.harvest_window_end.isoformat(), "2026-07-27")


if __name__ == "__main__":
    unittest.main()
