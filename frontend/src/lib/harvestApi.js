// API utility for harvest module endpoints
// Assumes Vite proxy or .env config for API base URL

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function createHarvestListing(listing) {
  const res = await fetch(`${API_BASE}/harvest/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing),
  });
  if (!res.ok) throw new Error('Failed to create listing');
  return await res.json();
}

export async function updateHarvestListing(listingId, data) {
  const res = await fetch(`${API_BASE}/harvest/listings/${listingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update listing');
  return await res.json();
}

export async function listHarvestListings() {
  const res = await fetch(`${API_BASE}/harvest/listings`);
  if (!res.ok) throw new Error('Failed to fetch listings');
  return await res.json();
}

export async function reserveHarvestListing(listingId, reservation) {
  const res = await fetch(`${API_BASE}/harvest/listings/${listingId}/reserve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation),
  });
  if (!res.ok) throw new Error('Failed to reserve listing');
  return await res.json();
}

export async function postBuyerRequirement(requirement) {
  const res = await fetch(`${API_BASE}/harvest/buyer-requirements`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requirement),
  });
  if (!res.ok) throw new Error('Failed to post requirement');
  return await res.json();
}
