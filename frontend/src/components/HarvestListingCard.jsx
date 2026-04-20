import React from "react";

export default function HarvestListingCard({ listing, onReserve, reserved }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md relative">
      {reserved && (
        <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold shadow border border-green-300 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-green-700" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          Funds Secured
        </div>
      )}
      <div className="h-48 relative">
        <img alt={listing.crop || "Harvest field"} className="w-full h-full object-cover" src={listing.imageUrl || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"} />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="font-headline font-bold text-lg text-on-surface leading-tight">{listing.title || listing.crop}</h4>
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">Est. Volume: {listing.estimatedVolume || 'N/A'}</p>
          </div>
          <div className="text-right">
            <span className="block font-headline font-extrabold text-xl text-primary leading-none">RM {listing.price || 'N/A'}</span>
            <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-tighter">Reservation Lock</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-surface-container-low/50 p-3 rounded-lg flex flex-col items-center text-center">
            <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Expected Harvest</span>
            <span className="font-semibold text-sm text-primary">{listing.harvestWindow || 'N/A'}</span>
          </div>
          <div className="bg-surface-container-low/50 p-3 rounded-lg flex flex-col items-center text-center">
            <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Region</span>
            <span className="font-semibold text-sm text-primary">{listing.region || 'N/A'}</span>
          </div>
        </div>
        <button
          className="w-full py-4 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
          onClick={onReserve}
          type="button"
        >
          <span className="material-symbols-outlined text-lg" data-icon="calendar_month">calendar_month</span>
          <span>{reserved ? 'Funds Secured' : 'Secure Future Supply'}</span>
        </button>
      </div>
    </div>
  );
}
