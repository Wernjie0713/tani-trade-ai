import React, { useState } from "react";

export default function ReservationModal({ open, onClose, onReserve, listing }) {
  const [amount, setAmount] = useState(listing?.price || "");
  const [buyer, setBuyer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  async function handleReserve(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onReserve(listing.id, { 
        harvest_listing_id: listing.id,
        buyer_id: buyer, 
        quantity_kg: parseInt(amount) || 100,
        status: 'RESERVED'
      });
      onClose();
    } catch (err) {
      setError("Reservation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="font-headline font-bold text-xl mb-4">Reserve Harvest</h2>
        <form onSubmit={handleReserve} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold mb-1">Buyer Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={buyer}
              onChange={e => setBuyer(e.target.value)}
              required
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Amount (RM)</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
              min={1}
            />
          </div>
          {error && <div className="text-error text-xs">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all shadow-md"
            disabled={submitting}
          >
            {submitting ? "Reserving..." : "Confirm Reservation"}
          </button>
        </form>
      </div>
    </div>
  );
}
