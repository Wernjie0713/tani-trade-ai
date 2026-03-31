from __future__ import annotations

import re


def normalize_phrase(value: str) -> str:
    lowered = value.strip().lower()
    lowered = re.sub(r"[^a-z0-9\s]", " ", lowered)
    lowered = re.sub(r"\s+", " ", lowered)
    return lowered.strip()


CROP_CATALOG = {
    "paddy": {
        "label": "Paddy (MR269)",
        "aliases": [
            "premium paddy",
            "mr269",
            "mr219",
            "rice field",
            "paddy rice",
            "sawah",
            "rice",
            "padi",
            "paddy",
        ],
    },
    "sweet_corn": {
        "label": "Sweet Corn",
        "aliases": [
            "sweet corn",
            "corn crop",
            "corn",
            "jagung manis",
            "jagung",
        ],
    },
    "chili": {
        "label": "Chili",
        "aliases": [
            "chili padi",
            "chili merah",
            "cili padi",
            "cili merah",
            "chili",
            "cili",
        ],
    },
    "okra": {
        "label": "Okra",
        "aliases": [
            "lady finger",
            "lady's finger",
            "bendi",
            "okra",
        ],
    },
    "cucumber": {
        "label": "Cucumber",
        "aliases": [
            "timun jepun",
            "timun",
            "cucumber",
        ],
    },
    "banana": {
        "label": "Banana",
        "aliases": [
            "pisang berangan",
            "pisang tanduk",
            "banana",
            "pisang",
        ],
    },
}


ITEM_CATALOG = {
    "nitrogen_fertilizer": {
        "display_name": "Nitrogen Fertilizer",
        "category": "fertilizer",
        "default_unit": "bag",
        "aliases": [
            "nitrogen fertilizer",
            "urea fertilizer",
            "baja nitrogen",
            "baja urea",
            "urea",
            "fertilizer",
            "baja",
        ],
    },
    "npk_fertilizer": {
        "display_name": "NPK Fertilizer",
        "category": "fertilizer",
        "default_unit": "bag",
        "aliases": [
            "npk fertilizer",
            "compound fertilizer",
            "sebatian fertilizer",
            "baja sebatian",
            "npk",
        ],
    },
    "bio_fertilizer": {
        "display_name": "Bio-Fertilizer",
        "category": "fertilizer",
        "default_unit": "bag",
        "aliases": [
            "bio fertilizer",
            "bio-fertilizer",
            "organic fertilizer",
            "fertilizer compost",
            "compost fertilizer",
            "baja organik",
        ],
    },
    "organic_pesticide": {
        "display_name": "Organic Pesticide",
        "category": "pesticide",
        "default_unit": "liter",
        "aliases": [
            "organic pesticide",
            "racun organik",
            "spray organik",
            "bio pesticide",
            "biopesticide",
            "pesticide",
            "racun serangga",
            "racun",
        ],
    },
    "fungicide": {
        "display_name": "Fungicide",
        "category": "fungicide",
        "default_unit": "liter",
        "aliases": [
            "racun kulat",
            "anti fungal spray",
            "fungicide",
        ],
    },
    "herbicide": {
        "display_name": "Herbicide",
        "category": "herbicide",
        "default_unit": "liter",
        "aliases": [
            "weed killer",
            "racun rumpai",
            "herbicide",
        ],
    },
    "seedling_trays": {
        "display_name": "Seedling Trays",
        "category": "equipment",
        "default_unit": "set",
        "aliases": [
            "seedling trays",
            "nursery tray",
            "seed tray",
            "tray semaian",
            "tray",
            "trays",
        ],
    },
    "seed_pack": {
        "display_name": "Seed Pack",
        "category": "seed",
        "default_unit": "pack",
        "aliases": [
            "seed pack",
            "seed packs",
            "pack benih",
            "benih",
            "seeds",
            "seed",
        ],
    },
    "rice_seedlings": {
        "display_name": "Rice Seedlings",
        "category": "seedlings",
        "default_unit": "tray",
        "aliases": [
            "rice seedlings",
            "paddy seedlings",
            "anak padi",
            "seedlings padi",
        ],
    },
    "chili_seedlings": {
        "display_name": "Chili Seedlings",
        "category": "seedlings",
        "default_unit": "tray",
        "aliases": [
            "chili seedlings",
            "cili seedlings",
            "anak benih cili",
            "anak benih chili",
        ],
    },
    "corn_seed_pack": {
        "display_name": "Corn Seed Pack",
        "category": "seed",
        "default_unit": "pack",
        "aliases": [
            "corn seed pack",
            "sweet corn seed",
            "benih jagung",
        ],
    },
    "okra_seed_pack": {
        "display_name": "Okra Seed Pack",
        "category": "seed",
        "default_unit": "pack",
        "aliases": [
            "okra seed pack",
            "bendi seed",
            "benih bendi",
        ],
    },
    "cucumber_seed_pack": {
        "display_name": "Cucumber Seed Pack",
        "category": "seed",
        "default_unit": "pack",
        "aliases": [
            "cucumber seed pack",
            "timun seed",
            "benih timun",
        ],
    },
    "banana_suckers": {
        "display_name": "Banana Suckers",
        "category": "seedlings",
        "default_unit": "set",
        "aliases": [
            "banana suckers",
            "pisang suckers",
            "anak pokok pisang",
        ],
    },
    "compost_tea": {
        "display_name": "Compost Tea",
        "category": "soil_treatment",
        "default_unit": "liter",
        "aliases": [
            "compost tea",
            "liquid compost",
            "teh kompos",
        ],
    },
    "potting_mix": {
        "display_name": "Potting Mix",
        "category": "soil_treatment",
        "default_unit": "bag",
        "aliases": [
            "potting mix",
            "soil mix",
            "media tanaman",
        ],
    },
    "mulch_sheet": {
        "display_name": "Mulch Sheet",
        "category": "support",
        "default_unit": "roll",
        "aliases": [
            "mulch sheet",
            "plastic mulch",
            "mulsa plastik",
            "mulch",
        ],
    },
    "irrigation_hose": {
        "display_name": "Irrigation Hose",
        "category": "irrigation",
        "default_unit": "roll",
        "aliases": [
            "irrigation hose",
            "drip hose",
            "water hose",
            "hos irigasi",
            "hos siraman",
        ],
    },
    "bamboo_stakes": {
        "display_name": "Bamboo Stakes",
        "category": "support",
        "default_unit": "bundle",
        "aliases": [
            "bamboo stakes",
            "staking poles",
            "buluh pancang",
            "bamboo poles",
        ],
    },
    "fruit_crates": {
        "display_name": "Fruit Crates",
        "category": "packaging",
        "default_unit": "crate",
        "aliases": [
            "fruit crates",
            "crate buah",
            "bakul buah",
            "crates",
            "crate",
        ],
    },
    "hand_sprayer": {
        "display_name": "Hand Sprayer",
        "category": "equipment",
        "default_unit": "set",
        "aliases": [
            "hand sprayer",
            "sprayer set",
            "pam racun",
            "sprayer",
        ],
    },
    "shovel_set": {
        "display_name": "Shovel Set",
        "category": "equipment",
        "default_unit": "set",
        "aliases": [
            "shovel set",
            "garden tools",
            "cangkul",
            "shovel",
            "tools",
        ],
    },
}


