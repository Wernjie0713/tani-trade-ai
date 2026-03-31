from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timedelta, timezone

from app.services.catalog import crop_label, find_crop_code, item_category, item_default_unit, item_display_name

BASE_TIME = datetime(2026, 3, 10, 0, 0, tzinfo=timezone.utc)


def expand_seed_data(seed_data: dict) -> dict:
    expanded = deepcopy(seed_data)
    _normalize_existing_requests(expanded)
    _upsert_documents(expanded, "profiles", _build_additional_profiles())
    _upsert_documents(expanded, "farms", _build_additional_farms())
    _upsert_documents(expanded, "crop_profiles", _build_additional_crop_profiles())
    _upsert_documents(expanded, "inventory_items", _build_additional_inventory())
    _upsert_documents(expanded, "market_price_references", _build_additional_price_references())
    _upsert_documents(expanded, "meeting_points", _build_additional_meeting_points())
    history_documents = _build_history_documents()
    for collection_name, documents in history_documents.items():
        _upsert_documents(expanded, collection_name, documents)
    return expanded


def _timestamp(offset_minutes: int) -> str:
    return (BASE_TIME + timedelta(minutes=offset_minutes)).isoformat()


def _upsert_documents(seed_data: dict, collection_name: str, documents: list[dict]) -> None:
    existing = {document["id"]: document for document in seed_data.get(collection_name, [])}
    for document in documents:
        existing[document["id"]] = document
    seed_data[collection_name] = list(existing.values())


def _normalize_existing_requests(seed_data: dict) -> None:
    for request in seed_data.get("barter_requests", []):
        detected = find_crop_code(request.get("raw_text", "")) is not None
        request.setdefault("crop_detected", detected)
        request.setdefault(
            "crop_display_label",
            request.get("crop_label") if request["crop_detected"] else None,
        )


