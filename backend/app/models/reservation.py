from pydantic import BaseModel, Field
from typing import Optional

class FirestoreReservation(BaseModel):
    """
    Firestore collection: /harvest_listings/{id}/reservations
    Represents a reservation for a projected harvest listing.
    """
    id: Optional[str] = Field(None, description="Unique Firestore document ID")
    harvest_listing_id: str = Field(..., description="ID of the harvest listing this reservation belongs to")
    buyer_id: str = Field(..., description="ID of the buyer making the reservation")
    quantity_kg: int = Field(..., description="Quantity reserved in kilograms")
    status: str = Field('RESERVED', description="Reservation status: RESERVED, CANCELLED, COMPLETED, etc.")
    created_at: Optional[str] = Field(None, description="Creation timestamp (ISO8601 string)")
    updated_at: Optional[str] = Field(None, description="Last update timestamp (ISO8601 string)")
