from fastapi import APIRouter, HTTPException
from typing import List
from app.models.harvest_listing import FirestoreHarvestListing
from app.models.reservation import FirestoreReservation
from app.models.buyer_requirement import FirestoreBuyerRequirement
from app.services.harvest import HarvestService

router = APIRouter(prefix="/harvest", tags=["harvest"])

@router.post("/listings", response_model=str)
def create_listing(listing: FirestoreHarvestListing):
    return HarvestService.create_listing(listing)

@router.put("/listings/{listing_id}")
def update_listing(listing_id: str, data: dict):
    if not HarvestService.update_listing(listing_id, data):
        raise HTTPException(status_code=404, detail="Listing not found")
    return {"status": "updated"}

@router.get("/listings", response_model=List[dict])
def list_listings():
    return HarvestService.list_all_listings() if hasattr(HarvestService, "list_all_listings") else []

@router.post("/listings/{listing_id}/reserve", response_model=dict)
def reserve_listing(listing_id: str, reservation: FirestoreReservation):
    return HarvestService.prorate_reservation(listing_id, reservation)

@router.post("/buyer-requirements", response_model=str)
def post_buyer_requirement(requirement: FirestoreBuyerRequirement):
    return HarvestService.create_buyer_requirement(requirement) if hasattr(HarvestService, "create_buyer_requirement") else "not-implemented"