PROFILE_SPECS = [
    {
        "id": "profile-farmer-hakim",
        "role": "farmer",
        "display_name": "Hakim Salleh",
        "preferred_language": "bm",
        "trust_score": 4.6,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=HakimSalleh",
        "village": "Kubang Rotan",
        "state": "Kedah",
        "latitude": 6.1405,
        "longitude": 100.3770,
        "farm_name": "Hakim River Plot",
        "farm_type": "mixed",
        "area_hectares": 2.2,
    },
    {
        "id": "profile-farmer-aisyah",
        "role": "farmer",
        "display_name": "Puan Aisyah",
        "preferred_language": "bm",
        "trust_score": 4.5,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=PuanAisyah",
        "village": "Pendang",
        "state": "Kedah",
        "latitude": 6.0099,
        "longitude": 100.4725,
        "farm_name": "Aisyah Veggie Rows",
        "farm_type": "horticulture",
        "area_hectares": 1.6,
    },
    {
        "id": "profile-farmer-devinder",
        "role": "farmer",
        "display_name": "Devinder Singh",
        "preferred_language": "en",
        "trust_score": 4.7,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=DevinderSingh",
        "village": "Tasek Gelugor",
        "state": "Penang",
        "latitude": 5.4808,
        "longitude": 100.4704,
        "farm_name": "Devinder Support Farm",
        "farm_type": "mixed",
        "area_hectares": 2.4,
    },
    {
        "id": "profile-farmer-roslan",
        "role": "farmer",
        "display_name": "Roslan Mat",
        "preferred_language": "bm",
        "trust_score": 4.3,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=RoslanMat",
        "village": "Gurun",
        "state": "Kedah",
        "latitude": 5.8178,
        "longitude": 100.4735,
        "farm_name": "Roslan Corn Patch",
        "farm_type": "mixed",
        "area_hectares": 1.9,
    },
    {
        "id": "profile-farmer-mei-ling",
        "role": "farmer",
        "display_name": "Mei Ling",
        "preferred_language": "en",
        "trust_score": 4.4,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=MeiLing",
        "village": "Jitra",
        "state": "Kedah",
        "latitude": 6.2682,
        "longitude": 100.4212,
        "farm_name": "Mei Ling Nursery",
        "farm_type": "nursery",
        "area_hectares": 1.4,
    },
    {
        "id": "profile-farmer-faridah",
        "role": "farmer",
        "display_name": "Faridah Osman",
        "preferred_language": "bm",
        "trust_score": 4.2,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=FaridahOsman",
        "village": "Kodiang",
        "state": "Kedah",
        "latitude": 6.4048,
        "longitude": 100.3366,
        "farm_name": "Faridah Banana Yard",
        "farm_type": "orchard",
        "area_hectares": 2.6,
    },
    {
        "id": "profile-farmer-zamri",
        "role": "farmer",
        "display_name": "Zamri Kassim",
        "preferred_language": "bm",
        "trust_score": 4.1,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=ZamriKassim",
        "village": "Alor Setar Fringe",
        "state": "Kedah",
        "latitude": 6.1213,
        "longitude": 100.3552,
        "farm_name": "Zamri Storage Plot",
        "farm_type": "mixed",
        "area_hectares": 1.7,
    },
    {
        "id": "profile-farmer-kavitha",
        "role": "farmer",
        "display_name": "Kavitha Raj",
        "preferred_language": "en",
        "trust_score": 4.5,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=KavithaRaj",
        "village": "Bagan Serai",
        "state": "Perak",
        "latitude": 5.0106,
        "longitude": 100.5363,
        "farm_name": "Kavitha Greenhouse",
        "farm_type": "horticulture",
        "area_hectares": 2.1,
    },
    {
        "id": "profile-farmer-haziq",
        "role": "farmer",
        "display_name": "Haziq Idris",
        "preferred_language": "bm",
        "trust_score": 4.6,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=HaziqIdris",
        "village": "Kuala Nerang",
        "state": "Kedah",
        "latitude": 6.2648,
        "longitude": 100.5642,
        "farm_name": "Haziq Seedling Block",
        "farm_type": "nursery",
        "area_hectares": 1.8,
    },
    {
        "id": "profile-farmer-nooraini",
        "role": "farmer",
        "display_name": "Nooraini Yusof",
        "preferred_language": "bm",
        "trust_score": 4.3,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=NoorainiYusof",
        "village": "Sungai Petani Fringe",
        "state": "Kedah",
        "latitude": 5.6470,
        "longitude": 100.4995,
        "farm_name": "Nooraini Soil Lab Plot",
        "farm_type": "mixed",
        "area_hectares": 1.5,
    },
    {
        "id": "profile-farmer-balqis",
        "role": "farmer",
        "display_name": "Balqis Rahman",
        "preferred_language": "bm",
        "trust_score": 4.7,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=BalqisRahman",
        "village": "Arau Fringe",
        "state": "Perlis",
        "latitude": 6.4348,
        "longitude": 100.2739,
        "farm_name": "Balqis Chili Block",
        "farm_type": "horticulture",
        "area_hectares": 2.0,
    },
    {
        "id": "profile-farmer-chong-wei",
        "role": "farmer",
        "display_name": "Chong Wei",
        "preferred_language": "en",
        "trust_score": 4.1,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=ChongWei",
        "village": "Kerian",
        "state": "Perak",
        "latitude": 5.1382,
        "longitude": 100.5972,
        "farm_name": "Chong Wei Irrigation Lot",
        "farm_type": "mixed",
        "area_hectares": 1.9,
    },
    {
        "id": "profile-farmer-safuan",
        "role": "farmer",
        "display_name": "Safuan Halim",
        "preferred_language": "bm",
        "trust_score": 4.4,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=SafuanHalim",
        "village": "Kepala Batas",
        "state": "Penang",
        "latitude": 5.5167,
        "longitude": 100.4260,
        "farm_name": "Safuan Support Shed",
        "farm_type": "mixed",
        "area_hectares": 1.3,
    },
    {
        "id": "profile-farmer-saraswathy",
        "role": "farmer",
        "display_name": "Saraswathy Devi",
        "preferred_language": "en",
        "trust_score": 4.5,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=SaraswathyDevi",
        "village": "Nibong Tebal",
        "state": "Penang",
        "latitude": 5.1652,
        "longitude": 100.4779,
        "farm_name": "Saraswathy Crop Yard",
        "farm_type": "horticulture",
        "area_hectares": 2.3,
    },
    {
        "id": "profile-buyer-rice-mill",
        "role": "buyer",
        "display_name": "Alor Setar Rice Mill",
        "preferred_language": "bm",
        "trust_score": 4.8,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=RiceMill",
        "village": "Alor Setar",
        "state": "Kedah",
        "latitude": 6.1248,
        "longitude": 100.3678,
    },
    {
        "id": "profile-buyer-pasar-borong",
        "role": "buyer",
        "display_name": "Pasar Borong Utara",
        "preferred_language": "bm",
        "trust_score": 4.6,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=PasarBorongUtara",
        "village": "Jitra",
        "state": "Kedah",
        "latitude": 6.2584,
        "longitude": 100.4305,
    },
    {
        "id": "profile-buyer-caterer",
        "role": "buyer",
        "display_name": "Northern Harvest Caterer",
        "preferred_language": "en",
        "trust_score": 4.5,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=NorthernHarvestCaterer",
        "village": "Butterworth",
        "state": "Penang",
        "latitude": 5.3996,
        "longitude": 100.3632,
    },
    {
        "id": "profile-buyer-retail",
        "role": "buyer",
        "display_name": "Tani Mart Penang",
        "preferred_language": "en",
        "trust_score": 4.4,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=TaniMartPenang",
        "village": "George Town",
        "state": "Penang",
        "latitude": 5.4164,
        "longitude": 100.3327,
    },
    {
        "id": "profile-buyer-kerian",
        "role": "buyer",
        "display_name": "Kerian Fresh Buyer",
        "preferred_language": "bm",
        "trust_score": 4.3,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=KerianFreshBuyer",
        "village": "Parit Buntar",
        "state": "Perak",
        "latitude": 5.1265,
        "longitude": 100.4926,
    },
    {
        "id": "profile-buyer-restaurant",
        "role": "buyer",
        "display_name": "Selera Utara Kitchen",
        "preferred_language": "bm",
        "trust_score": 4.4,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=SeleraUtaraKitchen",
        "village": "Sungai Petani",
        "state": "Kedah",
        "latitude": 5.6477,
        "longitude": 100.4871,
    },
    {
        "id": "profile-buyer-exporter",
        "role": "buyer",
        "display_name": "Penang Produce Export",
        "preferred_language": "en",
        "trust_score": 4.7,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=PenangProduceExport",
        "village": "Bukit Mertajam",
        "state": "Penang",
        "latitude": 5.3630,
        "longitude": 100.4667,
    },
    {
        "id": "profile-buyer-kedai",
        "role": "buyer",
        "display_name": "Kedai Runcit Jitra",
        "preferred_language": "bm",
        "trust_score": 4.2,
        "avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=KedaiRuncitJitra",
        "village": "Jitra",
        "state": "Kedah",
        "latitude": 6.2641,
        "longitude": 100.4205,
    },
]


