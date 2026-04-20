from pydantic import BaseModel, Field
from typing import Optional

class FirestoreBuyerRequirement(BaseModel):
    """
    Firestore collection: /buyer_requirements
    Represents a buyer's requirement for a harvest listing.
    """
    id: Optional[str] = Field(None, description="Unique Firestore document ID")
    buyer_id: str = Field(..., description="ID of the buyer posting the requirement")
    crop: str = Field(..., description="Crop type required")
    quantity_kg: int = Field(..., description="Quantity required in kilograms")
    required_by: Optional[str] = Field(None, description="Date by which the crop is required (can be relative or absolute)")
    status: str = Field('OPEN', description="Requirement status: OPEN, MATCHED, CLOSED, etc.")
    created_at: Optional[str] = Field(None, description="Creation timestamp (ISO8601 string)")
    updated_at: Optional[str] = Field(None, description="Last update timestamp (ISO8601 string)")