TIMELINE_ALIASES = [
    ("tomorrow", "Tomorrow", 1),
    ("esok", "Tomorrow", 1),
    ("today", "Today", 0),
    ("hari ini", "Today", 0),
    ("this week", "This Week", 3),
    ("minggu ini", "This Week", 3),
    ("next week", "Next Week", 7),
    ("minggu depan", "Next Week", 7),
    ("next month", "Next Month", 30),
    ("bulan depan", "Next Month", 30),
    ("next season", "Next Season", 60),
    ("musim depan", "Next Season", 60),
]


URGENT_ALIASES = {
    "high": ["urgent", "immediate", "asap", "cepat", "segera", "today", "hari ini", "esok"],
    "medium": ["next week", "minggu depan", "soon", "this week", "minggu ini", "planting next week"],
}


UNIT_ALIASES = {
    "kg": "kg",
    "kilogram": "kg",
    "kilograms": "kg",
    "g": "g",
    "gram": "g",
    "grams": "g",
    "l": "liter",
    "liter": "liter",
    "liters": "liter",
    "litre": "liter",
    "litres": "liter",
    "bag": "bag",
    "bags": "bag",
    "pack": "pack",
    "packs": "pack",
    "set": "set",
    "sets": "set",
    "crate": "crate",
    "crates": "crate",
    "tray": "tray",
    "trays": "tray",
    "roll": "roll",
    "rolls": "roll",
    "bundle": "bundle",
    "bundles": "bundle",
}


def find_crop_code(text: str) -> str | None:
    return _best_catalog_match(text, CROP_CATALOG)


def find_item_code(text: str) -> str | None:
    return _best_catalog_match(text, ITEM_CATALOG)


def item_display_name(item_code: str, fallback: str = "Unknown Item") -> str:
    item = ITEM_CATALOG.get(item_code)
    return item["display_name"] if item else fallback


def item_category(item_code: str, fallback: str = "other") -> str:
    item = ITEM_CATALOG.get(item_code)
    return item["category"] if item else fallback


def item_default_unit(item_code: str, fallback: str = "unit") -> str:
    item = ITEM_CATALOG.get(item_code)
    return item["default_unit"] if item else fallback


def crop_label(crop_code: str, fallback: str = "Paddy (MR269)") -> str:
    crop = CROP_CATALOG.get(crop_code)
    return crop["label"] if crop else fallback


def _best_catalog_match(text: str, catalog: dict[str, dict[str, str | list[str]]]) -> str | None:
    normalized = normalize_phrase(text)
    best_code = None
    best_length = 0

    for code, entry in catalog.items():
        aliases = entry.get("aliases", [])
        for alias in aliases:
            normalized_alias = normalize_phrase(alias)
            if normalized_alias and normalized_alias in normalized and len(normalized_alias) > best_length:
                best_code = code
                best_length = len(normalized_alias)

    return best_code
