from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class FarmerWorkflowRepository:
    def __init__(self, client: Any) -> None:
        self.client = client

    def get_profile(self, profile_id: str) -> dict[str, Any] | None:
        return self._select_first("profiles", {"id": profile_id})

    def list_inventory_by_owner(self, profile_id: str) -> list[dict[str, Any]]:
        rows = self._list_rows("inventory_items")
        return sorted(
            [
                row
                for row in rows
                if row.get("owner_profile_id") == profile_id
                and row.get("availability_status") == "available"
            ],
            key=lambda row: row.get("created_at", ""),
        )

    def get_profiles_by_ids(self, profile_ids: list[str]) -> dict[str, dict[str, Any]]:
        if not profile_ids:
            return {}
        profile_set = set(profile_ids)
        rows = [
            row
            for row in self._list_rows("profiles")
            if row.get("id") in profile_set
        ]
        return {row["id"]: row for row in rows}

    def get_latest_active_flow(self, profile_id: str) -> dict[str, str | None]:
        request = self._select_latest("barter_requests", {"farmer_profile_id": profile_id})
        trade = self._select_latest("trades", {"farmer_profile_id": profile_id})
        planting = self._select_latest("planting_records", {"farmer_profile_id": profile_id})
        listing = self._select_latest("harvest_listings", {"farmer_profile_id": profile_id})

        match_id = None
        proposal_id = None
        if request:
            match = self._select_latest("barter_matches", {"request_id": request["id"]})
            proposal = self._select_latest("barter_proposals", {"request_id": request["id"]})
            match_id = match["id"] if match else None
            proposal_id = proposal["id"] if proposal else None

        return {
            "request_id": request["id"] if request else None,
            "match_id": match_id,
            "proposal_id": proposal_id,
            "trade_id": trade["id"] if trade else None,
            "planting_record_id": planting["id"] if planting else None,
            "harvest_listing_id": listing["id"] if listing else None,
        }

    def create_barter_request(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._insert_one("barter_requests", payload)

    def create_barter_request_items(self, payloads: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return self._insert_many("barter_request_items", payloads)

    def get_barter_request(self, request_id: str) -> dict[str, Any] | None:
        return self._select_first("barter_requests", {"id": request_id})

    def list_barter_request_items(self, request_id: str) -> list[dict[str, Any]]:
        return sorted(
            [
                row
                for row in self._list_rows("barter_request_items")
                if row.get("request_id") == request_id
            ],
            key=lambda row: row.get("created_at", ""),
        )

    def update_barter_request(self, request_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._update_one("barter_requests", request_id, payload)

    def count_candidate_inventory(
        self,
        normalized_item_name: str,
        exclude_owner_profile_id: str,
    ) -> int:
        return len(
            [
                row
                for row in self._list_rows("inventory_items")
                if row.get("normalized_item_name") == normalized_item_name
                and row.get("owner_profile_id") != exclude_owner_profile_id
                and row.get("availability_status") == "available"
            ],
        )

    def list_candidate_inventory(
        self,
        normalized_item_name: str,
        category: str,
        exclude_owner_profile_id: str,
    ) -> list[dict[str, Any]]:
        rows = self._list_rows("inventory_items")
        exact_rows = [
            row
            for row in rows
            if row.get("normalized_item_name") == normalized_item_name
            and row.get("owner_profile_id") != exclude_owner_profile_id
            and row.get("availability_status") == "available"
        ]
        if exact_rows:
            return exact_rows

        return [
            row
            for row in rows
            if row.get("category") == category
            and row.get("owner_profile_id") != exclude_owner_profile_id
            and row.get("availability_status") == "available"
        ]

    def list_meeting_points(self) -> list[dict[str, Any]]:
        return self._list_rows("meeting_points")

    def get_market_price_reference(self, normalized_item_name: str) -> dict[str, Any] | None:
        return self._select_first(
            "market_price_references",
            {"normalized_item_name": normalized_item_name},
        )

    def get_crop_profile(self, crop_code: str) -> dict[str, Any] | None:
        return self._select_first("crop_profiles", {"crop_code": crop_code})

    def list_matches(self, request_id: str) -> list[dict[str, Any]]:
        rows = [
            row
            for row in self._list_rows("barter_matches")
            if row.get("request_id") == request_id
        ]
        return sorted(rows, key=lambda row: (int(row.get("rank", 0)), row.get("created_at", "")))

    def create_matches(self, payloads: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return self._insert_many("barter_matches", payloads)

    def get_match(self, match_id: str) -> dict[str, Any] | None:
        return self._select_first("barter_matches", {"id": match_id})

    def get_existing_proposal_for_match(self, match_id: str) -> dict[str, Any] | None:
        return self._select_first("barter_proposals", {"match_id": match_id})

    def create_proposal(self, payload: dict[str, Any]) -> dict[str, Any]:
        existing = self.get_existing_proposal_for_match(payload["match_id"])
        if existing is not None:
            return existing
        return self._insert_one("barter_proposals", payload)

    def get_proposal(self, proposal_id: str) -> dict[str, Any] | None:
        return self._select_first("barter_proposals", {"id": proposal_id})

    def update_proposal(self, proposal_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._update_one("barter_proposals", proposal_id, payload)

    def get_trade_by_proposal(self, proposal_id: str) -> dict[str, Any] | None:
        return self._select_first("trades", {"proposal_id": proposal_id})

    def create_trade(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._insert_one("trades", payload)

    def get_trade(self, trade_id: str) -> dict[str, Any] | None:
        return self._select_first("trades", {"id": trade_id})

    def get_planting_record_by_trade(self, trade_id: str) -> dict[str, Any] | None:
        return self._select_first("planting_records", {"trade_id": trade_id})

    def get_planting_record(self, planting_record_id: str) -> dict[str, Any] | None:
        return self._select_first("planting_records", {"id": planting_record_id})

    def create_planting_record(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._insert_one("planting_records", payload)

    def update_planting_record(self, planting_record_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._update_one("planting_records", planting_record_id, payload)

    def get_harvest_listing_by_planting(self, planting_record_id: str) -> dict[str, Any] | None:
        return self._select_first("harvest_listings", {"planting_record_id": planting_record_id})

    def create_harvest_listing(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self._insert_one("harvest_listings", payload)

    def update_harvest_listing(self, harvest_listing_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._update_one("harvest_listings", harvest_listing_id, payload)

    def get_harvest_listing(self, harvest_listing_id: str) -> dict[str, Any] | None:
        return self._select_first("harvest_listings", {"id": harvest_listing_id})

    def replace_listing_interests(
        self,
        harvest_listing_id: str,
        payloads: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        collection = self.client.collection("listing_buyer_interests")
        for row in self._list_rows("listing_buyer_interests"):
            if row.get("harvest_listing_id") == harvest_listing_id:
                collection.document(row["id"]).delete()
        return self._insert_many("listing_buyer_interests", payloads)

    def list_listing_interests(self, harvest_listing_id: str) -> list[dict[str, Any]]:
        rows = [
            row
            for row in self._list_rows("listing_buyer_interests")
            if row.get("harvest_listing_id") == harvest_listing_id
        ]
        return sorted(rows, key=lambda row: row.get("created_at", ""))

    def list_buyers(self) -> list[dict[str, Any]]:
        rows = [
            row
            for row in self._list_rows("profiles")
            if row.get("role") == "buyer"
        ]
        return sorted(rows, key=lambda row: float(row.get("trust_score", 0)), reverse=True)

    def _list_rows(self, collection_name: str) -> list[dict[str, Any]]:
        return [
            self._normalize_row(document.id, document.to_dict() or {})
            for document in self.client.collection(collection_name).stream()
        ]

    def _select_first(self, collection_name: str, filters: dict[str, Any]) -> dict[str, Any] | None:
        rows = self._filter_rows(self._list_rows(collection_name), filters)
        return rows[0] if rows else None

    def _select_latest(self, collection_name: str, filters: dict[str, Any]) -> dict[str, Any] | None:
        rows = self._filter_rows(self._list_rows(collection_name), filters)
        rows.sort(key=lambda row: row.get("created_at", ""), reverse=True)
        return rows[0] if rows else None

    def _insert_one(self, collection_name: str, payload: dict[str, Any]) -> dict[str, Any]:
        doc_id = payload.get("id") or str(uuid4())
        timestamp = _utc_now_iso()
        row = {
            **payload,
            "id": doc_id,
            "created_at": payload.get("created_at", timestamp),
            "updated_at": payload.get("updated_at", timestamp),
        }
        self.client.collection(collection_name).document(doc_id).set(row)
        return row

    def _insert_many(self, collection_name: str, payloads: list[dict[str, Any]]) -> list[dict[str, Any]]:
        if not payloads:
            return []
        return [self._insert_one(collection_name, payload) for payload in payloads]

    def _update_one(self, collection_name: str, record_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        existing = self._select_first(collection_name, {"id": record_id})
        if existing is None:
            raise KeyError(f"Document {collection_name}/{record_id} not found.")

        updated = {
            **existing,
            **payload,
            "id": record_id,
            "created_at": existing.get("created_at", _utc_now_iso()),
            "updated_at": _utc_now_iso(),
        }
        self.client.collection(collection_name).document(record_id).set(updated)
        return updated

    def _filter_rows(self, rows: list[dict[str, Any]], filters: dict[str, Any]) -> list[dict[str, Any]]:
        filtered = rows
        for key, value in filters.items():
            filtered = [row for row in filtered if row.get(key) == value]
        return filtered

    def _normalize_row(self, document_id: str, row: dict[str, Any]) -> dict[str, Any]:
        return {
            **row,
            "id": row.get("id", document_id),
        }
