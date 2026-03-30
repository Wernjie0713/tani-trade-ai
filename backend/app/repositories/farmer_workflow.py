from __future__ import annotations

from typing import Any

from supabase import Client


class FarmerWorkflowRepository:
    def __init__(self, client: Client) -> None:
        self.client = client

    def get_profile(self, profile_id: str) -> dict[str, Any] | None:
        return self._select_first("profiles", {"id": profile_id})

    def list_inventory_by_owner(self, profile_id: str) -> list[dict[str, Any]]:
        return (
            self.client.table("inventory_items")
            .select("*")
            .eq("owner_profile_id", profile_id)
            .eq("availability_status", "available")
            .order("created_at")
            .execute()
            .data
            or []
        )

    def get_profiles_by_ids(self, profile_ids: list[str]) -> dict[str, dict[str, Any]]:
        if not profile_ids:
            return {}

        rows = (
            self.client.table("profiles")
            .select("*")
            .in_("id", profile_ids)
            .execute()
            .data
            or []
        )
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
        return (
            self.client.table("barter_request_items")
            .select("*")
            .eq("request_id", request_id)
            .order("created_at")
            .execute()
            .data
            or []
        )

    def update_barter_request(self, request_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        return self._update_one("barter_requests", request_id, payload)

    def count_candidate_inventory(
        self,
        normalized_item_name: str,
        exclude_owner_profile_id: str,
    ) -> int:
        rows = (
            self.client.table("inventory_items")
            .select("id")
            .eq("normalized_item_name", normalized_item_name)
            .neq("owner_profile_id", exclude_owner_profile_id)
            .eq("availability_status", "available")
            .execute()
            .data
            or []
        )
        return len(rows)

    def list_candidate_inventory(
        self,
        normalized_item_name: str,
        category: str,
        exclude_owner_profile_id: str,
    ) -> list[dict[str, Any]]:
        exact_rows = (
            self.client.table("inventory_items")
            .select("*")
            .eq("normalized_item_name", normalized_item_name)
            .neq("owner_profile_id", exclude_owner_profile_id)
            .eq("availability_status", "available")
            .execute()
            .data
            or []
        )
        if exact_rows:
            return exact_rows

        return (
            self.client.table("inventory_items")
            .select("*")
            .eq("category", category)
            .neq("owner_profile_id", exclude_owner_profile_id)
            .eq("availability_status", "available")
            .execute()
            .data
            or []
        )

    def list_meeting_points(self) -> list[dict[str, Any]]:
        return self.client.table("meeting_points").select("*").execute().data or []

    def get_market_price_reference(self, normalized_item_name: str) -> dict[str, Any] | None:
        return self._select_first(
            "market_price_references",
            {"normalized_item_name": normalized_item_name},
        )

    def get_crop_profile(self, crop_code: str) -> dict[str, Any] | None:
        return self._select_first("crop_profiles", {"crop_code": crop_code})

    def list_matches(self, request_id: str) -> list[dict[str, Any]]:
        return (
            self.client.table("barter_matches")
            .select("*")
            .eq("request_id", request_id)
            .order("rank")
            .execute()
            .data
            or []
        )

    def create_matches(self, payloads: list[dict[str, Any]]) -> list[dict[str, Any]]:
        return self._insert_many("barter_matches", payloads)

    def get_match(self, match_id: str) -> dict[str, Any] | None:
        return self._select_first("barter_matches", {"id": match_id})

    def get_existing_proposal_for_match(self, match_id: str) -> dict[str, Any] | None:
        return self._select_first("barter_proposals", {"match_id": match_id})

    def create_proposal(self, payload: dict[str, Any]) -> dict[str, Any]:
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

    def replace_listing_interests(self, harvest_listing_id: str, payloads: list[dict[str, Any]]) -> list[dict[str, Any]]:
        self.client.table("listing_buyer_interests").delete().eq("harvest_listing_id", harvest_listing_id).execute()
        return self._insert_many("listing_buyer_interests", payloads)

    def list_listing_interests(self, harvest_listing_id: str) -> list[dict[str, Any]]:
        return (
            self.client.table("listing_buyer_interests")
            .select("*")
            .eq("harvest_listing_id", harvest_listing_id)
            .order("created_at")
            .execute()
            .data
            or []
        )

    def list_buyers(self) -> list[dict[str, Any]]:
        return (
            self.client.table("profiles")
            .select("*")
            .eq("role", "buyer")
            .order("trust_score", desc=True)
            .execute()
            .data
            or []
        )

    def _select_first(self, table: str, filters: dict[str, Any]) -> dict[str, Any] | None:
        query = self.client.table(table).select("*")
        for key, value in filters.items():
            query = query.eq(key, value)
        rows = query.limit(1).execute().data or []
        return rows[0] if rows else None

    def _select_latest(self, table: str, filters: dict[str, Any]) -> dict[str, Any] | None:
        query = self.client.table(table).select("*")
        for key, value in filters.items():
            query = query.eq(key, value)
        rows = query.order("created_at", desc=True).limit(1).execute().data or []
        return rows[0] if rows else None

    def _insert_one(self, table: str, payload: dict[str, Any]) -> dict[str, Any]:
        rows = self.client.table(table).insert(payload).execute().data or []
        return rows[0]

    def _insert_many(self, table: str, payloads: list[dict[str, Any]]) -> list[dict[str, Any]]:
        if not payloads:
            return []
        return self.client.table(table).insert(payloads).execute().data or []

    def _update_one(self, table: str, record_id: str, payload: dict[str, Any]) -> dict[str, Any]:
        rows = (
            self.client.table(table)
            .update(payload)
            .eq("id", record_id)
            .execute()
            .data
            or []
        )
        return rows[0]
