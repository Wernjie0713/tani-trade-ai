import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  listHarvestListings,
  createHarvestListing,
  updateHarvestListing,
  reserveHarvestListing,
  postBuyerRequirement
} from '../lib/harvestApi';

const HarvestContext = createContext();

export function HarvestProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reservationStatus, setReservationStatus] = useState({});

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listHarvestListings();
      setListings(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const createListing = async (listing) => {
    await createHarvestListing(listing);
    fetchListings();
  };

  const updateListing = async (listingId, data) => {
    await updateHarvestListing(listingId, data);
    fetchListings();
  };

  const reserveListing = async (listingId, reservation) => {
    const result = await reserveHarvestListing(listingId, reservation);
    setReservationStatus((prev) => ({ ...prev, [listingId]: result }));
    fetchListings();
    return result;
  };

  const postRequirement = async (requirement) => {
    await postBuyerRequirement(requirement);
    // Optionally fetch listings or requirements here
  };

  return (
    <HarvestContext.Provider
      value={{
        listings,
        loading,
        error,
        reservationStatus,
        fetchListings,
        createListing,
        updateListing,
        reserveListing,
        postRequirement,
      }}
    >
      {children}
    </HarvestContext.Provider>
  );
}

export function useHarvest() {
  return useContext(HarvestContext);
}
