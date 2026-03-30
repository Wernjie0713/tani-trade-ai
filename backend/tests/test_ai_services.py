from __future__ import annotations

import json
import unittest
from unittest.mock import Mock

from postgrest.exceptions import APIError as PostgrestAPIError

from app.services.ai.client import GeminiAiClient, GeminiAiClientError, GeminiStructuredResult, GeminiTextResult
from app.services.ai.orchestrator import (
    AiGenerationMetadata,
    FarmerAiOrchestrator,
    FarmerAiOrchestratorError,
    IntakeAiResult,
)
from app.services.ai.schemas import (
    GeminiHarvestListingCopy,
    GeminiIntakeExtraction,
    GeminiProposalExplanation,
)
from app.services.farmer_flow import FarmerWorkflowService
from app.services.parser import ParsedBarterItem, ParsedIntake, parse_intake


class FakeGeminiClient:
    def __init__(
        self,
        *,
        parsed=None,
        model_name: str = "gemini-2.5-flash",
        error: Exception | None = None,
    ) -> None:
        self.parsed = parsed
        self.model_name = model_name
        self.error = error
        self.calls: list[dict[str, object]] = []

    def generate_structured(self, **kwargs):
        self.calls.append(kwargs)
        if self.error is not None:
            raise self.error
        return GeminiStructuredResult(parsed=self.parsed, model_name=self.model_name)

    def generate_text(self, **kwargs):
        self.calls.append(kwargs)
        if self.error is not None:
            raise self.error
        text = self.parsed if isinstance(self.parsed, str) else getattr(self.parsed, "text", "")
        return GeminiTextResult(text=text, model_name=self.model_name)


