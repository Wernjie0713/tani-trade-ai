

import os
from dotenv import load_dotenv
import google.genai as genai
from google.genai import types
from pydantic import BaseModel


# Load .env
env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(env_path)
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise RuntimeError("GEMINI_API_KEY not found in .env")





# Use the google-genai >=1.73.0 client interface
genai_client = genai.Client(api_key=api_key)

# Define your exact data schema
from pydantic import BaseModel, Field

class HarvestDetails(BaseModel):
    crop: str | None
    area: str | None
    # Add a description to tell the model relative dates are okay!
    planting_date: str | None = Field(description="The date the crop was planted. Acceptable values include specific dates (e.g., 'July 10') or relative times (e.g., 'yesterday', 'semalam').")
    expected_harvest_date: str | None
    expected_yield_kg: int | None

transcripts = [
    "Saya baru tanam cili 2 ekar semalam, jangka boleh tuai dalam bulan Julai, anggaran hasil 800 kilogram.",
    "I just planted 2 acres of chili yesterday, should be ready to harvest in July, expected yield is 800 kilograms."
]



for idx, transcript in enumerate(transcripts, 1):
    print(f"\n--- Test Case {idx} ---")
    print(f"Transcript: {transcript}")
    try:
        response = genai_client.models.generate_content(
            model='gemini-2.5-flash',  # Or your preferred model
            contents=f"You are an expert farm assistant. Extract the harvest details from the farmer's statement. Input: {transcript}",
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=HarvestDetails,
                temperature=0.0
            )
        )
        data = response.text
        print("Gemini Output (Raw JSON):")
        print(data)
        validated = HarvestDetails.model_validate_json(data)
        print("Validated Pydantic Object:")
        print(validated)
    except Exception as e:
        print("Error:", e)
