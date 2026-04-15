"""
Repository for Firestore CRUD operations on harvest listings, reservations, and buyer requirements.
Firestore collections:
- /harvest_listings
- /harvest_listings/{id}/reservations
- /buyer_requirements
"""
from typing import List, Optional
from app.db.firebase import get_firestore_client
from app.models.harvest_listing import FirestoreHarvestListing
from app.models.reservation import FirestoreReservation
from app.models.buyer_requirement import FirestoreBuyerRequirement

class HarvestListingRepository:
    """
    Handles CRUD for harvest listings, reservations, and buyer requirements in Firestore.
    """
    COLLECTION = "harvest_listings"
    RESERVATION_SUBCOLLECTION = "reservations"
    BUYER_REQUIREMENTS_COLLECTION = "buyer_requirements"

    # Harvest Listings CRUD
    @staticmethod
    def create_harvest_listing(listing: FirestoreHarvestListing) -> str:
        doc_ref = get_firestore_client().collection(HarvestListingRepository.COLLECTION).document()
        doc_ref.set(listing.model_dump(exclude_none=True))
        return doc_ref.id

    @staticmethod
    def get_harvest_listing(listing_id: str) -> Optional[dict]:
        doc = get_firestore_client().collection(HarvestListingRepository.COLLECTION).document(listing_id).get()
        return doc.to_dict() if doc.exists else None

    @staticmethod
    def update_harvest_listing(listing_id: str, data: dict) -> bool:
        doc_ref = get_firestore_client().collection(HarvestListingRepository.COLLECTION).document(listing_id)
        if doc_ref.get().exists:
            doc_ref.update(data)
            return True
        return False

    @staticmethod
    def delete_harvest_listing(listing_id: str) -> bool:
        doc_ref = get_firestore_client().collection(HarvestListingRepository.COLLECTION).document(listing_id)
        if doc_ref.get().exists:
            doc_ref.delete()
            return True
        return False

    @staticmethod
    def list_harvest_listings() -> List[dict]:
        docs = get_firestore_client().collection(HarvestListingRepository.COLLECTION).stream()
        return [doc.to_dict() for doc in docs]

    # Reservation CRUD
    @staticmethod
    def create_reservation(listing_id: str, reservation: FirestoreReservation) -> str:
        doc_ref = get_firestore_client().collection(HarvestListingRepository.COLLECTION).document(listing_id) \
            .collection(HarvestListingRepository.RESERVATION_SUBCOLLECTION).document()
        doc_ref.set(reservation.model_dump(exclude_none=True))
        return doc_ref.id

    @staticmethod
    def list_reservations(listing_id: str) -> List[dict]:
        docs = get_firestore_client().collection(HarvestListingRepository.COLLECTION).document(listing_id) \
            .collection(HarvestListingRepository.RESERVATION_SUBCOLLECTION).stream()
        return [doc.to_dict() for doc in docs]

    # Buyer Requirement CRUD
    @staticmethod
    def create_buyer_requirement(requirement: FirestoreBuyerRequirement) -> str:
        doc_ref = get_firestore_client().collection(HarvestListingRepository.BUYER_REQUIREMENTS_COLLECTION).document()
        doc_ref.set(requirement.model_dump(exclude_none=True))
        return doc_ref.id

    @staticmethod
    def list_buyer_requirements() -> List[dict]:
        docs = get_firestore_client().collection(HarvestListingRepository.BUYER_REQUIREMENTS_COLLECTION).stream()
        return [doc.to_dict() for doc in docs]