def _build_additional_profiles() -> list[dict]:
    documents = []
    for index, profile in enumerate(PROFILE_SPECS, start=1):
        documents.append(
            {
                "id": profile["id"],
                "role": profile["role"],
                "display_name": profile["display_name"],
                "preferred_language": profile["preferred_language"],
                "trust_score": profile["trust_score"],
                "avatar_url": profile["avatar_url"],
                "village": profile["village"],
                "state": profile["state"],
                "latitude": profile["latitude"],
                "longitude": profile["longitude"],
                "is_demo": False,
                "created_at": _timestamp(index),
                "updated_at": _timestamp(index),
            }
        )
    return documents


def _build_additional_farms() -> list[dict]:
    documents = []
    for index, profile in enumerate(PROFILE_SPECS, start=30):
        if profile["role"] != "farmer":
            continue
        documents.append(
            {
                "id": f"farm-{profile['id']}",
                "profile_id": profile["id"],
                "farm_name": profile["farm_name"],
                "farm_type": profile["farm_type"],
                "area_hectares": profile["area_hectares"],
                "latitude": profile["latitude"],
                "longitude": profile["longitude"],
                "created_at": _timestamp(index),
                "updated_at": _timestamp(index),
            }
        )
    return documents


def _build_additional_crop_profiles() -> list[dict]:
    return [
        {
            "id": "crop-profile-chili",
            "crop_code": "chili",
            "label": "Chili",
            "growth_days": 95,
            "yield_min_kg_per_hectare": 6800,
            "yield_max_kg_per_hectare": 8200,
            "default_quality_band": "Grade A",
            "created_at": _timestamp(60),
            "updated_at": _timestamp(60),
        },
        {
            "id": "crop-profile-okra",
            "crop_code": "okra",
            "label": "Okra",
            "growth_days": 60,
            "yield_min_kg_per_hectare": 9000,
            "yield_max_kg_per_hectare": 12000,
            "default_quality_band": "Grade A",
            "created_at": _timestamp(61),
            "updated_at": _timestamp(61),
        },
        {
            "id": "crop-profile-cucumber",
            "crop_code": "cucumber",
            "label": "Cucumber",
            "growth_days": 70,
            "yield_min_kg_per_hectare": 18000,
            "yield_max_kg_per_hectare": 24000,
            "default_quality_band": "Grade A",
            "created_at": _timestamp(62),
            "updated_at": _timestamp(62),
        },
        {
            "id": "crop-profile-banana",
            "crop_code": "banana",
            "label": "Banana",
            "growth_days": 300,
            "yield_min_kg_per_hectare": 18000,
            "yield_max_kg_per_hectare": 26000,
            "default_quality_band": "Grade A",
            "created_at": _timestamp(63),
            "updated_at": _timestamp(63),
        },
    ]


