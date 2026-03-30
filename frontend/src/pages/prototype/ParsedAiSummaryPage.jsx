import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { useFarmerFlow } from "@/context/FarmerFlowContext"
import { getFarmerIntake, getOrCreateFarmerMatches } from "@/lib/farmerApi"
import { formatConfidence, formatNumber, formatQuantity } from "@/lib/farmerFlow"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      body {\n        min-height: 100dvh;\n      }\n      .ai-gradient-bg {\n        background: linear-gradient(135deg, #fdfcf1 0%, #f7f9f2 100%);\n      }\n    ",
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
  "--radius-lg": "1.5rem",
  "--radius-xl": "2rem",
}

function ParsedAiSummaryPage() {
  const navigate = useNavigate()
  const { flowIds, updateFlowIds } = useFarmerFlow()
  const [screenState, setScreenState] = useState({
    status: "loading",
    data: null,
    error: null,
  })
  const [submitState, setSubmitState] = useState({
    status: "idle",
    error: null,
  })

  useEffect(() => {
    let isActive = true

    async function loadSummary() {
      setScreenState({
        status: "loading",
        data: null,
        error: null,
      })

      try {
        const data = await getFarmerIntake(flowIds.requestId)
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
          error: error.message || "Unable to load the parsed summary.",
        })
      }
    }

    loadSummary()

    return () => {
      isActive = false
    }
  }, [flowIds.requestId])

  if (!flowIds.requestId) {
    return <Navigate replace to={ROUTES.FARMER_VOICE_INPUT} />
  }

  async function handleFindMatches() {
    setSubmitState({
      status: "loading",
      error: null,
    })

    try {
      await getOrCreateFarmerMatches(flowIds.requestId)
      updateFlowIds({
        matchId: null,
        proposalId: null,
        tradeId: null,
        plantingRecordId: null,
        harvestListingId: null,
      })
      navigate(ROUTES.FARMER_NEARBY_MATCHES)
    } catch (error) {
      setSubmitState({
        status: "error",
        error: error.message || "Unable to generate barter matches.",
      })
    }
  }

  const summary = screenState.data

  return (
    <PrototypePageFrame
      title="TaniTrade AI"
      htmlClass=""
      bodyClass="bg-background text-on-surface font-body min-h-screen flex flex-col"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="w-full top-0 sticky z-50 bg-background/80 backdrop-blur-md">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-outline/10">
                <img alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzMEbgJtaFYTcrnXABGNvREXJKrvP-mkqB3ecWe-gcOyxqawBXYE7pt3srZAeQTMub4EGvTw0ycrZegbEqJyrq0phEbAvc5ckIEe1SOMpHJ8XbWOWSXEyKxRVkYtNxndEJM8kNQGaTF3c2L0kUExQ0GFvve2NfRgMV4Oh0VI3kgnohrcfjSmWqG0-vCbI_zBCvjmuDwGbwSVssg3dDG09_-KsyhbcVHhSl8T34FxKwOlzhqgn5sCjaQOeNa_QuCfJ5ghU1i2Aq23g" />
              </div>
              <h1 className="font-headline font-extrabold text-primary tracking-tight text-lg">TaniTrade AI</h1>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors" onClick={() => navigate(ROUTES.FARMER_VOICE_INPUT)} type="button">
              <span className="material-symbols-outlined text-primary">location_on</span>
            </button>
          </div>
        </header>

        <main className="flex-grow w-full max-w-md mx-auto px-6 pt-2 pb-32">
          <section className="mb-8">
            <div className="inline-flex items-center gap-2 bg-[#E7EFDE] px-3 py-1 rounded-full mb-4 border border-primary/10">
              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              <span className="font-label text-[11px] font-bold uppercase tracking-wider text-primary">
                {screenState.status === "success" ? `High confidence (${formatConfidence(summary.parsed_confidence)}%)` : "Parsing request"}
              </span>
            </div>
            <h2 className="font-headline text-[32px] font-extrabold text-primary tracking-tight leading-[1.1] mb-3">Here's what I understood</h2>
            <p className="text-on-surface-variant font-body text-[15px] leading-relaxed">
              Review your trade details. I've parsed your request into a structured offer ready for the marketplace.
            </p>
          </section>

          {screenState.status === "loading" && (
            <div className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-surface-variant">Loading your parsed barter summary...</p>
            </div>
          )}

          {screenState.status === "error" && (
            <div className="rounded-[2rem] border border-error/20 bg-error-container/60 p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-error-container">{screenState.error}</p>
            </div>
          )}

          {summary && (
            <>
              <div className="space-y-4">
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-full flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[28px]">potted_plant</span>
                    </div>
                    <div>
                      <span className="font-label text-[10px] uppercase font-bold text-outline tracking-wider block">Crop Type</span>
                      <span className="font-headline text-[17px] font-bold text-on-surface">{summary.crop_label}</span>
                    </div>
                  </div>
                  <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 text-outline" onClick={() => navigate(ROUTES.FARMER_VOICE_INPUT)} type="button">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                        <span className="material-symbols-outlined">inventory_2</span>
                      </div>
                      <button className="text-outline/40 hover:text-primary transition-colors" onClick={() => navigate(ROUTES.FARMER_VOICE_INPUT)} type="button">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                    <div>
                      <span className="font-label text-[10px] uppercase font-bold text-outline tracking-wider block mb-1">I Have Surplus</span>
                      <span className="font-headline text-base font-bold text-on-surface leading-snug">
                        {formatQuantity(summary.have_item.quantity, summary.have_item.unit)} {summary.have_item.display_name}
                      </span>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-xl shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
                        <span className="material-symbols-outlined">shopping_bag</span>
                      </div>
                      <button className="text-outline/40 hover:text-primary transition-colors" onClick={() => navigate(ROUTES.FARMER_VOICE_INPUT)} type="button">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </div>
                    <div>
                      <span className="font-label text-[10px] uppercase font-bold text-outline tracking-wider block mb-1">I am Looking For</span>
                      <span className="font-headline text-base font-bold text-on-surface leading-snug">
                        {formatQuantity(summary.need_item.quantity, summary.need_item.unit)} {summary.need_item.display_name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container-low/50 p-4 rounded-full flex items-center gap-3 border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                    </div>
                    <div>
                      <span className="font-label text-[10px] uppercase font-bold text-outline tracking-wider block">Timeline</span>
                      <span className="font-headline text-sm font-bold text-on-surface">{summary.timeline_label}</span>
                    </div>
                  </div>

                  <div className="bg-surface-container-low/50 p-4 rounded-full flex items-center gap-3 border border-outline-variant/10">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">distance</span>
                    </div>
                    <div>
                      <span className="font-label text-[10px] uppercase font-bold text-outline tracking-wider block">Radius</span>
                      <span className="font-headline text-sm font-bold text-on-surface">{formatNumber(summary.radius_km)}km</span>
                    </div>
                  </div>
                </div>

                <div className="ai-gradient-bg border border-primary/10 p-5 rounded-xl relative overflow-hidden mt-2">
                  <div className="flex gap-4 relative z-10">
                    <div className="shrink-0">
                      <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[14px] font-body text-on-surface-variant leading-relaxed">
                        <span className="font-bold text-tertiary">Market Opportunity:</span> We found <span className="text-primary font-bold">{summary.market_opportunity_count} local traders</span> within {formatNumber(summary.radius_km)}km who can support your current request.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {(submitState.error || submitState.status === "loading") && (
                <div className="mt-6 rounded-[1.5rem] border border-primary/10 bg-surface-container-low px-5 py-4 text-sm font-semibold text-on-surface-variant">
                  {submitState.error || "Generating your ranked barter matches..."}
                </div>
              )}

              <div className="mt-8 space-y-4">
                <button className="w-full bg-primary text-on-primary py-5 rounded-full font-headline font-extrabold text-[18px] hover:opacity-95 transition-all active:scale-[0.98] shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-70" disabled={submitState.status === "loading"} onClick={handleFindMatches} type="button">
                  <span>{submitState.status === "loading" ? "Finding Matches..." : "Find Best Matches"}</span>
                  <span className="material-symbols-outlined font-bold">arrow_forward</span>
                </button>
                <button className="w-full bg-transparent text-outline font-headline font-bold text-[14px] py-2 rounded-full hover:text-primary transition-colors uppercase tracking-widest" onClick={() => navigate(ROUTES.FARMER_VOICE_INPUT)} type="button">
                  Modify Details
                </button>
              </div>
            </>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-white/80 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-outline-variant/20 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
          <Link className="flex flex-col items-center justify-center text-outline px-5 py-2 hover:text-primary transition-all duration-300" to={ROUTES.BUYER_MARKETPLACE}>
            <span className="material-symbols-outlined">grid_view</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Market</span>
          </Link>
          <Link className="flex flex-col items-center justify-center bg-primary text-white rounded-full px-6 py-2.5 shadow-lg shadow-primary/30 transition-all duration-300" to={ROUTES.FARMER_PARSED_SUMMARY}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">My Trades</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-outline px-5 py-2 hover:text-primary transition-all duration-300" to={ROUTES.PROTOTYPE}>
            <span className="material-symbols-outlined">account_circle</span>
            <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Profile</span>
          </Link>
        </nav>
      </>
    </PrototypePageFrame>
  )
}

export default ParsedAiSummaryPage
