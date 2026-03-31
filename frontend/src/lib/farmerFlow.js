const numberFormatter = new Intl.NumberFormat("en-MY", {
  maximumFractionDigits: 1,
})

const shortDateFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

const longDateTimeFormatter = new Intl.DateTimeFormat("en-MY", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const singularUnits = {
  bag: "bag",
  kg: "kg",
  g: "g",
  liter: "liter",
  set: "set",
  pack: "pack",
  crate: "crate",
}

const pluralUnits = {
  bag: "bags",
  kg: "kg",
  g: "g",
  liter: "liters",
  set: "sets",
  pack: "packs",
  crate: "crates",
}

export function formatNumber(value) {
  return numberFormatter.format(Number(value || 0))
}

export function formatConfidence(value) {
  if (value == null) {
    return 0
  }

  const numeric = Number(value)
  return numeric <= 1 ? Math.round(numeric * 100) : Math.round(numeric)
}

export function formatQuantity(value, unit) {
  const numeric = Number(value || 0)
  const displayUnit = numeric === 1
    ? singularUnits[unit] || unit
    : pluralUnits[unit] || unit

  return `${formatNumber(numeric)} ${displayUnit}`
}

export function formatCompactQuantity(value, unit) {
  return `${formatNumber(value)}${unit === "liter" ? "L" : unit === "kg" ? "kg" : ` ${unit}`}`
}

export function formatDate(value) {
  if (!value) {
    return ""
  }

  return shortDateFormatter.format(new Date(value))
}

export function formatDateTime(value) {
  if (!value) {
    return ""
  }

  return longDateTimeFormatter.format(new Date(value))
}

export function parseAreaInput(value) {
  const trimmed = value.trim()
  const match = trimmed.match(/(?<amount>\d+(?:\.\d+)?)\s*(?<unit>[a-zA-Z ]+)?/)

  if (!match?.groups?.amount) {
    return null
  }

  return {
    areaValue: Number(match.groups.amount),
    areaUnit: (match.groups.unit || "hectares").trim() || "hectares",
  }
}

export function normalizePlantingDate(value) {
  const trimmed = value.trim()
  if (!trimmed) {
    return null
  }

  const directIso = trimmed.match(/^\d{4}-\d{2}-\d{2}$/)
  if (directIso) {
    return trimmed
  }

  const parsedDate = new Date(trimmed)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate.toISOString().slice(0, 10)
}

export function defaultHarvestImage(cropCode) {
  if (cropCode === "sweet_corn") {
    return "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=1200&q=80"
  }

  return "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80"
}

export function fallbackAvatar() {
  return "https://api.dicebear.com/9.x/lorelei/svg?seed=TaniTradeFallback"
}