INVENTORY_PLANS = {
    "11111111-1111-1111-1111-111111111111": [
        ("npk_fertilizer", 6, "bag", "fungicide", "Ready to barter"),
        ("hand_sprayer", 4, "set", "fruit_crates", "Open to trade"),
    ],
    "profile-farmer-hakim": [
        ("npk_fertilizer", 10, "bag", "organic_pesticide", "Ready to barter"),
        ("hand_sprayer", 4, "set", "fruit_crates", "Immediate priority"),
        ("chili_seedlings", 12, "tray", "potting_mix", "Open to trade"),
    ],
    "profile-farmer-aisyah": [
        ("mulch_sheet", 6, "roll", "hand_sprayer", "Ready to barter"),
        ("cucumber_seed_pack", 18, "pack", "npk_fertilizer", "Open to trade"),
        ("compost_tea", 24, "liter", "seedling_trays", "Immediate priority"),
    ],
    "profile-farmer-devinder": [
        ("fungicide", 10, "liter", "nitrogen_fertilizer", "Immediate priority"),
        ("bamboo_stakes", 8, "bundle", "mulch_sheet", "Open to trade"),
        ("fruit_crates", 18, "crate", "bio_fertilizer", "Ready to barter"),
    ],
    "profile-farmer-roslan": [
        ("irrigation_hose", 5, "roll", "herbicide", "Open to trade"),
        ("potting_mix", 14, "bag", "fruit_crates", "Ready to barter"),
        ("corn_seed_pack", 20, "pack", "nitrogen_fertilizer", "Open to trade"),
    ],
    "profile-farmer-mei-ling": [
        ("seedling_trays", 35, "set", "compost_tea", "Immediate priority"),
        ("fungicide", 7, "liter", "bamboo_stakes", "Open to trade"),
        ("hand_sprayer", 5, "set", "npk_fertilizer", "Ready to barter"),
    ],
    "profile-farmer-faridah": [
        ("herbicide", 8, "liter", "bio_fertilizer", "Ready to barter"),
        ("banana_suckers", 16, "set", "irrigation_hose", "Open to trade"),
        ("fruit_crates", 24, "crate", "organic_pesticide", "Open to trade"),
    ],
    "profile-farmer-zamri": [
        ("npk_fertilizer", 9, "bag", "organic_pesticide", "Immediate priority"),
        ("corn_seed_pack", 15, "pack", "compost_tea", "Open to trade"),
        ("bamboo_stakes", 6, "bundle", "fruit_crates", "Open to trade"),
    ],
    "profile-farmer-kavitha": [
        ("mulch_sheet", 7, "roll", "seedling_trays", "Ready to barter"),
        ("potting_mix", 18, "bag", "fungicide", "Immediate priority"),
        ("cucumber_seed_pack", 14, "pack", "hand_sprayer", "Open to trade"),
    ],
    "profile-farmer-haziq": [
        ("rice_seedlings", 20, "tray", "nitrogen_fertilizer", "Ready to barter"),
        ("organic_pesticide", 12, "liter", "fruit_crates", "Open to trade"),
        ("irrigation_hose", 4, "roll", "bamboo_stakes", "Immediate priority"),
    ],
    "profile-farmer-nooraini": [
        ("bio_fertilizer", 11, "bag", "compost_tea", "Open to trade"),
        ("hand_sprayer", 6, "set", "mulch_sheet", "Ready to barter"),
        ("okra_seed_pack", 22, "pack", "organic_pesticide", "Open to trade"),
    ],
    "profile-farmer-balqis": [
        ("fungicide", 9, "liter", "npk_fertilizer", "Immediate priority"),
        ("chili_seedlings", 14, "tray", "bio_fertilizer", "Open to trade"),
        ("fruit_crates", 20, "crate", "hand_sprayer", "Ready to barter"),
    ],
    "profile-farmer-chong-wei": [
        ("seed_pack", 30, "pack", "herbicide", "Open to trade"),
        ("irrigation_hose", 6, "roll", "fruit_crates", "Open to trade"),
        ("bamboo_stakes", 7, "bundle", "organic_pesticide", "Immediate priority"),
    ],
    "profile-farmer-safuan": [
        ("npk_fertilizer", 8, "bag", "fruit_crates", "Ready to barter"),
        ("potting_mix", 16, "bag", "fungicide", "Open to trade"),
        ("hand_sprayer", 4, "set", "banana_suckers", "Open to trade"),
    ],
    "profile-farmer-saraswathy": [
        ("mulch_sheet", 9, "roll", "bio_fertilizer", "Ready to barter"),
        ("cucumber_seed_pack", 16, "pack", "seedling_trays", "Open to trade"),
        ("organic_pesticide", 10, "liter", "hand_sprayer", "Immediate priority"),
    ],
}


def _build_additional_inventory() -> list[dict]:
    documents = []
    offset = 100
    counter = 1
    for owner_profile_id, plans in INVENTORY_PLANS.items():
        for normalized_item_name, quantity, unit, desired_item_name, desired_priority in plans:
            documents.append(
                {
                    "id": f"inventory-{counter:03d}",
                    "owner_profile_id": owner_profile_id,
                    "item_name": item_display_name(normalized_item_name),
                    "normalized_item_name": normalized_item_name,
                    "category": item_category(normalized_item_name),
                    "quantity": quantity,
                    "unit": unit,
                    "desired_item_name": desired_item_name,
                    "desired_priority": desired_priority,
                    "availability_status": "available",
                    "created_at": _timestamp(offset),
                    "updated_at": _timestamp(offset),
                }
            )
            counter += 1
            offset += 1
    return documents


