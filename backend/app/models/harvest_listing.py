from pydantic import BaseModel, Field
from typing import Optional

class FirestoreHarvestListing(BaseModel):
    """
    Firestore collection: /harvest_listings
    Represents a harvest listing document in Firestore.
    """
    id: Optional[str] = Field(None, description="Unique Firestore document ID")
    farmer_id: str = Field(..., description="ID of the farmer who owns this listing")
    crop: str = Field(..., description="Crop type (e.g., 'chili', 'cili')")
    area: str = Field(..., description="Area planted (e.g., '2 ekar', '2 acres')")
    planting_date: Optional[str] = Field(None, description="Date crop was planted (can be relative, e.g., 'yesterday')")
    expected_harvest_date: Optional[str] = Field(None, description="Expected harvest date (can be relative or absolute)")
    expected_yield_kg: Optional[int] = Field(None, description="Expected yield in kilograms")
    status: str = Field('PROJECTED', description="Listing status: DRAFT, PROJECTED, PUBLISHED, etc.")
    created_at: Optional[str] = Field(None, description="Creation timestamp (ISO8601 string)")
    updated_at: Optional[str] = Field(None, description="Last update timestamp (ISO8601 string)")
