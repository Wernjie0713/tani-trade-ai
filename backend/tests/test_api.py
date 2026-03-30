from __future__ import annotations

import unittest
from datetime import date, datetime, timezone

from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.api.deps import get_farmer_workflow_service
from app.main import app
from app.schemas.farmer_flow import (
    ActiveFlowIds,
    BarterItemDto,
    BuyerPreview,
    DemoBootstrapResponse,
    DemoProfile,
    HarvestListingResponse,
    IntakeSummaryResponse,
    MatchCardResponse,
    MatchesResponse,
    ProposalResponse,
    TradeResponse,
)

REQUEST_ID = "request-123"
MATCH_ID = "match-123"
PROPOSAL_ID = "proposal-123"
TRADE_ID = "trade-123"
LISTING_ID = "listing-123"
PLANTING_ID = "planting-123"


class FakeFarmerWorkflowService:
    def get_bootstrap(self) -> DemoBootstrapResponse:
        return DemoBootstrapResponse(
            profile=DemoProfile(
                id="11111111-1111-1111-1111-111111111111",
                display_name="Pak Karim",
                village="Kampung Baru",
                state="Kedah",
                preferred_language="bm",
                trust_score=4.9,
            ),
            quick_prompts=[
                "I have surplus fertilizer and need pesticide",
            ],
            active_flow=ActiveFlowIds(),
        )

    def create_intake(self, raw_text: str) -> IntakeSummaryResponse:
        if not raw_text.strip():
            raise HTTPException(status_code=400, detail="raw_text is required.")
        return self.get_intake(REQUEST_ID)

    def get_intake(self, request_id: str) -> IntakeSummaryResponse:
        if request_id != REQUEST_ID:
            raise HTTPException(status_code=404, detail="Barter request not found.")
        return IntakeSummaryResponse(
            request_id=REQUEST_ID,
            farmer_profile_id="11111111-1111-1111-1111-111111111111",
            raw_text="I have 5 bags fertilizer and need pesticide.",
            crop_code="paddy",
            crop_label="Paddy (MR269)",
            timeline_label="Next Week",
            timeline_days=7,
            radius_km=5.0,
            urgency="medium",
            parsed_confidence=0.98,
            market_opportunity_count=3,
            status="parsed",
            have_item=BarterItemDto(
                normalized_name="nitrogen_fertilizer",
                display_name="Nitrogen Fertilizer",
                category="fertilizer",
                quantity=5,
                unit="bag",
            ),
            need_item=BarterItemDto(
                normalized_name="organic_pesticide",
                display_name="Organic Pesticide",
                category="pesticide",
                quantity=3,
                unit="liter",
            ),
        )

    def get_or_create_matches(self, request_id: str) -> MatchesResponse:
        if request_id != REQUEST_ID:
            raise HTTPException(status_code=404, detail="Barter request not found.")
        return MatchesResponse(
            request_id=REQUEST_ID,
            total_candidates=1,
            matches=[
                MatchCardResponse(
                    match_id=MATCH_ID,
                    counterparty_profile_id="22222222-2222-2222-2222-222222222222",
                    counterparty_name="Pak Abu",
                    counterparty_avatar_url="https://api.dicebear.com/9.x/lorelei/svg?seed=PakAbu",
                    distance_km=2.4,
                    total_score=95,
                    exact_need_score=50,
                    reciprocal_need_score=25,
                    distance_score=12,
                    trust_score=8,
                    offered_item_name="Organic Pesticide",
                    offered_quantity=15,
                    offered_unit="liter",
                    desired_item_name="Nitrogen Fertilizer",
                    desired_item_priority="Immediate priority",
                    rationale="Pak Abu can supply Organic Pesticide and is a strong reciprocal fit.",
                    insight="Pak Abu's pesticide directly addresses the farmer's shortage.",
                    is_optimized=True,
                ),
            ],
        )

    def get_or_create_proposal(self, match_id: str) -> ProposalResponse:
        if match_id != MATCH_ID:
            raise HTTPException(status_code=404, detail="Match not found.")
        return ProposalResponse(
            proposal_id=PROPOSAL_ID,
            request_id=REQUEST_ID,
            match_id=MATCH_ID,
            counterparty_name="Pak Abu",
            document_number="TT-MATCH123-AI",
            generated_at=datetime(2026, 3, 30, 14, 2, tzinfo=timezone.utc),
            offer_item_name="Nitrogen Fertilizer",
            offer_quantity=5,
            offer_unit="bag",
            requested_item_name="Organic Pesticide",
            requested_quantity=3,
            requested_unit="liter",
            ratio_text="1 bag Nitrogen Fertilizer = 0.6 liter Organic Pesticide",
            valuation_confidence=0.94,
            explanation="Seeded market references place both items in a fair exchange band.",
            meeting_point_name="Kampung Baru Center",
            meeting_label="Tomorrow - 09:00 AM",
            meeting_at=datetime(2026, 3, 31, 9, 0, tzinfo=timezone.utc),
            trade_id=None,
        )

    def accept_proposal(self, proposal_id: str) -> TradeResponse:
        if proposal_id == "proposal-conflict":
            raise HTTPException(status_code=409, detail="This proposal can no longer be accepted.")
        if proposal_id != PROPOSAL_ID:
            raise HTTPException(status_code=404, detail="Proposal not found.")
        return self.get_trade(TRADE_ID)

    def get_trade(self, trade_id: str) -> TradeResponse:
        if trade_id != TRADE_ID:
            raise HTTPException(status_code=404, detail="Trade not found.")
        return TradeResponse(
            trade_id=TRADE_ID,
            proposal_id=PROPOSAL_ID,
            request_id=REQUEST_ID,
            transaction_code="TRD-ABCDE123",
            counterparty_name="Pak Abu",
            trade_status="accepted",
            offer_item_name="Nitrogen Fertilizer",
            offer_quantity=5,
            offer_unit="bag",
            requested_item_name="Organic Pesticide",
            requested_quantity=3,
            requested_unit="liter",
            meeting_point_name="Kampung Baru Center",
            meeting_at=datetime(2026, 3, 31, 9, 0, tzinfo=timezone.utc),
            projected_yield_uplift_pct=15,
            planting_prompt="Start logging planting details to generate your harvest listing.",
            created_at=datetime(2026, 3, 30, 14, 5, tzinfo=timezone.utc),
        )

    def create_or_update_planting(self, trade_id: str, payload) -> HarvestListingResponse:
        if trade_id != TRADE_ID:
            raise HTTPException(status_code=404, detail="Trade not found.")
        return self.get_harvest_listing(LISTING_ID)

    def get_harvest_listing(self, listing_id: str) -> HarvestListingResponse:
        if listing_id != LISTING_ID:
            raise HTTPException(status_code=404, detail="Harvest listing not found.")
        return HarvestListingResponse(
            planting_record_id=PLANTING_ID,
            harvest_listing_id=LISTING_ID,
            crop_code="paddy",
            crop_label="Paddy (MR269)",
            listing_title="Future Paddy Supply",
            estimated_yield_min_kg=500,
            estimated_yield_max_kg=620,
            harvest_window_label="Late Jul 2026",
            harvest_window_start=date(2026, 7, 20),
            harvest_window_end=date(2026, 8, 3),
            quality_band="Grade A Premium",
            confidence_score=94.8,
            reservation_discount_pct=10,
            early_incentive_label="10% off for reservations",
            listing_note="High-quality crop grown with carefully tracked inputs.",
            soil_vitality_label="Optimal Nitrate",
            yield_probability_label="Grade A Premium",
            buyer_interest_count=2,
            buyer_previews=[
                BuyerPreview(
                    buyer_name="Mak Teh Grocer",
                    avatar_url="https://api.dicebear.com/9.x/lorelei/svg?seed=MakTeh",
                ),
                BuyerPreview(
                    buyer_name="Warung Nusantara",
                    avatar_url="https://api.dicebear.com/9.x/lorelei/svg?seed=WarungNusantara",
                ),
            ],
            status="draft",
        )


class FarmerApiRouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.fake_service = FakeFarmerWorkflowService()
        app.dependency_overrides[get_farmer_workflow_service] = lambda: self.fake_service
        self.client = TestClient(app)

    def tearDown(self) -> None:
        app.dependency_overrides.clear()

    def test_happy_path_farmer_flow(self) -> None:
        bootstrap = self.client.get("/api/v1/demo/bootstrap")
        self.assertEqual(bootstrap.status_code, 200)
        self.assertEqual(bootstrap.json()["profile"]["display_name"], "Pak Karim")

        intake = self.client.post(
            "/api/v1/farmer/intakes",
            json={"raw_text": "I have fertilizer and need pesticide"},
        )
        self.assertEqual(intake.status_code, 200)
        request_id = intake.json()["request_id"]

        matches = self.client.post(f"/api/v1/farmer/intakes/{request_id}/matches")
        self.assertEqual(matches.status_code, 200)
        match_id = matches.json()["matches"][0]["match_id"]

        proposal = self.client.post(f"/api/v1/farmer/matches/{match_id}/proposal")
        self.assertEqual(proposal.status_code, 200)
        proposal_id = proposal.json()["proposal_id"]

        accepted_trade = self.client.post(f"/api/v1/farmer/proposals/{proposal_id}/accept")
        self.assertEqual(accepted_trade.status_code, 200)
        trade_id = accepted_trade.json()["trade_id"]

        trade = self.client.get(f"/api/v1/farmer/trades/{trade_id}")
        self.assertEqual(trade.status_code, 200)
        self.assertEqual(trade.json()["transaction_code"], "TRD-ABCDE123")

        planting = self.client.post(
            f"/api/v1/farmer/trades/{trade_id}/planting",
            json={
                "crop_type": "Paddy (MR269)",
                "planting_date": "2026-04-01",
                "area_value": 2.5,
                "area_unit": "hectares",
                "input_summary": "Organic fertilizer and pesticide treatment",
            },
        )
        self.assertEqual(planting.status_code, 200)
        listing_id = planting.json()["harvest_listing_id"]

        listing = self.client.get(f"/api/v1/farmer/harvest-listings/{listing_id}")
        self.assertEqual(listing.status_code, 200)
        self.assertEqual(listing.json()["buyer_interest_count"], 2)

    def test_missing_request_returns_404(self) -> None:
        response = self.client.get("/api/v1/farmer/intakes/missing-request")
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()["detail"], "Barter request not found.")

    def test_invalid_workflow_transition_returns_409(self) -> None:
        response = self.client.post("/api/v1/farmer/proposals/proposal-conflict/accept")
        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.json()["detail"], "This proposal can no longer be accepted.")


if __name__ == "__main__":
    unittest.main()
