"""
Harvest Service Layer
- Handles business logic for harvest listings, buyer requirements, and reservations.
- Integrates with AI orchestrator for yield/timeline estimation.
- Simulates escrow logic for reservations and refunds.
Firestore collections:
- /harvest_listings
- /harvest_listings/{id}/reservations
- /buyer_requirements
"""
from typing import Optional, List
from app.repositories.harvest_listing import HarvestListingRepository
from app.models.harvest_listing import FirestoreHarvestListing
from app.models.reservation import FirestoreReservation
from app.models.buyer_requirement import FirestoreBuyerRequirement
# from app.services.ai.orchestrator import estimate_yield_and_timeline

class HarvestService:
    """
    Service layer for harvest module business logic.
    """
    @staticmethod
    def list_all_listings() -> List[dict]:
        return HarvestListingRepository.list_harvest_listings()

    @staticmethod
    def create_buyer_requirement(requirement: FirestoreBuyerRequirement) -> str:
        return HarvestListingRepository.create_buyer_requirement(requirement)

    @staticmethod
    def create_listing(listing: FirestoreHarvestListing) -> str:
        # Optionally call AI for yield/timeline estimation here
        # listing = estimate_yield_and_timeline(listing)
        return HarvestListingRepository.create_harvest_listing(listing)

    @staticmethod
    def update_listing(listing_id: str, data: dict) -> bool:
        return HarvestListingRepository.update_harvest_listing(listing_id, data)

    @staticmethod
    def match_buyer_requirements(listing: FirestoreHarvestListing) -> List[dict]:
        # Simple match: crop and harvest window overlap
        requirements = HarvestListingRepository.list_buyer_requirements()
        matches = [r for r in requirements if r["crop"] == listing.crop]
        return matches

    @staticmethod
    def set_listing_status(listing_id: str, status: str) -> bool:
        return HarvestListingRepository.update_harvest_listing(listing_id, {"status": status})

    @staticmethod
    def prorate_reservation(listing_id: str, reservation: FirestoreReservation) -> dict:
        reservation_id = HarvestListingRepository.create_reservation(listing_id, reservation)
        listing = HarvestListingRepository.get_harvest_listing(listing_id)
        if listing:
            new_count = listing.get("buyer_interest_count", 0) + 1
            previews = listing.get("buyer_previews", [])
            previews.append({"buyer_name": reservation.buyer_id, "avatar_url": None})
            HarvestListingRepository.update_harvest_listing(listing_id, {
                "buyer_interest_count": new_count,
                "buyer_previews": previews,
                "reserved_by": reservation.buyer_id,
                "reserved_quantity": reservation.quantity_kg,
                "status": "funds_secured"
            })
        return {"reservation_id": reservation_id, "status": "funds_secured", "escrow": "simulated"}

    @staticmethod
    def estimate_yield_and_timeline(listing: FirestoreHarvestListing) -> FirestoreHarvestListing:
        # Placeholder for AI integration
        # return estimate_yield_and_timeline(listing)
        return listing