class FarmerAiOrchestratorTests(unittest.TestCase):
    def setUp(self) -> None:
        self.farmer_profile = {
            "display_name": "Pak Karim",
            "preferred_language": "bm",
            "village": "Kampung Titi Akar",
            "state": "Kedah",
        }
        self.inventory_rows = [
            {
                "item_name": "Nitrogen Fertilizer",
                "normalized_item_name": "nitrogen_fertilizer",
                "quantity": 5,
                "unit": "bag",
            }
        ]

    def test_extract_intake_uses_structured_ai_output(self) -> None:
        client = FakeGeminiClient(
            parsed=GeminiIntakeExtraction(
                crop_code="sweet_corn",
                have_item={
                    "normalized_item_name": "nitrogen_fertilizer",
                    "quantity": 4,
                    "unit": "bags",
                },
                need_item={
                    "normalized_item_name": "organic_pesticide",
                    "quantity": 3,
                    "unit": "liters",
                },
                timeline_label="Tomorrow",
                timeline_days=1,
                radius_km=8,
                urgency="high",
                confidence=0.88,
            )
        )
        orchestrator = FarmerAiOrchestrator(
            client=client,
            primary_model="gemini-2.5-flash",
            listing_model="gemini-2.5-flash",
            fallback_enabled=True,
        )

        result = orchestrator.extract_intake(
            raw_text="I have 5 bags fertilizer and need pesticide next week.",
            farmer_profile=self.farmer_profile,
            inventory_rows=self.inventory_rows,
        )

        self.assertEqual(result.parsed_intake.crop_code, "sweet_corn")
        self.assertEqual(result.parsed_intake.have_item.quantity, 4)
        self.assertEqual(result.parsed_intake.have_item.unit, "bag")
        self.assertEqual(result.parsed_intake.need_item.unit, "liter")
        self.assertEqual(result.parsed_intake.timeline_label, "Tomorrow")
        self.assertEqual(result.parsed_intake.timeline_days, 1)
        self.assertEqual(result.parsed_intake.radius_km, 8.0)
        self.assertEqual(result.parsed_intake.urgency, "high")
        self.assertEqual(result.parsed_intake.confidence, 0.88)
        self.assertFalse(result.metadata.fallback_used)
        self.assertEqual(result.metadata.model_name, "gemini-2.5-flash")
        self.assertEqual(len(client.calls), 1)

    def test_extract_intake_falls_back_when_gemini_fails(self) -> None:
        client = FakeGeminiClient(error=GeminiAiClientError("timeout"))
        orchestrator = FarmerAiOrchestrator(
            client=client,
            primary_model="gemini-2.5-flash",
            listing_model="gemini-2.5-flash",
            fallback_enabled=True,
        )
        raw_text = "Saya ada 5 bags baja nitrogen lebih dan perlukan racun organik minggu depan."

        result = orchestrator.extract_intake(
            raw_text=raw_text,
            farmer_profile=self.farmer_profile,
            inventory_rows=self.inventory_rows,
        )

        self.assertEqual(result.parsed_intake, parse_intake(raw_text))
        self.assertTrue(result.metadata.fallback_used)
        self.assertEqual(result.metadata.fallback_reason, "timeout")

    def test_extract_intake_raises_when_fallback_disabled(self) -> None:
        client = FakeGeminiClient(error=GeminiAiClientError("invalid json"))
        orchestrator = FarmerAiOrchestrator(
            client=client,
            primary_model="gemini-2.5-flash",
            listing_model="gemini-2.5-flash",
            fallback_enabled=False,
        )

        with self.assertRaises(FarmerAiOrchestratorError):
            orchestrator.extract_intake(
                raw_text="I have fertilizer and need pesticide.",
                farmer_profile=self.farmer_profile,
                inventory_rows=self.inventory_rows,
            )

    def test_generate_proposal_copy_falls_back_when_gemini_fails(self) -> None:
        client = FakeGeminiClient(error=GeminiAiClientError("proposal unavailable"))
        orchestrator = FarmerAiOrchestrator(
            client=client,
            primary_model="gemini-2.5-flash",
            listing_model="gemini-2.5-flash",
            fallback_enabled=True,
        )
        fallback_explanation = "Value parity uses seeded market references."

        result = orchestrator.generate_proposal_copy(
            request_row={"crop_label": "Paddy (MR269)", "timeline_label": "Next Week", "urgency": "medium"},
            have_item={"display_name": "Nitrogen Fertilizer", "quantity": 5, "unit": "bag"},
            need_item={"display_name": "Organic Pesticide", "quantity": 3, "unit": "liter"},
            counterparty={"display_name": "Pak Abu", "trust_score": 4.8},
            counterparty_offer={"item_name": "Organic Pesticide", "quantity": 15, "unit": "liter", "distance_km": 2.4},
            offered_price={"price_per_unit": 30},
            requested_price={"price_per_unit": 50},
            ratio_text="1 bag Nitrogen Fertilizer = 0.6 liter Organic Pesticide",
            meeting_point={"name": "Kampung Baru Center"},
            fallback_explanation=fallback_explanation,
        )

        self.assertEqual(result.explanation, fallback_explanation)
        self.assertTrue(result.metadata.fallback_used)

    def test_generate_listing_copy_uses_structured_ai_output(self) -> None:
        client = FakeGeminiClient(
            parsed=GeminiHarvestListingCopy(
                listing_title="Projected Premium Paddy Supply",
                listing_note="Projected paddy supply with tracked inputs and a clear reservation window.",
                soil_vitality_label="Balanced Soil",
                yield_probability_label="High Readiness",
            )
        )
        orchestrator = FarmerAiOrchestrator(
            client=client,
            primary_model="gemini-2.5-flash",
            listing_model="gemini-2.5-flash",
            fallback_enabled=True,
        )

        result = orchestrator.generate_listing_copy(
            crop_profile={
                "crop_code": "paddy",
                "label": "Paddy (MR269)",
                "growth_days": 110,
                "default_quality_band": "Grade A",
            },
            planting_row={
                "crop_label": "Paddy (MR269)",
                "planting_date": "2026-04-01",
                "area_value": 2.5,
                "area_unit": "hectares",
                "area_hectares": 2.5,
                "input_summary": "Organic fertilizer and measured irrigation",
            },
            listing_payload={
                "estimated_yield_min_kg": 10000,
                "estimated_yield_max_kg": 12000,
                "harvest_window_start": "2026-07-13",
                "harvest_window_end": "2026-07-27",
                "quality_band": "Grade A Premium",
                "confidence_score": 94.8,
                "reservation_discount_pct": 10,
                "early_incentive_label": "10% off for reservations",
            },
            fallback_listing_title="Future Paddy Supply",
            fallback_listing_note="Fallback note",
            fallback_soil_vitality_label="Optimal Nitrate",
            fallback_yield_probability_label="Grade A Premium",
        )

        self.assertEqual(result.listing_title, "Projected Premium Paddy Supply")
        self.assertEqual(result.soil_vitality_label, "Balanced Soil")
        self.assertEqual(result.yield_probability_label, "High Readiness")
        self.assertFalse(result.metadata.fallback_used)

    def test_generate_proposal_copy_uses_text_output(self) -> None:
        client = FakeGeminiClient(parsed="Fair trade based on seeded market references and practical handover quantities.")
        orchestrator = FarmerAiOrchestrator(
            client=client,
            primary_model="gemini-2.5-flash",
            listing_model="gemini-2.5-flash",
            fallback_enabled=True,
        )

        result = orchestrator.generate_proposal_copy(
            request_row={"crop_label": "Paddy (MR269)", "timeline_label": "Next Week", "urgency": "medium"},
            have_item={"display_name": "Nitrogen Fertilizer", "quantity": 5, "unit": "bag"},
            need_item={"display_name": "Organic Pesticide", "quantity": 3, "unit": "liter"},
            counterparty={"display_name": "Pak Abu", "trust_score": 4.8},
            counterparty_offer={"item_name": "Organic Pesticide", "quantity": 15, "unit": "liter", "distance_km": 2.4},
            offered_price={"price_per_unit": 30},
            requested_price={"price_per_unit": 50},
            ratio_text="1 bag Nitrogen Fertilizer = 0.6 liter Organic Pesticide",
            meeting_point={"name": "Kampung Baru Center"},
            fallback_explanation="Fallback explanation",
        )

        self.assertEqual(
            result.explanation,
            "Fair trade based on seeded market references and practical handover quantities.",
        )
        self.assertFalse(result.metadata.fallback_used)


