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
            "paddy",
            "rice",
            "sawah",
            "mr269",
            "padi",
        ],
    },
    "sweet_corn": {
        "label": "Sweet Corn",
        "aliases": [
            "sweet corn",
            "corn",
            "jagung manis",
            "jagung",
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
            "fertilizer",
            "nitrogen",
            "urea",
            "baja",
            "baja nitrogen",
        ],
    },
    "organic_pesticide": {
        "display_name": "Organic Pesticide",
        "category": "pesticide",
        "default_unit": "liter",
        "aliases": [
            "organic pesticide",
            "pesticide",
            "racun organik",
            "racun",
            "spray organik",
        ],
    },
    "bio_fertilizer": {
        "display_name": "Bio-Fertilizer",
        "category": "fertilizer",
        "default_unit": "bag",
        "aliases": [
            "bio fertilizer",
            "bio-fertilizer",
            "compost fertilizer",
            "fertilizer compost",
        ],
    },
    "seedling_trays": {
        "display_name": "Seedling Trays",
        "category": "equipment",
        "default_unit": "set",
        "aliases": [
            "seedling trays",
            "tray",
            "nursery tray",
            "trays",
        ],
    },
    "compost_tea": {
        "display_name": "Compost Tea",
        "category": "soil_treatment",
        "default_unit": "liter",
        "aliases": [
            "compost tea",
            "teh kompos",
        ],
    },
    "shovel_set": {
        "display_name": "Shovel Set",
        "category": "equipment",
        "default_unit": "set",
        "aliases": [
            "shovel set",
            "shovel",
            "cangkul",
            "tools",
        ],
    },
    "fruit_crates": {
        "display_name": "Fruit Crates",
        "category": "packaging",
        "default_unit": "crate",
        "aliases": [
            "fruit crates",
            "crate",
            "crates",
            "bakul buah",
        ],
    },
}


TIMELINE_ALIASES = [
    ("tomorrow", "Tomorrow", 1),
    ("esok", "Tomorrow", 1),
    ("today", "Today", 0),
    ("hari ini", "Today", 0),
    ("next week", "Next Week", 7),
    ("minggu depan", "Next Week", 7),
    ("this week", "This Week", 3),
    ("minggu ini", "This Week", 3),
    ("next month", "Next Month", 30),
    ("bulan depan", "Next Month", 30),
]


URGENT_ALIASES = {
    "high": ["urgent", "immediate", "asap", "cepat", "segera", "today", "esok"],
    "medium": ["next week", "minggu depan", "soon", "planting next week"],
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
}


def find_crop_code(text: str) -> str | None:
    normalized = normalize_phrase(text)
    for crop_code, crop in CROP_CATALOG.items():
        if any(alias in normalized for alias in crop["aliases"]):
            return crop_code
    return None


def find_item_code(text: str) -> str | None:
    normalized = normalize_phrase(text)
    for item_code, item in ITEM_CATALOG.items():
        if any(alias in normalized for alias in item["aliases"]):
            return item_code
    return None


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
