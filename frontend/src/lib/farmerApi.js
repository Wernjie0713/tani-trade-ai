import { apiRequest } from "@/lib/api"

const proposalRequestCache = new Map()

export function getDemoBootstrap() {
  return apiRequest("/demo/bootstrap")
}

export function createFarmerIntake(rawText) {
  return apiRequest("/farmer/intakes", {
    method: "POST",
    body: JSON.stringify({ raw_text: rawText }),
  })
}

export function getFarmerIntake(requestId) {
  return apiRequest(`/farmer/intakes/${requestId}`)
}

export function getOrCreateFarmerMatches(requestId) {
  return apiRequest(`/farmer/intakes/${requestId}/matches`, {
    method: "POST",
  })
}

export function getOrCreateFarmerProposal(matchId) {
  if (proposalRequestCache.has(matchId)) {
    return proposalRequestCache.get(matchId)
  }

  const request = apiRequest(`/farmer/matches/${matchId}/proposal`, {
    method: "POST",
  })
    .finally(() => {
      proposalRequestCache.delete(matchId)
    })

  proposalRequestCache.set(matchId, request)
  return request
}

export function acceptFarmerProposal(proposalId) {
  return apiRequest(`/farmer/proposals/${proposalId}/accept`, {
    method: "POST",
  })
}

export function getFarmerTrade(tradeId) {
  return apiRequest(`/farmer/trades/${tradeId}`)
}

export function createOrUpdatePlanting(tradeId, payload) {
  return apiRequest(`/farmer/trades/${tradeId}/planting`, {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getHarvestListing(listingId) {
  return apiRequest(`/farmer/harvest-listings/${listingId}`)
}