class GeminiAiClientParsingTests(unittest.TestCase):
    def test_intake_schema_avoids_exclusive_minimum_keywords(self) -> None:
        schema_json = json.dumps(GeminiIntakeExtraction.model_json_schema())
        self.assertNotIn("exclusiveMinimum", schema_json)

    def test_coerce_parsed_response_extracts_json_after_preamble(self) -> None:
        client = GeminiAiClient.__new__(GeminiAiClient)
        response = type("FakeResponse", (), {"text": 'Here is the JSON requested:\n{"explanation":"Fair trade based on current reference values."}'})()

        parsed = client._coerce_parsed_response(GeminiProposalExplanation, response)

        self.assertEqual(parsed.explanation, "Fair trade based on current reference values.")

    def test_coerce_parsed_response_extracts_fenced_json(self) -> None:
        client = GeminiAiClient.__new__(GeminiAiClient)
        response = type(
            "FakeResponse",
            (),
            {"text": '```json\n{"listing_title":"Projected Paddy Supply","listing_note":"Projected volume based on planted area.","soil_vitality_label":"Balanced Soil","yield_probability_label":"High Readiness"}\n```'},
        )()

        parsed = client._coerce_parsed_response(GeminiHarvestListingCopy, response)

        self.assertEqual(parsed.listing_title, "Projected Paddy Supply")
        self.assertEqual(parsed.soil_vitality_label, "Balanced Soil")


