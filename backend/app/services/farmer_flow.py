from __future__ import annotations

from datetime import date, datetime, timedelta
from typing import Any
from zoneinfo import ZoneInfo

from fastapi import HTTPException, status

from app.repositories.farmer_workflow import FarmerWorkflowRepository
from app.schemas.farmer_flow import (
    ActiveFlowIds,
    BarterItemDto,
    DemoBootstrapResponse,
    DemoProfile,
    BuyerPreview,
    HarvestListingResponse,
    MatchCardResponse,
    MatchesResponse,
    PlantingCreateRequest,
    ProposalResponse,
    IntakeSummaryResponse,
    TradeResponse,
)
from app.services.ai.orchestrator import FarmerAiOrchestrator
from app.services.catalog import crop_label, find_crop_code
from app.services.matching import distance_score, haversine_km, total_match_score, trust_score
from app.services.parser import parse_intake
from app.services.projections import build_harvest_projection

KL_TIMEZONE = ZoneInfo("Asia/Kuala_Lumpur")


class FarmerWorkflowService:
    def __init__(
        self,
        repo: FarmerWorkflowRepository,
        demo_farmer_profile_id: str,
        ai_orchestrator: FarmerAiOrchestrator | None = None,
    ) -> None:
        self.repo = repo
        self.demo_farmer_profile_id = demo_farmer_profile_id
        self.ai_orchestrator = ai_orchestrator

    def get_bootstrap(self) -> DemoBootstrapResponse:
        demo_profile = self._require_demo_farmer()
        latest_flow = self.repo.get_latest_active_flow(self.demo_farmer_profile_id)
        return DemoBootstrapResponse(
            profile=DemoProfile(
                id=demo_profile["id"],
                display_name=demo_profile["display_name"],
                village=demo_profile["village"],
                state=demo_profile["state"],
                preferred_language=demo_profile["preferred_language"],
                trust_score=float(demo_profile["trust_score"]),
            ),
            quick_prompts=[
                "I have 5 bags of surplus fertilizer and I need organic pesticide",
                "Saya ada baja nitrogen lebih dan perlukan racun organik minggu depan",
                "I need seedling trays for sweet corn planting next week",
            ],
            active_flow=ActiveFlowIds(**latest_flow),
        )

    def create_intake(self, raw_text: str) -> IntakeSummaryResponse:
        if not raw_text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="raw_text is required.",
            )

        farmer_profile = self._require_demo_farmer()
        if self.ai_orchestrator is None:
            parsed = parse_intake(raw_text)
        else:
            ai_result = self.ai_orchestrator.extract_intake(
                raw_text=raw_text,
                farmer_profile=farmer_profile,
                inventory_rows=self.repo.list_inventory_by_owner(self.demo_farmer_profile_id),
            )
            parsed = ai_result.parsed_intake
        market_opportunity_count = self.repo.count_candidate_inventory(
            parsed.need_item.normalized_name,
            self.demo_farmer_profile_id,
        )

        request_row = self.repo.create_barter_request(
            {
                "farmer_profile_id": self.demo_farmer_profile_id,
                "raw_text": parsed.raw_text,
                "crop_code": parsed.crop_code,
                "crop_label": parsed.crop_label,
                "timeline_label": parsed.timeline_label,
                "timeline_days": parsed.timeline_days,
                "radius_km": parsed.radius_km,
                "urgency": parsed.urgency,
                "parsed_confidence": parsed.confidence,
                "market_opportunity_count": market_opportunity_count,
                "status": "parsed",
            }
        )

        self.repo.create_barter_request_items(
            [
                self._item_payload(request_row["id"], "have", parsed.have_item),
                self._item_payload(request_row["id"], "need", parsed.need_item),
            ]
        )

        return self.get_intake(request_row["id"])

    def get_intake(self, request_id: str) -> IntakeSummaryResponse:
        request_row = self._require_request(request_id)
        items = self.repo.list_barter_request_items(request_id)
        items_by_role = self._items_by_role(items)

        return IntakeSummaryResponse(
            request_id=request_row["id"],
            farmer_profile_id=request_row["farmer_profile_id"],
            raw_text=request_row["raw_text"],
            crop_code=request_row["crop_code"],
            crop_label=request_row["crop_label"],
            timeline_label=request_row["timeline_label"],
            timeline_days=int(request_row["timeline_days"]),
            radius_km=float(request_row["radius_km"]),
            urgency=request_row["urgency"],
            parsed_confidence=float(request_row["parsed_confidence"]),
            market_opportunity_count=int(request_row["market_opportunity_count"]),
            status=request_row["status"],
            have_item=BarterItemDto(**items_by_role["have"]),
            need_item=BarterItemDto(**items_by_role["need"]),
        )

    def get_or_create_matches(self, request_id: str) -> MatchesResponse:
        request_row = self._require_request(request_id)
        existing_matches = self.repo.list_matches(request_id)
        if existing_matches:
            return self._build_matches_response(request_row, existing_matches)

        farmer_profile = self._require_demo_farmer()
        items_by_role = self._items_by_role(self.repo.list_barter_request_items(request_id))
        need_item = items_by_role["need"]
        have_item = items_by_role["have"]

        candidates = self.repo.list_candidate_inventory(
            need_item["normalized_name"],
            need_item["category"],
            self.demo_farmer_profile_id,
        )
        profiles = self.repo.get_profiles_by_ids([row["owner_profile_id"] for row in candidates])

        ranked_candidates = []
        for candidate in candidates:
            counterparty = profiles.get(candidate["owner_profile_id"])
            if counterparty is None:
                continue

            candidate_distance_km = haversine_km(
                float(farmer_profile["latitude"]),
                float(farmer_profile["longitude"]),
                float(counterparty["latitude"]),
                float(counterparty["longitude"]),
            )
            if candidate_distance_km > float(request_row["radius_km"]):
                continue

            total_score_value, exact_need_points, reciprocal_points = total_match_score(
                exact_need_match=candidate["normalized_item_name"] == need_item["normalized_name"],
                reciprocal_need_match=candidate.get("desired_item_name") == have_item["normalized_name"],
                distance_points=distance_score(candidate_distance_km, float(request_row["radius_km"])),
                trust_points=trust_score(float(counterparty["trust_score"])),
            )
            ranked_candidates.append(
                (
                    total_score_value,
                    candidate_distance_km,
                    exact_need_points,
                    reciprocal_points,
                    candidate,
                    counterparty,
                )
            )

        ranked_candidates.sort(key=lambda entry: (-entry[0], entry[1]))

        payloads = []
        for rank, (
            total_score_value,
            candidate_distance_km,
            exact_need_points,
            reciprocal_points,
            candidate,
            counterparty,
        ) in enumerate(ranked_candidates, start=1):
            trust_points = trust_score(float(counterparty["trust_score"]))
            payloads.append(
                {
                    "request_id": request_id,
                    "counterparty_profile_id": counterparty["id"],
                    "counterparty_inventory_item_id": candidate["id"],
                    "exact_need_score": exact_need_points,
                    "reciprocal_need_score": reciprocal_points,
                    "distance_score": distance_score(candidate_distance_km, float(request_row["radius_km"])),
                    "trust_score": trust_points,
                    "total_score": total_score_value,
                    "distance_km": round(candidate_distance_km, 1),
                    "rank": rank,
                    "rationale": self._build_match_rationale(counterparty["display_name"], candidate["item_name"], have_item["display_name"]),
                    "snapshot": {
                        "counterparty_name": counterparty["display_name"],
                        "counterparty_avatar_url": counterparty.get("avatar_url"),
                        "offered_item_name": candidate["item_name"],
                        "offered_item_normalized_name": candidate["normalized_item_name"],
                        "offered_quantity": float(candidate["quantity"]),
                        "offered_unit": candidate["unit"],
                        "desired_item_name": candidate.get("desired_item_name") or "",
                        "desired_priority": candidate.get("desired_priority") or "Open to trade",
                        "insight": self._build_match_insight(counterparty["display_name"], candidate["item_name"], need_item["display_name"], have_item["display_name"]),
                    },
                }
            )

        inserted_matches = self.repo.create_matches(payloads)
        self.repo.update_barter_request(
            request_id,
            {"status": "matched", "market_opportunity_count": len(inserted_matches)},
        )

        return self._build_matches_response(self._require_request(request_id), inserted_matches)

    def get_or_create_proposal(self, match_id: str) -> ProposalResponse:
        match_row = self._require_match(match_id)
        existing_proposal = self.repo.get_existing_proposal_for_match(match_id)
        if existing_proposal is not None:
            return self._build_proposal_response(existing_proposal)

        request_row = self._require_request(match_row["request_id"])
        items_by_role = self._items_by_role(self.repo.list_barter_request_items(request_row["id"]))
        have_item = items_by_role["have"]
        snapshot = match_row.get("snapshot") or {}
        counterparty = self.repo.get_profile(match_row["counterparty_profile_id"])
        if counterparty is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Counterparty not found.")

        offered_price = self.repo.get_market_price_reference(have_item["normalized_name"])
        requested_price = self.repo.get_market_price_reference(snapshot["offered_item_normalized_name"])
        if offered_price is None or requested_price is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Missing market price reference for proposal generation.",
            )

        offered_quantity = float(have_item["quantity"])
        offered_unit = have_item["unit"]
        offered_value = offered_quantity * float(offered_price["price_per_unit"])
        requested_quantity = self._round_quantity(
            min(
                offered_value / float(requested_price["price_per_unit"]),
                float(snapshot["offered_quantity"]),
            ),
            snapshot["offered_unit"],
        )
        ratio_value = round(requested_quantity / max(offered_quantity, 1), 2)
        ratio_text = (
            f"1 {offered_unit} {have_item['display_name']} = "
            f"{ratio_value} {snapshot['offered_unit']} {snapshot['offered_item_name']}"
        )

        meeting_point = self._select_meeting_point(counterparty)
        meeting_at = self._next_demo_meeting_slot()
        document_number = f"TT-{match_row['id'][:8].upper()}-AI"
        fallback_explanation = (
            f"Value parity uses seeded market references for {have_item['display_name']} and "
            f"{snapshot['offered_item_name']}. The offer is rounded to a practical "
            f"{snapshot['offered_unit']} handover amount."
        )
        proposal_explanation = fallback_explanation
        proposal_snapshot_ai = None
        if self.ai_orchestrator is not None:
            proposal_copy = self.ai_orchestrator.generate_proposal_copy(
                request_row=request_row,
                have_item=have_item,
                need_item=items_by_role["need"],
                counterparty=counterparty,
                counterparty_offer={
                    "item_name": snapshot["offered_item_name"],
                    "quantity": snapshot["offered_quantity"],
                    "unit": snapshot["offered_unit"],
                    "distance_km": float(match_row["distance_km"]),
                },
                offered_price=offered_price,
                requested_price=requested_price,
                ratio_text=ratio_text,
                meeting_point=meeting_point,
                fallback_explanation=fallback_explanation,
            )
            proposal_explanation = proposal_copy.explanation
            proposal_snapshot_ai = proposal_copy.metadata.to_snapshot()

        proposal_snapshot = {
            "counterparty_name": counterparty["display_name"],
            "counterparty_avatar_url": counterparty.get("avatar_url"),
            "offer_item_name": have_item["display_name"],
            "offer_quantity": offered_quantity,
            "offer_unit": offered_unit,
            "requested_item_name": snapshot["offered_item_name"],
            "requested_quantity": requested_quantity,
            "requested_unit": snapshot["offered_unit"],
            "ratio_text": ratio_text,
            "meeting_point_name": meeting_point["name"],
            "meeting_label": "Tomorrow - 09:00 AM",
            "document_number": document_number,
            "explanation": proposal_explanation,
        }
        if proposal_snapshot_ai is not None:
            proposal_snapshot["ai"] = proposal_snapshot_ai

        proposal_payload = {
            "request_id": request_row["id"],
            "match_id": match_row["id"],
            "counterparty_profile_id": counterparty["id"],
            "offer_item_name": have_item["display_name"],
            "offer_quantity": offered_quantity,
            "offer_unit": offered_unit,
            "requested_item_name": snapshot["offered_item_name"],
            "requested_quantity": requested_quantity,
            "requested_unit": snapshot["offered_unit"],
            "ratio_text": ratio_text,
            "valuation_confidence": 0.94,
            "explanation": proposal_explanation,
            "meeting_point_id": meeting_point["id"],
            "meeting_point_name": meeting_point["name"],
            "meeting_label": "Tomorrow - 09:00 AM",
            "meeting_at": meeting_at.isoformat(),
            "document_number": document_number,
            "status": "pending",
            "snapshot": proposal_snapshot,
        }
        proposal_row = self.repo.create_proposal(proposal_payload)
        self.repo.update_barter_request(request_row["id"], {"status": "proposed"})
        return self._build_proposal_response(proposal_row)

    def accept_proposal(self, proposal_id: str) -> TradeResponse:
        proposal = self._require_proposal(proposal_id)
        if proposal["status"] not in {"pending", "accepted"}:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This proposal can no longer be accepted.",
            )

        existing_trade = self.repo.get_trade_by_proposal(proposal_id)
        if existing_trade is not None:
            return self._build_trade_response(existing_trade)

        transaction_code = f"TRD-{proposal_id[:8].upper()}"
        snapshot = proposal.get("snapshot") or {}
        trade_row = self.repo.create_trade(
            {
                "proposal_id": proposal["id"],
                "request_id": proposal["request_id"],
                "farmer_profile_id": self.demo_farmer_profile_id,
                "counterparty_profile_id": proposal["counterparty_profile_id"],
                "status": "accepted",
                "meeting_point_name": proposal["meeting_point_name"],
                "meeting_at": proposal["meeting_at"],
                "transaction_code": transaction_code,
                "snapshot": {
                    **snapshot,
                    "transaction_code": transaction_code,
                    "projected_yield_uplift_pct": 15,
                    "planting_prompt": "Start logging planting details to generate your harvest listing.",
                },
            }
        )
        self.repo.update_proposal(proposal["id"], {"status": "accepted"})
        self.repo.update_barter_request(proposal["request_id"], {"status": "accepted"})
        return self._build_trade_response(trade_row)

    def get_trade(self, trade_id: str) -> TradeResponse:
        trade = self.repo.get_trade(trade_id)
        if trade is None or trade["farmer_profile_id"] != self.demo_farmer_profile_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trade not found.")
        return self._build_trade_response(trade)

    def create_or_update_planting(
        self,
        trade_id: str,
        payload: PlantingCreateRequest,
    ) -> HarvestListingResponse:
        trade = self.repo.get_trade(trade_id)
        if trade is None or trade["farmer_profile_id"] != self.demo_farmer_profile_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trade not found.")
        if trade["status"] != "accepted":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Planting can only be recorded for accepted trades.",
            )

        request_row = self._require_request(trade["request_id"])
        crop_input_label = payload.crop_type.strip()
        crop_code = find_crop_code(crop_input_label) or request_row["crop_code"]
        canonical_crop_label = crop_label(crop_code)
        crop_profile = self.repo.get_crop_profile(crop_code)
        if crop_profile is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"No crop profile configured for {crop_code}.",
            )

        projection = build_harvest_projection(
            crop_profile=crop_profile,
            planting_date=payload.planting_date,
            area_value=payload.area_value,
            area_unit=payload.area_unit,
            input_summary=payload.input_summary,
        )

        fallback_listing_title = f"Future {crop_input_label} Supply"
        fallback_listing_note = projection.listing_note
        fallback_soil_vitality_label = projection.soil_vitality_label
        fallback_yield_probability_label = projection.yield_probability_label

        existing_planting = self.repo.get_planting_record_by_trade(trade_id)
        planting_payload = {
            "trade_id": trade_id,
            "farmer_profile_id": self.demo_farmer_profile_id,
            "crop_code": crop_code,
            "crop_label": crop_input_label,
            "planting_date": payload.planting_date.isoformat(),
            "area_value": payload.area_value,
            "area_unit": payload.area_unit,
            "area_hectares": projection.area_hectares,
            "input_summary": payload.input_summary,
            "snapshot": {
                "canonical_crop_label": canonical_crop_label,
                "soil_vitality_label": projection.soil_vitality_label,
                "yield_probability_label": projection.yield_probability_label,
            },
        }

        if existing_planting is None:
            planting_row = self.repo.create_planting_record(planting_payload)
        else:
            planting_row = self.repo.update_planting_record(existing_planting["id"], planting_payload)

        existing_listing = self.repo.get_harvest_listing_by_planting(planting_row["id"])
        listing_title = fallback_listing_title
        listing_note = fallback_listing_note
        soil_vitality_label = fallback_soil_vitality_label
        yield_probability_label = fallback_yield_probability_label
        listing_snapshot_ai = None

        listing_payload = {
            "planting_record_id": planting_row["id"],
            "farmer_profile_id": self.demo_farmer_profile_id,
            "crop_code": crop_code,
            "crop_label": crop_input_label,
            "listing_title": fallback_listing_title,
            "estimated_yield_min_kg": projection.estimated_yield_min_kg,
            "estimated_yield_max_kg": projection.estimated_yield_max_kg,
            "harvest_window_start": projection.harvest_window_start.isoformat(),
            "harvest_window_end": projection.harvest_window_end.isoformat(),
            "quality_band": projection.quality_band,
            "confidence_score": projection.confidence_score,
            "reservation_discount_pct": projection.reservation_discount_pct,
            "early_incentive_label": projection.early_incentive_label,
            "listing_note": fallback_listing_note,
            "status": "draft",
        }
        if self.ai_orchestrator is not None:
            listing_copy = self.ai_orchestrator.generate_listing_copy(
                crop_profile=crop_profile,
                planting_row=planting_row,
                listing_payload=listing_payload,
                fallback_listing_title=fallback_listing_title,
                fallback_listing_note=fallback_listing_note,
                fallback_soil_vitality_label=fallback_soil_vitality_label,
                fallback_yield_probability_label=fallback_yield_probability_label,
            )
            listing_note = listing_copy.listing_note
            listing_snapshot_ai = listing_copy.metadata.to_snapshot()

        listing_payload["listing_title"] = listing_title
        listing_payload["listing_note"] = listing_note
        listing_payload["snapshot"] = {
            "canonical_crop_label": canonical_crop_label,
            "soil_vitality_label": soil_vitality_label,
            "yield_probability_label": yield_probability_label,
        }
        if listing_snapshot_ai is not None:
            listing_payload["snapshot"]["ai"] = listing_snapshot_ai

        if existing_listing is None:
            listing_row = self.repo.create_harvest_listing(listing_payload)
        else:
            listing_row = self.repo.update_harvest_listing(existing_listing["id"], listing_payload)

        buyers = self.repo.list_buyers()[:2]
        interest_rows = self.repo.replace_listing_interests(
            listing_row["id"],
            [
                {
                    "harvest_listing_id": listing_row["id"],
                    "buyer_profile_id": buyer["id"],
                    "interest_type": "watching",
                    "reserved_quantity_kg": None,
                    "note": f"Seeded demand for {crop_input_label}",
                }
                for buyer in buyers
            ],
        )
        self.repo.update_barter_request(request_row["id"], {"status": "planted"})
        return self._build_harvest_listing_response(listing_row, interest_rows, buyers, planting_row["id"])

    def get_harvest_listing(self, listing_id: str) -> HarvestListingResponse:
        listing = self.repo.get_harvest_listing(listing_id)
        if listing is None or listing["farmer_profile_id"] != self.demo_farmer_profile_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Harvest listing not found.")

        interests = self.repo.list_listing_interests(listing_id)
        buyers = self.repo.get_profiles_by_ids([row["buyer_profile_id"] for row in interests])
        planting_row = self.repo.get_planting_record(listing["planting_record_id"])
        if planting_row is None or planting_row["farmer_profile_id"] != self.demo_farmer_profile_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Planting record not found for this harvest listing.",
            )
        return self._build_harvest_listing_response(
            listing,
            interests,
            list(buyers.values()),
            planting_row["id"],
        )

    def _require_demo_farmer(self) -> dict[str, Any]:
        demo_profile = self.repo.get_profile(self.demo_farmer_profile_id)
        if demo_profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Demo farmer profile not found. Apply the Firebase seed data first.",
            )
        return demo_profile

    def _require_request(self, request_id: str) -> dict[str, Any]:
        request_row = self.repo.get_barter_request(request_id)
        if request_row is None or request_row["farmer_profile_id"] != self.demo_farmer_profile_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Barter request not found.")
        return request_row

    def _item_payload(self, request_id: str, item_role: str, item: Any) -> dict[str, Any]:
        return {
            "request_id": request_id,
            "item_role": item_role,
            "normalized_name": item.normalized_name,
            "display_name": item.display_name,
            "category": item.category,
            "quantity": item.quantity,
            "unit": item.unit,
        }

    def _items_by_role(self, rows: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
        items = {row["item_role"]: row for row in rows}
        if "have" not in items or "need" not in items:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Barter request is missing required have/need items.",
            )
        return items

    def _coerce_datetime(self, value: str | datetime) -> datetime:
        if isinstance(value, datetime):
            return value
        return datetime.fromisoformat(value.replace("Z", "+00:00"))

    def _coerce_date(self, value: str | date) -> date:
        if isinstance(value, date):
            return value
        return date.fromisoformat(value)

    def _next_demo_meeting_slot(self) -> datetime:
        now = datetime.now(tz=KL_TIMEZONE)
        tomorrow = now.date() + timedelta(days=1)
        return datetime.combine(tomorrow, datetime.min.time(), tzinfo=KL_TIMEZONE).replace(hour=9)

    def _format_harvest_window_label(self, start: date, end: date) -> str:
        if start.month == end.month and start.year == end.year:
            if start.day <= 10:
                prefix = "Early"
            elif start.day <= 20:
                prefix = "Mid"
            else:
                prefix = "Late"
            return f"{prefix} {start.strftime('%b %Y')}"
        return f"{start.strftime('%d %b')} - {end.strftime('%d %b %Y')}"

    def _require_match(self, match_id: str) -> dict[str, Any]:
        match_row = self.repo.get_match(match_id)
        if match_row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found.")
        self._require_request(match_row["request_id"])
        return match_row

    def _require_proposal(self, proposal_id: str) -> dict[str, Any]:
        proposal = self.repo.get_proposal(proposal_id)
        if proposal is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proposal not found.")
        self._require_request(proposal["request_id"])
        return proposal

    def _build_matches_response(
        self,
        request_row: dict[str, Any],
        matches: list[dict[str, Any]],
    ) -> MatchesResponse:
        response_matches = []
        for index, match in enumerate(matches):
            snapshot = match.get("snapshot") or {}
            response_matches.append(
                MatchCardResponse(
                    match_id=match["id"],
                    counterparty_profile_id=match["counterparty_profile_id"],
                    counterparty_name=snapshot.get("counterparty_name", "Unknown Farmer"),
                    counterparty_avatar_url=snapshot.get("counterparty_avatar_url"),
                    distance_km=float(match["distance_km"]),
                    total_score=int(match["total_score"]),
                    exact_need_score=int(match["exact_need_score"]),
                    reciprocal_need_score=int(match["reciprocal_need_score"]),
                    distance_score=int(match["distance_score"]),
                    trust_score=int(match["trust_score"]),
                    offered_item_name=snapshot.get("offered_item_name", ""),
                    offered_quantity=float(snapshot.get("offered_quantity", 0)),
                    offered_unit=snapshot.get("offered_unit", "unit"),
                    desired_item_name=snapshot.get("desired_item_name", ""),
                    desired_item_priority=snapshot.get("desired_priority", "Open to trade"),
                    rationale=match["rationale"],
                    insight=snapshot.get("insight", ""),
                    is_optimized=index == 0,
                )
            )

        return MatchesResponse(
            request_id=request_row["id"],
            matches=response_matches,
            total_candidates=len(response_matches),
        )

    def _build_proposal_response(self, proposal_row: dict[str, Any]) -> ProposalResponse:
        snapshot = proposal_row.get("snapshot") or {}
        existing_trade = self.repo.get_trade_by_proposal(proposal_row["id"])
        return ProposalResponse(
            proposal_id=proposal_row["id"],
            request_id=proposal_row["request_id"],
            match_id=proposal_row["match_id"],
            counterparty_name=snapshot.get("counterparty_name", "Unknown Farmer"),
            document_number=proposal_row["document_number"],
            generated_at=self._coerce_datetime(proposal_row["created_at"]),
            offer_item_name=proposal_row["offer_item_name"],
            offer_quantity=float(proposal_row["offer_quantity"]),
            offer_unit=proposal_row["offer_unit"],
            requested_item_name=proposal_row["requested_item_name"],
            requested_quantity=float(proposal_row["requested_quantity"]),
            requested_unit=proposal_row["requested_unit"],
            ratio_text=proposal_row["ratio_text"],
            valuation_confidence=float(proposal_row["valuation_confidence"]),
            explanation=proposal_row["explanation"],
            meeting_point_name=proposal_row["meeting_point_name"],
            meeting_label=proposal_row["meeting_label"],
            meeting_at=self._coerce_datetime(proposal_row["meeting_at"]),
            trade_id=existing_trade["id"] if existing_trade else None,
        )

    def _build_trade_response(self, trade_row: dict[str, Any]) -> TradeResponse:
        snapshot = trade_row.get("snapshot") or {}
        return TradeResponse(
            trade_id=trade_row["id"],
            proposal_id=trade_row["proposal_id"],
            request_id=trade_row["request_id"],
            transaction_code=trade_row["transaction_code"],
            counterparty_name=snapshot.get("counterparty_name", "Unknown Farmer"),
            trade_status=trade_row["status"],
            offer_item_name=snapshot.get("offer_item_name", ""),
            offer_quantity=float(snapshot.get("offer_quantity", 0)),
            offer_unit=snapshot.get("offer_unit", "unit"),
            requested_item_name=snapshot.get("requested_item_name", ""),
            requested_quantity=float(snapshot.get("requested_quantity", 0)),
            requested_unit=snapshot.get("requested_unit", "unit"),
            meeting_point_name=trade_row["meeting_point_name"],
            meeting_at=self._coerce_datetime(trade_row["meeting_at"]),
            projected_yield_uplift_pct=int(snapshot.get("projected_yield_uplift_pct", 15)),
            planting_prompt=snapshot.get(
                "planting_prompt",
                "Start logging planting details to generate your harvest listing.",
            ),
            created_at=self._coerce_datetime(trade_row["created_at"]),
        )

    def _build_harvest_listing_response(
        self,
        listing_row: dict[str, Any],
        interest_rows: list[dict[str, Any]],
        buyer_rows: list[dict[str, Any]],
        planting_record_id: str,
    ) -> HarvestListingResponse:
        buyer_lookup = {buyer["id"]: buyer for buyer in buyer_rows}
        buyer_previews = [
            BuyerPreview(
                buyer_name=buyer_lookup[row["buyer_profile_id"]]["display_name"],
                avatar_url=buyer_lookup[row["buyer_profile_id"]].get("avatar_url"),
            )
            for row in interest_rows
            if row["buyer_profile_id"] in buyer_lookup
        ]
        snapshot = listing_row.get("snapshot") or {}
        harvest_window_start = self._coerce_date(listing_row["harvest_window_start"])
        harvest_window_end = self._coerce_date(listing_row["harvest_window_end"])

        return HarvestListingResponse(
            planting_record_id=planting_record_id,
            harvest_listing_id=listing_row["id"],
            crop_code=listing_row["crop_code"],
            crop_label=listing_row["crop_label"],
            listing_title=listing_row["listing_title"],
            estimated_yield_min_kg=int(listing_row["estimated_yield_min_kg"]),
            estimated_yield_max_kg=int(listing_row["estimated_yield_max_kg"]),
            harvest_window_label=self._format_harvest_window_label(harvest_window_start, harvest_window_end),
            harvest_window_start=harvest_window_start,
            harvest_window_end=harvest_window_end,
            quality_band=listing_row["quality_band"],
            confidence_score=float(listing_row["confidence_score"]),
            reservation_discount_pct=int(listing_row["reservation_discount_pct"]),
            early_incentive_label=listing_row["early_incentive_label"],
            listing_note=listing_row["listing_note"],
            soil_vitality_label=snapshot.get("soil_vitality_label", "Stable Soil Health"),
            yield_probability_label=snapshot.get("yield_probability_label", listing_row["quality_band"]),
            buyer_interest_count=len(interest_rows),
            buyer_previews=buyer_previews,
            status=listing_row["status"],
        )

    def _build_match_rationale(self, counterparty_name: str, offered_item_name: str, have_item_name: str) -> str:
        return (
            f"{counterparty_name} can supply {offered_item_name} and is a strong fit "
            f"for your available {have_item_name}."
        )

    def _build_match_insight(
        self,
        counterparty_name: str,
        offered_item_name: str,
        requested_item_name: str,
        have_item_name: str,
    ) -> str:
        return (
            f"{counterparty_name}'s {offered_item_name} directly addresses your {requested_item_name}. "
            f"The match also values your {have_item_name} as a useful reciprocal trade."
        )

    def _select_meeting_point(self, counterparty_profile: dict[str, Any]) -> dict[str, Any]:
        farmer = self._require_demo_farmer()
        farmer_lat = float(farmer["latitude"])
        farmer_lon = float(farmer["longitude"])
        counterparty_lat = float(counterparty_profile["latitude"])
        counterparty_lon = float(counterparty_profile["longitude"])

        def midpoint_distance(point: dict[str, Any]) -> float:
            return haversine_km(
                (farmer_lat + counterparty_lat) / 2,
                (farmer_lon + counterparty_lon) / 2,
                float(point["latitude"]),
                float(point["longitude"]),
            )

        meeting_points = self.repo.list_meeting_points()
        if not meeting_points:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="No meeting points configured.",
            )
        return sorted(meeting_points, key=midpoint_distance)[0]

    def _round_quantity(self, quantity: float, unit: str) -> float:
        if unit == "liter":
            return round(quantity * 2) / 2
        return round(quantity)