PRICE_REFERENCE_VALUES = {
    "seed_pack": 12.0,
    "npk_fertilizer": 32.0,
    "fungicide": 45.0,
    "herbicide": 38.0,
    "rice_seedlings": 9.0,
    "chili_seedlings": 14.0,
    "corn_seed_pack": 11.0,
    "okra_seed_pack": 10.0,
    "cucumber_seed_pack": 10.5,
    "banana_suckers": 22.0,
    "potting_mix": 16.0,
    "mulch_sheet": 26.0,
    "irrigation_hose": 75.0,
    "bamboo_stakes": 18.0,
    "hand_sprayer": 65.0,
}


def _build_additional_price_references() -> list[dict]:
    documents = []
    for index, (normalized_item_name, price) in enumerate(PRICE_REFERENCE_VALUES.items(), start=200):
        documents.append(
            {
                "id": f"price-{normalized_item_name}",
                "normalized_item_name": normalized_item_name,
                "display_name": item_display_name(normalized_item_name),
                "unit": item_default_unit(normalized_item_name),
                "price_per_unit": price,
                "created_at": _timestamp(index),
                "updated_at": _timestamp(index),
            }
        )
    return documents


def _build_additional_meeting_points() -> list[dict]:
    return [
        {
            "id": "meeting-arau-hub",
            "name": "Arau Collection Hub",
            "address": "Jalan Arau, Perlis",
            "latitude": 6.4331,
            "longitude": 100.2695,
            "created_at": _timestamp(240),
            "updated_at": _timestamp(240),
        },
        {
            "id": "meeting-jitra-yard",
            "name": "Jitra Farm Yard",
            "address": "Jalan Changlun, Kedah",
            "latitude": 6.2612,
            "longitude": 100.4170,
            "created_at": _timestamp(241),
            "updated_at": _timestamp(241),
        },
        {
            "id": "meeting-gurun-stop",
            "name": "Gurun Agri Stop",
            "address": "Pekan Gurun, Kedah",
            "latitude": 5.8170,
            "longitude": 100.4748,
            "created_at": _timestamp(242),
            "updated_at": _timestamp(242),
        },
        {
            "id": "meeting-butterworth-hub",
            "name": "Butterworth Produce Hub",
            "address": "Butterworth, Penang",
            "latitude": 5.3990,
            "longitude": 100.3640,
            "created_at": _timestamp(243),
            "updated_at": _timestamp(243),
        },
        {
            "id": "meeting-kerian-market",
            "name": "Kerian Market Pickup",
            "address": "Parit Buntar, Perak",
            "latitude": 5.1250,
            "longitude": 100.4950,
            "created_at": _timestamp(244),
            "updated_at": _timestamp(244),
        },
    ]


