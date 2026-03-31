import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

import FarmerShell from "@/components/FarmerShell"
import PrototypePageFrame from "@/components/PrototypePageFrame"
import { useFarmerFlow } from "@/context/FarmerFlowContext"
import { getHarvestListing } from "@/lib/farmerApi"
import {
  defaultHarvestImage,
  fallbackAvatar,
  formatConfidence,
  formatNumber,
} from "@/lib/farmerFlow"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      body {\n        font-family: 'Inter', sans-serif;\n        background-color: #FAF9F6;\n      }\n      h1, h2, h3 {\n        font-family: 'Manrope', sans-serif;\n      }\n      .shimmer-bg {\n        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);\n        background-size: 200% 100%;\n        animation: shimmer 2s infinite;\n      }\n      @keyframes shimmer {\n        0% { background-position: -200% 0; }\n        100% { background-position: 200% 0; }\n      }\n      .glow-border {\n        position: relative;\n      }\n      .glow-border::after {\n        content: '';\n        position: absolute;\n        inset: -2px;\n        background: linear-gradient(45deg, #4A6741, #ffe088, #4A6741);\n        border-radius: inherit;\n        z-index: -1;\n        opacity: 0.3;\n        filter: blur(8px);\n      }\n    ",
]

const themeStyle = {
  "--color-surface-container-high": "#e9e8e5",
  "--color-surface-container-low": "#f4f3f1",
  "--color-inverse-on-surface": "#f2f1ee",
  "--color-on-background": "#1a1c1a",
  "--color-on-primary-container": "#c2e4b4",
  "--color-surface-tint": "#496640",
  "--color-on-secondary-fixed-variant": "#3e4c16",
  "--color-secondary": "#56642b",
  "--color-on-tertiary": "#ffffff",
  "--color-tertiary-container": "#cba72f",
  "--color-on-secondary-container": "#5a682f",
  "--color-primary": "#4A6741",
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
  "--font-sans": "Inter, sans-serif",
  "--font-body": "Inter, sans-serif",
  "--font-label": "Inter, sans-serif",
  "--font-headline": "Manrope, sans-serif",
  "--radius": "1rem",
  "--radius-lg": "2rem",
  "--radius-xl": "2.5rem",
}

