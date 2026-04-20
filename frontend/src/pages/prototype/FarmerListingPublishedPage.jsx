import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"

import FarmerShell from "@/components/FarmerShell"
import PrototypePageFrame from "@/components/PrototypePageFrame"
import { useFarmerFlow } from "@/context/FarmerFlowContext"
import { getHarvestListing } from "@/lib/farmerApi"
import { formatDateTime, formatNumber } from "@/lib/farmerFlow"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      body {\n        background: #faf9f6;\n      }\n      .aurora-ring {\n        position: relative;\n      }\n      .aurora-ring::after {\n        content: '';\n        position: absolute;\n        inset: -10px;\n        border-radius: inherit;\n        background: radial-gradient(circle, rgba(74,103,65,0.22), transparent 70%);\n        z-index: -1;\n        filter: blur(22px);\n      }\n    ",
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
  "--font-sans": "Manrope, sans-serif",
  "--font-body": "Manrope, sans-serif",
  "--font-label": "Manrope, sans-serif",
  "--font-headline": "Manrope, sans-serif",
  "--radius": "1rem",
  "--radius-lg": "2rem",
  "--radius-xl": "3rem",
}

function FarmerListingPublishedPage() {
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
          error: error.message || "Unable to load the published listing status.",
        })
      }
    }

    loadListing()

    return () => {
      isActive = false
    }
  }, [flowIds.harvestListingId])

  if (!flowIds.harvestListingId) {
    return <Navigate replace to={ROUTES.FARMER_FUTURE_SUPPLY_READINESS} />
  }

  if (screenState.status === "success" && screenState.data?.status !== "published" && screenState.data?.status !== "funds_secured") {
    return <Navigate replace to={ROUTES.FARMER_FUTURE_SUPPLY_READINESS} />
  }

  const listing = screenState.data

  return (
    <PrototypePageFrame
      title="TaniTrade AI - Listing Published"
      htmlClass=""
      bodyClass="bg-background text-on-surface min-h-screen pb-14"
      styles={styles}
      themeStyle={themeStyle}
    >
      <FarmerShell
        activeNav="harvest"
        backTo={ROUTES.FARMER_FUTURE_SUPPLY_READINESS}
        headerTitle="Listing Published"
      >
        <main className="mx-auto flex max-w-md flex-col gap-8 px-6 pb-24 pt-6">
          <section className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                published_with_changes
              </span>
              Marketplace Live
            </div>
            <h1 className="max-w-2xl font-headline text-4xl font-extrabold tracking-tight text-primary">
              Your harvest listing is now live in the buyer marketplace.
            </h1>
            <p className="max-w-xl text-base font-medium leading-relaxed text-on-surface-variant">
              The listing has moved from internal preview into a published marketplace state. Buyers can now discover the projected supply window and reservation incentive generated from your planting record.
            </p>
          </section>

          {screenState.status === "loading" && (
            <div className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-surface-variant">
                Confirming published status and preparing your live distribution summary...
              </p>
            </div>
          )}

          {screenState.status === "error" && (
            <div className="rounded-[2rem] border border-error/20 bg-error-container/60 p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-error-container">{screenState.error}</p>
            </div>
          )}

          {listing && (
            <>
              <section className="aurora-ring rounded-[2.5rem] border border-primary/15 bg-[#1b1f1a] p-7 text-white shadow-2xl shadow-primary/10">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg shadow-primary/25">
                        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          campaign
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-fixed/70">
                          Publish Receipt
                        </p>
                        <h2 className="font-headline text-2xl font-black leading-tight">
                          {listing.listing_title}
                        </h2>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                          Live Status
                        </p>
                        {listing.status === "funds_secured" ? (
                          <p className="mt-1 flex items-center gap-2 text-sm font-extrabold text-green-400">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]"></span>
                            Funds Secured (Reserved)
                          </p>
                        ) : (
                          <p className="mt-1 flex items-center gap-2 text-sm font-extrabold text-primary-fixed">
                            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]"></span>
                            Published to Buyer Marketplace
                          </p>
                        )}
                      </div>
                      <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                          Published At
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-white">
                          {listing.published_at ? formatDateTime(listing.published_at) : "Just now"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {listing.status === "funds_secured" && listing.reserved_by ? (
                    <div className="rounded-[1.8rem] border border-green-500/30 bg-green-500/10 px-5 py-4 text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-green-300">
                        Reserved By
                      </p>
                      <p className="mt-1 font-headline text-2xl font-black text-green-400">
                        {listing.reserved_by}
                      </p>
                      <p className="text-sm font-semibold text-white/80 mt-1">
                        RM {listing.reserved_quantity} secured
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-[1.8rem] border border-primary/20 bg-primary/10 px-5 py-4 text-right">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary-fixed/70">
                        Reservation Reach
                      </p>
                      <p className="mt-1 font-headline text-3xl font-black text-primary-fixed">
                        {listing.buyer_interest_count}
                      </p>
                      <p className="text-xs font-semibold text-white/65">
                        seeded buyer signals attached
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        inventory
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/60">
                        Live Listing Snapshot
                      </p>
                      <h3 className="font-headline text-lg font-extrabold text-primary">
                        Buyer-facing essentials
                      </h3>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.4rem] bg-surface-container-low px-4 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-outline">
                        Yield Range
                      </p>
                      <p className="mt-1 text-base font-extrabold text-on-surface">
                        {formatNumber(listing.estimated_yield_min_kg)}kg - {formatNumber(listing.estimated_yield_max_kg)}kg
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] bg-surface-container-low px-4 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-outline">
                        Harvest Window
                      </p>
                      <p className="mt-1 text-base font-extrabold text-on-surface">
                        {listing.harvest_window_label}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] bg-surface-container-low px-4 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-outline">
                        Quality Band
                      </p>
                      <p className="mt-1 text-base font-extrabold text-primary">
                        {listing.quality_band}
                      </p>
                    </div>
                    <div className="rounded-[1.4rem] bg-surface-container-low px-4 py-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-outline">
                        Reservation Hook
                      </p>
                      <p className="mt-1 text-base font-extrabold text-on-surface">
                        {listing.early_incentive_label}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/10 via-surface-container-lowest to-tertiary-fixed/20 p-6 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/60">
                    What Happens Next
                  </p>
                  <div className="mt-4 space-y-4">
                    {[
                      "Buyer marketplace cards can now surface this future supply listing.",
                      "Reservation incentive and confidence band remain attached to the published listing.",
                      "You can return to the live listing page to review status or edit planting details later.",
                    ].map((item) => (
                      <div className="flex items-start gap-3" key={item}>
                        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check
                          </span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-on-surface">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-4 pt-2">
                <button
                  className="w-full rounded-full bg-primary py-5 font-headline text-lg font-extrabold text-on-primary shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.98]"
                  onClick={() => navigate(ROUTES.FARMER_FUTURE_SUPPLY_READINESS)}
                  type="button"
                >
                  View Live Listing
                </button>
                <button
                  className="w-full rounded-full bg-surface-container-highest py-5 font-bold text-on-surface transition-all hover:bg-surface-container-high"
                  onClick={() => navigate(ROUTES.HOME)}
                  type="button"
                >
                  Back to Dashboard
                </button>
              </section>
            </>
          )}
        </main>
      </FarmerShell>
    </PrototypePageFrame>
  )
}

export default FarmerListingPublishedPage
