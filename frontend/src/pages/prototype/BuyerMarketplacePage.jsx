

import { useNavigate } from "react-router-dom"
import BuyerShell from "@/components/BuyerShell"
import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"
import { useHarvest } from "../../context/HarvestContext"
import { useState } from "react"
import ReservationModal from "../../components/ReservationModal"

const styles = [
  "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .glass-insight {\n            background: rgba(250, 249, 246, 0.7);\n            backdrop-filter: blur(12px);\n            -webkit-backdrop-filter: blur(12px);\n        }\n        .no-scrollbar::-webkit-scrollbar {\n            display: none;\n        }\n        .no-scrollbar {\n            -ms-overflow-style: none;\n            scrollbar-width: none;\n        }\n    "
]

const themeStyle = {
  "--color-surface-container-high": "#e9e8e5",
  "--color-surface-container-low": "#f4f3f1",
  "--color-inverse-on-surface": "#f2f1ee",
  "--color-on-background": "#1a1c1a",
  "--color-on-primary-container": "#c2e4b4",
  "--color-surface-tint": "#4a6741",
  "--color-on-secondary-fixed-variant": "#3e4c16",
  "--color-secondary": "#56642b",
  "--color-on-tertiary": "#ffffff",
  "--color-tertiary-container": "#cba72f",
  "--color-on-secondary-container": "#5a682f",
  "--color-primary": "#4a6741",
  "--color-primary-container": "#4a6741",
  "--color-surface-bright": "#faf9f6",
  "--color-surface-variant": "#e3e2e0",
  "--color-on-tertiary-container": "#4e3d00",
  "--color-secondary-fixed": "#d9eaa3",
  "--color-surface-container-lowest": "#ffffff",
  "--color-on-primary": "#ffffff",
  "--color-error-container": "#ffdad6",
  "--color-on-error": "#ffffff",
  "--color-on-primary-fixed-variant": "#324e2a",
  "--color-error": "#ba1a1a",
  "--color-on-surface-variant": "#434840",
  "--color-background": "#faf9f6",
  "--color-primary-fixed": "#caecbc",
  "--color-tertiary-fixed": "#ffe088",
  "--color-inverse-primary": "#afd0a1",
  "--color-surface-container": "#efeeeb",
  "--color-on-surface": "#1a1c1a",
  "--color-on-tertiary-fixed": "#241a00",
  "--color-secondary-fixed-dim": "#bdce89",
  "--color-tertiary-fixed-dim": "#e9c349",
  "--color-surface-dim": "#dbdad7",
  "--color-on-secondary": "#ffffff",
  "--color-surface-container-highest": "#e3e2e0",
  "--color-outline-variant": "#c3c8bd",
  "--color-on-primary-fixed": "#062104",
  "--color-inverse-surface": "#2f312f",
  "--color-outline": "#73796f",
  "--color-on-secondary-fixed": "#161f00",
  "--color-on-error-container": "#93000a",
  "--color-surface": "#faf9f6",
  "--color-secondary-container": "#d6e7a1",
  "--color-tertiary": "#735c00",
  "--color-primary-fixed-dim": "#afd0a1",
  "--color-on-tertiary-fixed-variant": "#574500",
  "--font-sans": "Inter",
  "--font-body": "Inter",
  "--font-label": "Inter",
  "--font-headline": "Manrope",
  "--radius": "1rem",
  "--radius-lg": "2rem",
  "--radius-xl": "3rem"
}


import { formatToDDMMYY } from "@/lib/utils"

function BuyerMarketplacePage() {
  const navigate = useNavigate();
  const { listings, loading, error, reservationStatus } = useHarvest();

  // Projected harvests: filter listings with a 'projected' flag or show all for demo
  const projectedHarvests = listings
    .filter(l => l.projected || ['PROJECTED', 'projected', 'published', 'funds_secured'].includes(l.status))
    .map(l => ({
      ...l,
      title: l.title || l.listing_title || l.crop_label || l.crop,
      crop: l.crop || l.crop_code,
      estimatedVolume: l.estimatedVolume || (l.estimated_yield_min_kg ? `${l.estimated_yield_min_kg}kg - ${l.estimated_yield_max_kg}kg` : 'N/A'),
      price: l.price || (l.reservation_discount_pct ? `${l.reservation_discount_pct}% off` : 'N/A'),
      harvestWindow: l.harvestWindow || (l.harvest_window_start ? `${formatToDDMMYY(l.harvest_window_start)} to ${formatToDDMMYY(l.harvest_window_end)}` : 'N/A'),
      region: l.region || 'Kedah',
    }));

  const availableHarvests = listings.filter(l => !l.projected && !['PROJECTED', 'projected', 'published', 'funds_secured'].includes(l.status));

  return (
    <PrototypePageFrame>
      <BuyerShell>
        <main className="max-w-md mx-auto px-6 pt-6 pb-36 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-headline font-bold text-xl text-on-surface tracking-tight">Projected Harvest Windows</h3>
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1.5 rounded-full">Projected</span>
            </div>
            <div className="space-y-6">
              {loading && <div className="text-center text-on-surface-variant">Loading listings...</div>}
              {error && <div className="text-center text-error">{error}</div>}
              {(!loading && projectedHarvests.length === 0) && <div className="text-center text-on-surface-variant">No projected harvests.</div>}
              {projectedHarvests.map(listing => (
                <div key={listing.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md relative">
                  {/* Funds Secured badge if reserved */}
                  {(reservationStatus[listing.id]?.status === 'funds_secured' || listing.status === 'funds_secured') && (
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
                      className={`w-full py-4 ${reservationStatus[listing.id]?.status === 'funds_secured' || listing.status === 'funds_secured' ? 'bg-surface-container-high text-primary' : 'bg-primary text-on-primary'} font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md`}
                      onClick={() => navigate(ROUTES.BUYER_FUTURE_SUPPLY_READINESS, { state: { listing } })}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg" data-icon={reservationStatus[listing.id]?.status === 'funds_secured' || listing.status === 'funds_secured' ? 'verified' : 'calendar_month'}>
                        {reservationStatus[listing.id]?.status === 'funds_secured' || listing.status === 'funds_secured' ? 'verified' : 'calendar_month'}
                      </span>
                      <span>{reservationStatus[listing.id]?.status === 'funds_secured' || listing.status === 'funds_secured' ? 'View Details' : 'Secure Future Supply'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Market Insight (static highlight) */}
          <section className="glass-insight p-6 rounded-xl border border-white/40 shadow-xl relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined" data-icon="psychology" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <div>
                <h5 className="font-headline font-bold text-on-surface text-sm">AI Market Insight: Bullish</h5>
                <p className="text-xs text-on-surface-variant leading-relaxed">Paddy demand is projected to rise 14% by Dec. Secure your March 2026 reservation now to lock in current rates.</p>
              </div>
            </div>
          </section>
        </main>
      </BuyerShell>
    </PrototypePageFrame>
  );
}

export default BuyerMarketplacePage;