class FarmerWorkflowServiceAiWiringTests(unittest.TestCase):
    def test_create_intake_uses_orchestrator_output(self) -> None:
        repo = Mock()
        repo.get_profile.return_value = {
            "id": "11111111-1111-1111-1111-111111111111",
            "display_name": "Pak Karim",
            "village": "Kampung Titi Akar",
            "state": "Kedah",
            "preferred_language": "bm",
            "trust_score": 4.4,
        }
        repo.list_inventory_by_owner.return_value = []
        repo.count_candidate_inventory.return_value = 2

        parsed = ParsedIntake(
            raw_text="I have fertilizer and need pesticide.",
            crop_code="paddy",
            crop_label="Paddy (MR269)",
            timeline_label="Tomorrow",
            timeline_days=1,
            radius_km=6.0,
            urgency="high",
            confidence=0.91,
            have_item=ParsedBarterItem(
                normalized_name="nitrogen_fertilizer",
                display_name="Nitrogen Fertilizer",
                category="fertilizer",
                quantity=5,
                unit="bag",
            ),
            need_item=ParsedBarterItem(
                normalized_name="organic_pesticide",
                display_name="Organic Pesticide",
                category="pesticide",
                quantity=3,
                unit="liter",
            ),
        )
        repo.create_barter_request.return_value = {
            "id": "request-123",
            "farmer_profile_id": "11111111-1111-1111-1111-111111111111",
            "raw_text": parsed.raw_text,
            "crop_code": parsed.crop_code,
            "crop_label": parsed.crop_label,
            "timeline_label": parsed.timeline_label,
            "timeline_days": parsed.timeline_days,
            "radius_km": parsed.radius_km,
            "urgency": parsed.urgency,
            "parsed_confidence": parsed.confidence,
            "market_opportunity_count": 2,
            "status": "parsed",
        }
        repo.get_barter_request.return_value = repo.create_barter_request.return_value
        repo.list_barter_request_items.return_value = [
            {
                "item_role": "have",
                "normalized_name": parsed.have_item.normalized_name,
                "display_name": parsed.have_item.display_name,
                "category": parsed.have_item.category,
                "quantity": parsed.have_item.quantity,
                "unit": parsed.have_item.unit,
            },
            {
                "item_role": "need",
                "normalized_name": parsed.need_item.normalized_name,
                "display_name": parsed.need_item.display_name,
                "category": parsed.need_item.category,
                "quantity": parsed.need_item.quantity,
                "unit": parsed.need_item.unit,
            },
        ]

        ai_orchestrator = Mock()
        ai_orchestrator.extract_intake.return_value = IntakeAiResult(
            parsed_intake=parsed,
            metadata=AiGenerationMetadata(
                model_name="gemini-2.5-flash",
                prompt_version="intake-v1",
            ),
        )

        service = FarmerWorkflowService(
            repo=repo,
            demo_farmer_profile_id="11111111-1111-1111-1111-111111111111",
            ai_orchestrator=ai_orchestrator,
        )

        response = service.create_intake("I have fertilizer and need pesticide.")

        ai_orchestrator.extract_intake.assert_called_once()
        self.assertEqual(response.request_id, "request-123")
        self.assertEqual(response.timeline_label, "Tomorrow")
        self.assertEqual(response.have_item.display_name, "Nitrogen Fertilizer")
        self.assertEqual(response.need_item.display_name, "Organic Pesticide")

    def test_get_or_create_proposal_returns_existing_row_after_duplicate_insert(self) -> None:
        repo = Mock()
        repo.get_match.return_value = {
            "id": "match-123",
            "request_id": "request-123",
            "counterparty_profile_id": "counterparty-123",
            "distance_km": 2.4,
            "snapshot": {
                "offered_item_name": "Organic Pesticide",
                "offered_item_normalized_name": "organic_pesticide",
                "offered_quantity": 15,
                "offered_unit": "liter",
            },
        }
        repo.get_barter_request.return_value = {
            "id": "request-123",
            "farmer_profile_id": "11111111-1111-1111-1111-111111111111",
            "crop_label": "Paddy (MR269)",
            "timeline_label": "Next Week",
            "urgency": "medium",
        }
        repo.list_barter_request_items.return_value = [
            {
                "item_role": "have",
                "normalized_name": "nitrogen_fertilizer",
                "display_name": "Nitrogen Fertilizer",
                "category": "fertilizer",
                "quantity": 5,
                "unit": "bag",
            },
            {
                "item_role": "need",
                "normalized_name": "organic_pesticide",
                "display_name": "Organic Pesticide",
                "category": "pesticide",
                "quantity": 3,
                "unit": "liter",
            },
        ]
        repo.get_profile.side_effect = [
            {
                "id": "counterparty-123",
                "display_name": "Pak Abu",
                "trust_score": 4.8,
                "latitude": 5.67,
                "longitude": 100.50,
                "avatar_url": None,
            },
            {
                "id": "11111111-1111-1111-1111-111111111111",
                "display_name": "Pak Karim",
                "trust_score": 4.4,
                "latitude": 5.66,
                "longitude": 100.50,
            },
        ]
        repo.get_market_price_reference.side_effect = [
            {"price_per_unit": 30},
            {"price_per_unit": 50},
        ]
        repo.list_meeting_points.return_value = [
            {"id": "meeting-1", "name": "Kampung Baru Center", "latitude": 5.665, "longitude": 100.501},
        ]
        repo.create_proposal.side_effect = PostgrestAPIError(
            {
                "message": "duplicate key value violates unique constraint",
                "code": "23505",
                "hint": None,
                "details": "Key (match_id) already exists.",
            }
        )
        repo.get_existing_proposal_for_match.side_effect = [
            None,
            {
                "id": "proposal-123",
                "request_id": "request-123",
                "match_id": "match-123",
                "document_number": "TT-MATCH123-AI",
                "created_at": "2026-03-30T08:00:00+00:00",
                "offer_item_name": "Nitrogen Fertilizer",
                "offer_quantity": 5,
                "offer_unit": "bag",
                "requested_item_name": "Organic Pesticide",
                "requested_quantity": 3,
                "requested_unit": "liter",
                "ratio_text": "1 bag Nitrogen Fertilizer = 0.6 liter Organic Pesticide",
                "valuation_confidence": 0.94,
                "explanation": "Existing proposal",
                "meeting_point_name": "Kampung Baru Center",
                "meeting_label": "Tomorrow - 09:00 AM",
                "meeting_at": "2026-03-31T09:00:00+08:00",
                "snapshot": {"counterparty_name": "Pak Abu"},
            },
        ]
        repo.get_trade_by_proposal.return_value = None

        ai_orchestrator = Mock()
        ai_orchestrator.generate_proposal_copy.return_value = Mock(
            explanation="AI explanation",
            metadata=Mock(to_snapshot=Mock(return_value={"provider": "gemini"})),
        )

        service = FarmerWorkflowService(
            repo=repo,
            demo_farmer_profile_id="11111111-1111-1111-1111-111111111111",
            ai_orchestrator=ai_orchestrator,
        )

        response = service.get_or_create_proposal("match-123")

        self.assertEqual(response.proposal_id, "proposal-123")
        self.assertEqual(response.explanation, "Existing proposal")


if __name__ == "__main__":
    unittest.main()
