import { useNavigate } from "react-router-dom"
import BuyerShell from "@/components/BuyerShell"
import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"
import { useHarvest } from "../../context/HarvestContext"

const styles = [
  "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n    "
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

function BuyerReservationsPage() {
  const navigate = useNavigate();
  const { listings, loading, error, reservationStatus } = useHarvest();

  // Filter listings that have been reserved by this user
  // For demo, we just show anything that is 'funds_secured'
  const reservedHarvests = listings
    .filter(l => l.status === 'funds_secured' || reservationStatus[l.id]?.status === 'funds_secured')
    .map(l => ({
      ...l,
      title: l.title || l.listing_title || l.crop_label || l.crop,
      crop: l.crop || l.crop_code,
      estimatedVolume: l.estimatedVolume || (l.estimated_yield_min_kg ? `${l.estimated_yield_min_kg}kg - ${l.estimated_yield_max_kg}kg` : 'N/A'),
      price: l.price || (l.reservation_discount_pct ? `${l.reservation_discount_pct}% off` : 'N/A'),
      harvestWindow: l.harvestWindow || (l.harvest_window_start ? `${formatToDDMMYY(l.harvest_window_start)} to ${formatToDDMMYY(l.harvest_window_end)}` : 'N/A'),
      region: l.region || 'Kedah',
    }));

  return (
    <PrototypePageFrame
      title="TaniTrade AI - My Reservations"
      htmlClass=""
      bodyClass="bg-background text-on-surface min-h-screen pb-14"
      styles={styles}
      themeStyle={themeStyle}
    >
      <BuyerShell activeNav="reservations" headerTitle="My Reservations">
        <main className="max-w-md mx-auto px-6 pt-6 pb-24 space-y-8">
          <section className="space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-primary leading-tight">
              Reserved Supply
            </h1>
            <p className="text-on-surface-variant text-base leading-relaxed font-medium">
              These are the future harvests you have secured. You can monitor their progress leading up to the harvest window.
            </p>

            <div className="space-y-6">
              {loading && <div className="text-center text-on-surface-variant">Loading your reservations...</div>}
              {error && <div className="text-center text-error">{error}</div>}
              {(!loading && reservedHarvests.length === 0) && (
                <div className="text-center text-on-surface-variant p-8 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
                  <p>You haven't reserved any supply yet.</p>
                  <button 
                    className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-full text-sm font-bold shadow-md hover:scale-105 transition-all"
                    onClick={() => navigate(ROUTES.BUYER_MARKETPLACE)}
                  >
                    Browse Marketplace
                  </button>
                </div>
              )}
              {reservedHarvests.map(listing => (
                <div key={listing.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md relative">
                  <div className="absolute top-4 left-4 z-10 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold shadow border border-green-300 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-green-700" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Funds Secured
                  </div>
                  
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
                      className="w-full py-4 bg-surface-container-high text-primary font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
                      onClick={() => navigate(ROUTES.BUYER_FUTURE_SUPPLY_READINESS, { state: { listing } })}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg" data-icon="visibility">visibility</span>
                      <span>Review Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </BuyerShell>
    </PrototypePageFrame>
  );
}

export default BuyerReservationsPage;