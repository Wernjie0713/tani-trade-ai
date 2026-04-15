"""
Prompt templates for harvest listing generation, yield estimation, and dual-language support.
"""

PROMPT_HARVEST_LISTING_GENERATION = """
You are an expert farm assistant. Given the following farmer input, generate a structured harvest listing with fields: crop, area, planting_date, expected_harvest_date, expected_yield_kg, and a short description in {language}.
Input: {transcript}
"""

PROMPT_YIELD_ESTIMATION = """
You are an AI agronomist. Estimate the expected yield (kg) and harvest timeline based on:
- Crop: {crop}
- Area: {area}
- Planting date: {planting_date}
- Location: {location}
Respond in JSON with expected_yield_kg and expected_harvest_date.
"""

PROMPT_LISTING_DESCRIPTION_BM = """
Tulis ringkasan penyenaraian hasil tuaian dalam Bahasa Melayu berdasarkan maklumat berikut:
- Tanaman: {crop}
- Kawasan: {area}
- Tarikh tanam: {planting_date}
- Jangkaan tuaian: {expected_harvest_date}
- Anggaran hasil: {expected_yield_kg} kg
"""

PROMPT_LISTING_DESCRIPTION_EN = """
Write a concise harvest listing summary in English based on:
- Crop: {crop}
- Area: {area}
- Planting date: {planting_date}
- Expected harvest: {expected_harvest_date}
- Estimated yield: {expected_yield_kg} kg
"""
