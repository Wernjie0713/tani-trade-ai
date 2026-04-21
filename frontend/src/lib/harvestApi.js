// API utility for harvest module endpoints
// Uses the shared apiRequest helper so a single VITE_API_BASE_URL drives all
// backend calls (prevents build-time env-var drift between API clients).

import { apiRequest } from "@/lib/api"

export function createHarvestListing(listing) {
  return apiRequest("/harvest/listings", {
    method: "POST",
    body: JSON.stringify(listing),
  })
}

export function updateHarvestListing(listingId, data) {
  return apiRequest(`/harvest/listings/${listingId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export function listHarvestListings() {
  return apiRequest("/harvest/listings")
}

export function reserveHarvestListing(listingId, reservation) {
  return apiRequest(`/harvest/listings/${listingId}/reserve`, {
    method: "POST",
    body: JSON.stringify(reservation),
  })
}

export function postBuyerRequirement(requirement) {
  return apiRequest("/harvest/buyer-requirements", {
    method: "POST",
    body: JSON.stringify(requirement),
  })
}