function FarmerFutureSupplyReadinessPage() {
  const navigate = useNavigate()
  const { flowIds } = useFarmerFlow()
  const [screenState, setScreenState] = useState({
    status: "loading",
    data: null,
    error: null,
  })

  useEffect(() => {
    let isActive = true

    async function loadListing() {
      setScreenState({
        status: "loading",
        data: null,
        error: null,
      })

      try {
        const data = await getHarvestListing(flowIds.harvestListingId)
        if (!isActive) {
          return
        }

        setScreenState({
          status: "success",
          data,
          error: null,
        })
      } catch (error) {
        if (!isActive) {
          return
        }

        setScreenState({
          status: "error",
          data: null,
          error: error.message || "Unable to load the harvest listing preview.",
        })
      }
    }

    loadListing()

    return () => {
      isActive = false
    }
  }, [flowIds.harvestListingId])

  if (!flowIds.harvestListingId) {
    return <Navigate replace to={ROUTES.FARMER_RECORD_PLANTING} />
  }

  const listing = screenState.data

  return (
    <PrototypePageFrame
      title="TaniTrade AI - Farmer Harvest Listing"
      htmlClass=""
      bodyClass="bg-background text-on-surface min-h-screen pb-32"
      styles={styles}
      themeStyle={themeStyle}
    >
      <FarmerShell
        activeNav="harvest"
        containerClassName="max-w-2xl"
        headerTitle="Harvest Listing"
      >
        <main className="max-w-2xl mx-auto px-6 pt-6 pb-32 space-y-8">
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-black tracking-widest uppercase border border-primary/20">
              <span
                className="material-symbols-outlined text-xs"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              Farmer Listing Preview
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary leading-tight">
              Future Supply Readiness
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed font-medium">
              This is the buyer-facing listing your farm can publish after planting. Yield math is grounded in your recorded crop, planted area, and input quality.
            </p>
          </section>

          {screenState.status === "loading" && (
            <div className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-surface-variant">
                Finalizing projected yield, quality band, and buyer demand signals...
              </p>
            </div>
          )}

          {screenState.status === "error" && (
            <div className="rounded-[2rem] border border-error/20 bg-error-container/60 p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-error-container">
                {screenState.error}
              </p>
            </div>
          )}

          {listing && (
            <>
              <div className="relative">
                <div className="relative bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl shadow-primary/5 flex flex-col border border-outline-variant/30">
                  <div className="w-full h-72 relative overflow-hidden group">
                    <img
                      alt={listing.crop_label}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={defaultHarvestImage(listing.crop_code)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-primary text-on-primary px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
                        {listing.crop_label}
                      </span>
                      <span className="bg-tertiary-container/90 text-on-tertiary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 backdrop-blur-md">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        {listing.status === "draft" ? "Draft Readiness" : "Market Ready"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                          Est. Harvest Yield
                        </p>
                        <h2 className="text-3xl font-black text-on-surface tracking-tighter">
                          {formatNumber(listing.estimated_yield_min_kg)}kg - {formatNumber(listing.estimated_yield_max_kg)}kg
                        </h2>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                          Window
                        </p>
                        <p className="font-bold text-lg text-on-surface">
                          {listing.harvest_window_label}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-tertiary-fixed rounded-2xl relative overflow-hidden border border-tertiary-container/30">
                        <div className="absolute inset-0 shimmer-bg opacity-20"></div>
                        <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center relative z-10">
                          <span className="material-symbols-outlined text-on-tertiary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                            loyalty
                          </span>
                        </div>
                        <div className="relative z-10">
                          <p className="text-[10px] font-black text-on-tertiary-fixed uppercase tracking-widest">
                            Early Incentive
                          </p>
                          <p className="text-sm font-bold text-on-tertiary-fixed-variant">
                            {listing.early_incentive_label}
                          </p>
                        </div>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed font-medium italic">
                        "{listing.listing_note}"
                      </p>
                    </div>

                    <div className="pt-6 border-t border-outline-variant/30 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {listing.buyer_previews.slice(0, 2).map((buyer) => (
                          <div
                            className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container overflow-hidden"
                            key={buyer.buyer_name}
                          >
                            <img
                              alt={buyer.buyer_name}
                              src={buyer.avatar_url || fallbackAvatar(buyer.buyer_name)}
                            />
                          </div>
                        ))}
                        {listing.buyer_interest_count > 2 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary text-[10px] text-on-primary font-bold">
                            +{listing.buyer_interest_count - 2}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-[11px] font-bold text-primary tracking-wide">
                          {listing.buyer_interest_count} BUYERS SEEING THIS SUPPLY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section className="bg-[#1a1c1a] text-white rounded-xl p-8 relative overflow-hidden shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-24 -mt-24 blur-[80px]"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/10 rounded-full -ml-20 -mb-20 blur-[60px]"></div>
                <div className="relative z-10 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40">
                        <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                          analytics
                        </span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-xl">AI Harvest Intelligence</h3>
                        <p className="text-[10px] text-primary-fixed uppercase font-black tracking-widest opacity-60">
                          Engine Protocol v2.4.8
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-primary/20 px-3 py-1 rounded-full border border-primary/40 mb-1">
                        <span className="text-primary-fixed font-black text-[11px] tracking-tight">
                          {formatConfidence(listing.confidence_score)}% CONFIDENCE
                        </span>
                      </div>
                      <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                        Real-time Verified
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-black text-white/40 tracking-widest">
                        Soil Vitality Index
                      </p>
                      <p className="text-sm font-bold flex items-center gap-2">
                        {listing.soil_vitality_label}
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] uppercase font-black text-white/40 tracking-widest">
                        Yield Probability
                      </p>
                      <p className="text-sm font-bold text-tertiary-fixed">
                        {listing.yield_probability_label}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-white/80 leading-relaxed font-medium italic">
                    "This is the listing preview buyers will see. It uses your recorded planting inputs, seeded crop baselines, and estimated harvest timing. Final availability still depends on the real harvest."
                  </p>
                </div>
              </section>
            </>
          )}

          <section className="space-y-4 pt-4">
            <div className="flex flex-col gap-4">
              <button
                className="w-full bg-primary text-on-primary py-5 rounded-full font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
                onClick={() => navigate(ROUTES.HOME)}
                type="button"
              >
                Publish Listing
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </button>
              <button
                className="w-full bg-surface-container-highest text-on-surface py-5 rounded-full font-bold text-lg hover:bg-surface-container-high transition-all"
                onClick={() => navigate(ROUTES.FARMER_RECORD_PLANTING)}
                type="button"
              >
                Edit Planting Details
              </button>
            </div>

            <div className="flex items-start gap-3 px-2 pt-2">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] mt-0.5">
                info
              </span>
              <p className="text-[11px] text-on-surface-variant font-medium leading-tight">
                This is a working farmer-side preview of the listing. Buyer demand cards remain seeded in this MVP, but the listing content and projection are generated live from your backend flow.
              </p>
            </div>
          </section>
        </main>
      </FarmerShell>
    </PrototypePageFrame>
  )
}

export default FarmerFutureSupplyReadinessPage
