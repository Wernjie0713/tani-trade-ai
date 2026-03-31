export const ITEM_OPTIONS = [
  { normalizedName: "nitrogen_fertilizer", displayName: "Nitrogen Fertilizer", defaultUnit: "bag" },
  { normalizedName: "npk_fertilizer", displayName: "NPK Fertilizer", defaultUnit: "bag" },
  { normalizedName: "bio_fertilizer", displayName: "Bio-Fertilizer", defaultUnit: "bag" },
  { normalizedName: "organic_pesticide", displayName: "Organic Pesticide", defaultUnit: "liter" },
  { normalizedName: "fungicide", displayName: "Fungicide", defaultUnit: "liter" },
  { normalizedName: "herbicide", displayName: "Herbicide", defaultUnit: "liter" },
  { normalizedName: "seedling_trays", displayName: "Seedling Trays", defaultUnit: "set" },
  { normalizedName: "seed_pack", displayName: "Seed Pack", defaultUnit: "pack" },
  { normalizedName: "rice_seedlings", displayName: "Rice Seedlings", defaultUnit: "tray" },
  { normalizedName: "chili_seedlings", displayName: "Chili Seedlings", defaultUnit: "tray" },
  { normalizedName: "corn_seed_pack", displayName: "Corn Seed Pack", defaultUnit: "pack" },
  { normalizedName: "okra_seed_pack", displayName: "Okra Seed Pack", defaultUnit: "pack" },
  { normalizedName: "cucumber_seed_pack", displayName: "Cucumber Seed Pack", defaultUnit: "pack" },
  { normalizedName: "banana_suckers", displayName: "Banana Suckers", defaultUnit: "set" },
  { normalizedName: "compost_tea", displayName: "Compost Tea", defaultUnit: "liter" },
  { normalizedName: "potting_mix", displayName: "Potting Mix", defaultUnit: "bag" },
  { normalizedName: "mulch_sheet", displayName: "Mulch Sheet", defaultUnit: "roll" },
  { normalizedName: "irrigation_hose", displayName: "Irrigation Hose", defaultUnit: "roll" },
  { normalizedName: "bamboo_stakes", displayName: "Bamboo Stakes", defaultUnit: "bundle" },
  { normalizedName: "fruit_crates", displayName: "Fruit Crates", defaultUnit: "crate" },
  { normalizedName: "hand_sprayer", displayName: "Hand Sprayer", defaultUnit: "set" },
  { normalizedName: "shovel_set", displayName: "Shovel Set", defaultUnit: "set" },
]

export const TIMELINE_OPTIONS = [
  { label: "Today", days: 0 },
  { label: "Tomorrow", days: 1 },
  { label: "This Week", days: 3 },
  { label: "Next Week", days: 7 },
  { label: "Next Month", days: 30 },
  { label: "Next Season", days: 60 },
]

export const UNIT_OPTIONS = ["bag", "liter", "set", "crate", "pack", "tray", "roll", "bundle", "kg", "g"]

export function findItemOption(normalizedName) {
  return ITEM_OPTIONS.find((item) => item.normalizedName === normalizedName) || null
}