def _build_history_documents() -> dict[str, list[dict]]:
    documents = {
        "barter_requests": [],
        "barter_request_items": [],
        "barter_matches": [],
        "barter_proposals": [],
        "trades": [],
        "planting_records": [],
        "harvest_listings": [],
        "listing_buyer_interests": [],
    }

    scenarios = [
        {
            "prefix": "history-sweetcorn",
            "farmer_profile_id": "33333333-3333-3333-3333-333333333333",
            "raw_text": "I am planting sweet corn and have seedling trays to trade for compost tea next week",
            "crop_code": "sweet_corn",
            "timeline_label": "Next Week",
            "timeline_days": 7,
            "urgency": "medium",
            "have": {"normalized_name": "seedling_trays", "display_name": "Seedling Trays", "category": "equipment", "quantity": 12, "unit": "set"},
            "need": {"normalized_name": "compost_tea", "display_name": "Compost Tea", "category": "soil_treatment", "quantity": 18, "unit": "liter"},
            "match": {
                "counterparty_profile_id": "11111111-1111-1111-1111-111111111111",
                "counterparty_name": "Pak Karim",
                "counterparty_avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=PakKarim",
                "counterparty_inventory_item_id": "10000000-0000-0000-0000-000000000002",
                "offered_item_name": "Compost Tea",
                "offered_item_normalized_name": "compost_tea",
                "offered_quantity": 20,
                "offered_unit": "liter",
                "desired_item_name": "seedling_trays",
                "desired_priority": "Open to trade",
                "distance_km": 2.2,
                "score": (50, 25, 10, 9, 94),
                "insight": "Compost Tea supports sweet corn preparation, while Pak Karim values seedling trays for nursery work.",
            },
            "proposal": {
                "offer_item_name": "Seedling Trays",
                "offer_quantity": 12,
                "offer_unit": "set",
                "requested_item_name": "Compost Tea",
                "requested_quantity": 4,
                "requested_unit": "liter",
                "ratio_text": "3 set Seedling Trays = 1 liter Compost Tea",
                "explanation": "Seedling trays and compost tea sit in a similar practical value band for sweet corn preparation.",
                "meeting_point_id": "20000000-0000-0000-0000-000000000002",
                "meeting_point_name": "Village Market Hub",
                "meeting_label": "Tomorrow - 08:30 AM",
                "meeting_at": "2026-03-14T08:30:00+08:00",
                "document_number": "TT-HIST-SWEETCORN",
            },
            "trade": {"meeting_point_name": "Village Market Hub", "meeting_at": "2026-03-14T08:30:00+08:00", "transaction_code": "TRD-SWEETCORN"},
            "planting": {"crop_label": "Sweet Corn", "planting_date": "2026-03-16", "area_value": 1.8, "area_unit": "hectares", "area_hectares": 1.8, "input_summary": "Raised beds, compost tea drench, and balanced irrigation."},
            "listing": {"listing_title": "Future Sweet Corn Supply", "estimated_yield_min_kg": 13200, "estimated_yield_max_kg": 15800, "harvest_window_start": "2026-06-09", "harvest_window_end": "2026-06-23", "quality_band": "Grade A", "confidence_score": 92.1, "reservation_discount_pct": 8, "early_incentive_label": "8% off for early reservations", "listing_note": "Projected sweet corn supply with clean nursery preparation and stable harvest timing."},
            "buyers": ["55555555-5555-5555-5555-555555555555", "profile-buyer-caterer"],
        },
        {
            "prefix": "history-chili",
            "farmer_profile_id": "profile-farmer-hakim",
            "raw_text": "I am planting chili and have hand sprayer sets to trade for fungicide this week",
            "crop_code": "chili",
            "timeline_label": "This Week",
            "timeline_days": 3,
            "urgency": "medium",
            "have": {"normalized_name": "hand_sprayer", "display_name": "Hand Sprayer", "category": "equipment", "quantity": 2, "unit": "set"},
            "need": {"normalized_name": "fungicide", "display_name": "Fungicide", "category": "fungicide", "quantity": 5, "unit": "liter"},
            "match": {
                "counterparty_profile_id": "profile-farmer-balqis",
                "counterparty_name": "Balqis Rahman",
                "counterparty_avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=BalqisRahman",
                "counterparty_inventory_item_id": "inventory-031",
                "offered_item_name": "Fungicide",
                "offered_item_normalized_name": "fungicide",
                "offered_quantity": 9,
                "offered_unit": "liter",
                "desired_item_name": "hand_sprayer",
                "desired_priority": "Ready to barter",
                "distance_km": 4.8,
                "score": (50, 25, 7, 9, 91),
                "insight": "Balqis has the fungicide Hakim needs and is already looking for sprayer equipment.",
            },
            "proposal": {
                "offer_item_name": "Hand Sprayer",
                "offer_quantity": 2,
                "offer_unit": "set",
                "requested_item_name": "Fungicide",
                "requested_quantity": 3,
                "requested_unit": "liter",
                "ratio_text": "1 set Hand Sprayer = 1.5 liter Fungicide",
                "explanation": "The sprayer-to-fungicide swap stays close to seeded reference values and is practical for chili protection work.",
                "meeting_point_id": "meeting-jitra-yard",
                "meeting_point_name": "Jitra Farm Yard",
                "meeting_label": "Tomorrow - 10:00 AM",
                "meeting_at": "2026-03-15T10:00:00+08:00",
                "document_number": "TT-HIST-CHILI",
            },
            "trade": {"meeting_point_name": "Jitra Farm Yard", "meeting_at": "2026-03-15T10:00:00+08:00", "transaction_code": "TRD-CHILI"},
            "planting": {"crop_label": "Chili", "planting_date": "2026-03-18", "area_value": 1.2, "area_unit": "hectares", "area_hectares": 1.2, "input_summary": "Mulch cover, fungicide spray rotation, and staged fertigation."},
            "listing": {"listing_title": "Future Chili Supply", "estimated_yield_min_kg": 7800, "estimated_yield_max_kg": 9400, "harvest_window_start": "2026-06-21", "harvest_window_end": "2026-07-05", "quality_band": "Grade A", "confidence_score": 90.4, "reservation_discount_pct": 9, "early_incentive_label": "9% off for early reservations", "listing_note": "Projected chili harvest with disciplined disease-control inputs and steady field readiness."},
            "buyers": ["profile-buyer-restaurant", "profile-buyer-exporter"],
        },
        {
            "prefix": "history-cucumber",
            "farmer_profile_id": "profile-farmer-saraswathy",
            "raw_text": "I am planting cucumber and have mulch sheet to trade for fruit crates next month",
            "crop_code": "cucumber",
            "timeline_label": "Next Month",
            "timeline_days": 30,
            "urgency": "medium",
            "have": {"normalized_name": "mulch_sheet", "display_name": "Mulch Sheet", "category": "support", "quantity": 4, "unit": "roll"},
            "need": {"normalized_name": "fruit_crates", "display_name": "Fruit Crates", "category": "packaging", "quantity": 16, "unit": "crate"},
            "match": {
                "counterparty_profile_id": "44444444-4444-4444-4444-444444444444",
                "counterparty_name": "Siti Sarah",
                "counterparty_avatar_url": "https://api.dicebear.com/9.x/lorelei/svg?seed=SitiSarah",
                "counterparty_inventory_item_id": "10000000-0000-0000-0000-000000000007",
                "offered_item_name": "Fruit Crates",
                "offered_item_normalized_name": "fruit_crates",
                "offered_quantity": 30,
                "offered_unit": "crate",
                "desired_item_name": "organic_pesticide",
                "desired_priority": "Open to trade",
                "distance_km": 6.3,
                "score": (50, 0, 5, 8, 63),
                "insight": "Fruit crates help cucumber harvest logistics, while Saraswathy can contribute mulch material for the next planting cycle.",
            },
            "proposal": {
                "offer_item_name": "Mulch Sheet",
                "offer_quantity": 4,
                "offer_unit": "roll",
                "requested_item_name": "Fruit Crates",
                "requested_quantity": 7,
                "requested_unit": "crate",
                "ratio_text": "1 roll Mulch Sheet = 1.75 crate Fruit Crates",
                "explanation": "The mulch-to-crate exchange is rounded to workable packing volumes using the seeded price references.",
                "meeting_point_id": "meeting-butterworth-hub",
                "meeting_point_name": "Butterworth Produce Hub",
                "meeting_label": "Next Week - 09:30 AM",
                "meeting_at": "2026-03-20T09:30:00+08:00",
                "document_number": "TT-HIST-CUCUMBER",
            },
            "trade": {"meeting_point_name": "Butterworth Produce Hub", "meeting_at": "2026-03-20T09:30:00+08:00", "transaction_code": "TRD-CUCUMBER"},
            "planting": {"crop_label": "Cucumber", "planting_date": "2026-03-28", "area_value": 1.6, "area_unit": "hectares", "area_hectares": 1.6, "input_summary": "Plastic mulch, fertigation hose, and staged pollination support."},
            "listing": {"listing_title": "Future Cucumber Supply", "estimated_yield_min_kg": 21500, "estimated_yield_max_kg": 27600, "harvest_window_start": "2026-06-06", "harvest_window_end": "2026-06-20", "quality_band": "Grade A Premium", "confidence_score": 93.5, "reservation_discount_pct": 10, "early_incentive_label": "10% off for early reservations", "listing_note": "Projected cucumber supply with protected bed prep and high packing readiness for fast turnover."},
            "buyers": ["profile-buyer-retail", "profile-buyer-kerian"],
        },
    ]

    offset = 300
    for scenario in scenarios:
        request_id = f"{scenario['prefix']}-request"
        match_id = f"{scenario['prefix']}-match"
        proposal_id = f"{scenario['prefix']}-proposal"
        trade_id = f"{scenario['prefix']}-trade"
        planting_id = f"{scenario['prefix']}-planting"
        listing_id = f"{scenario['prefix']}-listing"
        documents["barter_requests"].append(
            {
                "id": request_id,
                "farmer_profile_id": scenario["farmer_profile_id"],
                "raw_text": scenario["raw_text"],
                "crop_code": scenario["crop_code"],
                "crop_label": crop_label(scenario["crop_code"]),
                "crop_detected": True,
                "crop_display_label": crop_label(scenario["crop_code"]),
                "timeline_label": scenario["timeline_label"],
                "timeline_days": scenario["timeline_days"],
                "radius_km": 8,
                "urgency": scenario["urgency"],
                "parsed_confidence": 0.93,
                "market_opportunity_count": 2,
                "status": "planted",
                "created_at": _timestamp(offset),
                "updated_at": _timestamp(offset),
            }
        )
        documents["barter_request_items"].extend(
            [
                {"id": f"{scenario['prefix']}-have", "request_id": request_id, "item_role": "have", **scenario["have"], "created_at": _timestamp(offset + 1), "updated_at": _timestamp(offset + 1)},
                {"id": f"{scenario['prefix']}-need", "request_id": request_id, "item_role": "need", **scenario["need"], "created_at": _timestamp(offset + 2), "updated_at": _timestamp(offset + 2)},
            ]
        )
        exact_need_score, reciprocal_need_score, distance_score_value, trust_score_value, total_score = scenario["match"]["score"]
        documents["barter_matches"].append(
            {
                "id": match_id,
                "request_id": request_id,
                "counterparty_profile_id": scenario["match"]["counterparty_profile_id"],
                "counterparty_inventory_item_id": scenario["match"]["counterparty_inventory_item_id"],
                "exact_need_score": exact_need_score,
                "reciprocal_need_score": reciprocal_need_score,
                "distance_score": distance_score_value,
                "trust_score": trust_score_value,
                "total_score": total_score,
                "distance_km": scenario["match"]["distance_km"],
                "rank": 1,
                "rationale": f"{scenario['match']['counterparty_name']} can supply {scenario['match']['offered_item_name']} and is a strong fit for this request.",
                "snapshot": {
                    "counterparty_name": scenario["match"]["counterparty_name"],
                    "counterparty_avatar_url": scenario["match"]["counterparty_avatar_url"],
                    "offered_item_name": scenario["match"]["offered_item_name"],
                    "offered_item_normalized_name": scenario["match"]["offered_item_normalized_name"],
                    "offered_quantity": scenario["match"]["offered_quantity"],
                    "offered_unit": scenario["match"]["offered_unit"],
                    "desired_item_name": scenario["match"]["desired_item_name"],
                    "desired_priority": scenario["match"]["desired_priority"],
                    "insight": scenario["match"]["insight"],
                },
                "created_at": _timestamp(offset + 3),
                "updated_at": _timestamp(offset + 3),
            }
        )
        documents["barter_proposals"].append(
            {
                "id": proposal_id,
                "request_id": request_id,
                "match_id": match_id,
                "counterparty_profile_id": scenario["match"]["counterparty_profile_id"],
                **scenario["proposal"],
                "valuation_confidence": 0.92,
                "status": "accepted",
                "snapshot": {
                    "counterparty_name": scenario["match"]["counterparty_name"],
                    "offer_item_name": scenario["proposal"]["offer_item_name"],
                    "offer_quantity": scenario["proposal"]["offer_quantity"],
                    "offer_unit": scenario["proposal"]["offer_unit"],
                    "requested_item_name": scenario["proposal"]["requested_item_name"],
                    "requested_quantity": scenario["proposal"]["requested_quantity"],
                    "requested_unit": scenario["proposal"]["requested_unit"],
                    "meeting_point_name": scenario["proposal"]["meeting_point_name"],
                    "meeting_label": scenario["proposal"]["meeting_label"],
                    "document_number": scenario["proposal"]["document_number"],
                    "explanation": scenario["proposal"]["explanation"],
                },
                "created_at": _timestamp(offset + 4),
                "updated_at": _timestamp(offset + 4),
            }
        )
        documents["trades"].append(
            {
                "id": trade_id,
                "proposal_id": proposal_id,
                "request_id": request_id,
                "farmer_profile_id": scenario["farmer_profile_id"],
                "counterparty_profile_id": scenario["match"]["counterparty_profile_id"],
                "status": "accepted",
                **scenario["trade"],
                "snapshot": {
                    "counterparty_name": scenario["match"]["counterparty_name"],
                    "offer_item_name": scenario["proposal"]["offer_item_name"],
                    "offer_quantity": scenario["proposal"]["offer_quantity"],
                    "offer_unit": scenario["proposal"]["offer_unit"],
                    "requested_item_name": scenario["proposal"]["requested_item_name"],
                    "requested_quantity": scenario["proposal"]["requested_quantity"],
                    "requested_unit": scenario["proposal"]["requested_unit"],
                    "projected_yield_uplift_pct": 14,
                    "planting_prompt": "Historical seeded trade for a richer farmer demo view.",
                },
                "created_at": _timestamp(offset + 5),
                "updated_at": _timestamp(offset + 5),
            }
        )
        documents["planting_records"].append(
            {
                "id": planting_id,
                "trade_id": trade_id,
                "farmer_profile_id": scenario["farmer_profile_id"],
                "crop_code": scenario["crop_code"],
                **scenario["planting"],
                "snapshot": {
                    "soil_vitality_label": "Stable Soil Health",
                    "yield_probability_label": scenario["listing"]["quality_band"],
                },
                "created_at": _timestamp(offset + 6),
                "updated_at": _timestamp(offset + 6),
            }
        )
        documents["harvest_listings"].append(
            {
                "id": listing_id,
                "planting_record_id": planting_id,
                "farmer_profile_id": scenario["farmer_profile_id"],
                "crop_code": scenario["crop_code"],
                "crop_label": scenario["planting"]["crop_label"],
                **scenario["listing"],
                "status": "draft",
                "snapshot": {
                    "soil_vitality_label": "Stable Soil Health",
                    "yield_probability_label": scenario["listing"]["quality_band"],
                },
                "created_at": _timestamp(offset + 7),
                "updated_at": _timestamp(offset + 7),
            }
        )
        for buyer_index, buyer_id in enumerate(scenario["buyers"], start=1):
            documents["listing_buyer_interests"].append(
                {
                    "id": f"{scenario['prefix']}-interest-{buyer_index}",
                    "harvest_listing_id": listing_id,
                    "buyer_profile_id": buyer_id,
                    "interest_type": "watching" if buyer_index == 1 else "quote_requested",
                    "reserved_quantity_kg": None,
                    "note": f"Seeded interest for {scenario['planting']['crop_label']}",
                    "created_at": _timestamp(offset + 7 + buyer_index),
                    "updated_at": _timestamp(offset + 7 + buyer_index),
                }
            )
        offset += 20

    return documents
