import { useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { useFarmerFlow } from "@/context/FarmerFlowContext"
import { acceptFarmerProposal, getOrCreateFarmerProposal } from "@/lib/farmerApi"
import { formatConfidence, formatDateTime, formatQuantity } from "@/lib/farmerFlow"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      .glass-card {\n        background: rgba(255, 255, 255, 0.7);\n        backdrop-filter: blur(12px);\n        -webkit-backdrop-filter: blur(12px);\n      }\n      .brokerage-texture {\n        background-image: radial-gradient(circle at 2px 2px, rgba(74, 103, 65, 0.04) 1px, transparent 0);\n        background-size: 24px 24px;\n      }\n      body {\n        font-feature-settings: \"ss01\", \"ss02\", \"cv01\", \"cv11\";\n      }\n    ",
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
  "--font-sans": "Manrope",
  "--font-body": "Manrope",
  "--font-label": "Manrope",
  "--font-headline": "Manrope",
  "--radius": "1rem",
  "--radius-lg": "2rem",
  "--radius-xl": "3rem",
}

function AiTradeProposalPage() {
  const navigate = useNavigate()
  const { flowIds, updateFlowIds } = useFarmerFlow()
  const [screenState, setScreenState] = useState({
    status: "loading",
    data: null,
    error: null,
  })
  const [acceptState, setAcceptState] = useState({
    status: "idle",
    error: null,
  })

  useEffect(() => {
    let isActive = true

    async function loadProposal() {
      setScreenState({
        status: "loading",
        data: null,
        error: null,
      })

      try {
        const data = await getOrCreateFarmerProposal(flowIds.matchId)
        if (!isActive) {
          return
        }

        updateFlowIds({
          proposalId: data.proposal_id,
          tradeId: data.trade_id,
        })
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
          error: error.message || "Unable to generate the trade proposal.",
        })
      }
    }

    loadProposal()

    return () => {
      isActive = false
    }
  }, [flowIds.matchId, updateFlowIds])

  if (!flowIds.matchId) {
    return <Navigate replace to={ROUTES.FARMER_NEARBY_MATCHES} />
  }

  async function handleAcceptProposal() {
    if (!screenState.data?.proposal_id) {
      return
    }

    setAcceptState({
      status: "loading",
      error: null,
    })

    try {
      const trade = await acceptFarmerProposal(screenState.data.proposal_id)
      updateFlowIds({
        proposalId: screenState.data.proposal_id,
        tradeId: trade.trade_id,
      })
      navigate(ROUTES.FARMER_TRADE_CONFIRMATION)
    } catch (error) {
      setAcceptState({
        status: "error",
        error: error.message || "Unable to accept this trade proposal.",
      })
    }
  }

  const proposal = screenState.data

  return (
    <PrototypePageFrame
      title="TaniTrade AI"
      htmlClass="light"
      bodyClass="bg-background text-on-surface font-body min-h-screen pb-32 brokerage-texture"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="w-full top-0 sticky z-50 bg-[#FAF9F6]/80 backdrop-blur-md flex justify-between items-center px-6 py-4 max-w-md mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border-2 border-primary/10 shadow-sm">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcpWFzodPDUP1iaHfSeQNfhUbCfZulBRD0DWqDiH_o0F0G9FKT0K7YEY8XtnwT8mayLrYvvRogRc0T3gZ4aOvsGtXRT_s1x9BxnS73f5Ni1ArgmmG5QzzmNiZSI5L2DYiTXSvy8BWDfZTeMva0AKxMyJdt5cjl2yTTPbRWhsTnW8_6L23bN2_kQEnr5_S_2ViiAvpl8G4sJzivXZaDN_YzHdOczqILwQODQqmcG-w37l10d3nQuCj-nUuFi3dLgNoVKKonFrdjYwU" />
            </div>
            <span className="font-headline font-extrabold text-[#334F2B] tracking-tight text-lg">TaniTrade <span className="text-tertiary">AI</span></span>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors text-primary active:scale-90" onClick={() => navigate(ROUTES.FARMER_NEARBY_MATCHES)} type="button">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </header>

        <main className="px-6 max-w-md mx-auto pt-4 space-y-6">
          <section className="flex justify-between items-end">
            <div className="space-y-0.5">
              <span className="font-label text-primary/60 font-bold uppercase tracking-widest text-[10px]">
                {proposal ? `Document No. ${proposal.document_number}` : "Document No. Generating..."}
              </span>
              <h1 className="font-headline font-black text-3xl text-on-surface tracking-tight">Trade Proposal</h1>
            </div>
            <div className="text-right pb-1">
              <span className="block text-[10px] font-bold text-outline/60 uppercase tracking-tighter">Generated</span>
              <span className="block text-xs font-bold text-on-surface/80">
                {proposal ? formatDateTime(proposal.generated_at) : "Preparing"}
              </span>
            </div>
          </section>

          {screenState.status === "loading" && (
            <div className="rounded-[2rem] border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-surface-variant">Pricing barter value, meeting point, and handover schedule...</p>
            </div>
          )}

          {screenState.status === "error" && (
            <div className="rounded-[2rem] border border-error/20 bg-error-container/60 p-6 shadow-sm">
              <p className="text-sm font-semibold text-on-error-container">{screenState.error}</p>
            </div>
          )}

          {proposal && (
            <>
              <div className="relative">
                <section className="bg-surface-container-lowest rounded-[2.5rem] shadow-xl shadow-primary/5 overflow-hidden border border-outline-variant/30">
                  <div className="p-8 bg-primary text-on-primary relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                          <pattern height="30" id="grid" patternUnits="userSpaceOnUse" width="30">
                            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"></path>
                          </pattern>
                        </defs>
                        <rect fill="url(#grid)" height="100%" width="100%"></rect>
                      </svg>
                    </div>

                    <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-center text-center space-y-3 flex-1">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                            <span className="material-symbols-outlined text-3xl">deployed_code</span>
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-label text-[10px] uppercase font-bold tracking-[0.15em] opacity-70">Supply Item</p>
                            <p className="font-headline font-extrabold text-lg leading-tight">
                              {formatQuantity(proposal.offer_quantity, proposal.offer_unit)}
                              <br />
                              {proposal.offer_item_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center justify-center px-1">
                          <div className="bg-tertiary text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg shadow-tertiary/30 ring-4 ring-primary">
                            <span className="material-symbols-outlined font-bold text-2xl">sync_alt</span>
                          </div>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-3 flex-1">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                            <span className="material-symbols-outlined text-3xl">science</span>
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-label text-[10px] uppercase font-bold tracking-[0.15em] opacity-70">Acquisition</p>
                            <p className="font-headline font-extrabold text-lg leading-tight">
                              {formatQuantity(proposal.requested_quantity, proposal.requested_unit)}
                              <br />
                              {proposal.requested_item_name}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/15 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#cba72f]"></span>
                        <p className="font-label text-[11px] font-bold tracking-wide">Ratio: {proposal.ratio_text}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex gap-4 items-center p-4 bg-surface-container-low/50 rounded-3xl border border-outline-variant/20">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-headline font-bold text-on-surface text-sm">Valuation Integrity</h3>
                        <p className="text-[13px] text-on-surface-variant leading-snug">Aligned with <span className="font-bold text-primary">{formatConfidence(proposal.valuation_confidence)}% confidence</span> against the seeded market reference set.</p>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-[2rem] p-5 border border-primary/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-tertiary text-lg">auto_awesome</span>
                          <span className="font-label text-[10px] font-black uppercase tracking-widest text-primary/80">Negotiation Logic</span>
                        </div>
                        <div className="px-2 py-0.5 rounded-full bg-primary/10">
                          <span className="font-label text-[9px] text-primary uppercase font-bold">Confidence: {formatConfidence(proposal.valuation_confidence)}%</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium italic text-on-surface/90 leading-relaxed px-1">
                        "{proposal.explanation}"
                      </p>
                    </div>

                    <div className="bg-surface-container-low rounded-3xl p-4 flex items-center gap-4 border border-outline-variant/30">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border border-outline-variant/50">
                        <img alt="Meeting Location" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbfU0ilybtE_TsNQDtT818Dj0T11F-ZFUm5CBQgqgGhlrp9wAlPgpd51-bddGyTZrROG_otFCspx9xwgfEAfYnU79LZorXIEzlGTOgLk5Fi00cVnbsJk48f1MJakwXSWDoKrWfgTGxMy0wuugmC_WhNLULJIMyxOjhBZO_gkjhkHw3Pi-S_ZFHRAIGo9Jyp5_MJuhZ56YVCYdMmtjaqeXX7H1u54if-HnhJ7A-YfR8TT_HEDxj1AgzSCNXJ0Unrh5rnOlr6oZCm8Y" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[10px] font-bold text-on-surface-variant/70 uppercase tracking-widest">Handover Point</h4>
                        <p className="text-sm font-bold text-on-surface">{proposal.meeting_point_name}</p>
                        <p className="text-[11px] text-on-surface-variant">{proposal.meeting_label}</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-primary shadow-sm border border-outline-variant/20">
                        <span className="material-symbols-outlined text-lg">map</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {(acceptState.error || acceptState.status === "loading") && (
                <div className="rounded-[1.5rem] border border-primary/10 bg-surface-container-low px-5 py-4 text-sm font-semibold text-on-surface-variant">
                  {acceptState.error || "Locking in the barter agreement and creating the trade record..."}
                </div>
              )}

              <section className="flex flex-col gap-3 pb-2 pt-2">
                <button className="w-full bg-primary text-on-primary py-5 rounded-full font-headline font-black text-lg shadow-xl shadow-primary/25 active:scale-[0.97] transition-all flex items-center justify-center gap-3 disabled:opacity-70" disabled={acceptState.status === "loading"} onClick={handleAcceptProposal} type="button">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  {acceptState.status === "loading" ? "Accepting Proposal..." : "Accept Trade Proposal"}
                </button>
                <button className="w-full bg-surface-container-high/60 text-on-surface-variant py-4 rounded-full font-label font-bold uppercase tracking-widest text-xs active:scale-[0.98] transition-all border border-outline-variant/40" onClick={() => navigate(ROUTES.FARMER_NEARBY_MATCHES)} type="button">
                  Request Optimization
                </button>
              </section>
            </>
          )}

          <div className="flex flex-col items-center gap-2.5 px-6 pb-8">
            <div className="flex items-center gap-2 text-primary/40">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <p className="text-[10px] font-black uppercase tracking-widest">Verified Secure Barter Protocol</p>
            </div>
            <p className="text-center text-[10px] font-medium text-on-surface-variant/60 leading-normal max-w-[280px]">
              This is a formal AI-brokered offer. Final reputation score updates upon physical verification at the selected location.
            </p>
          </div>
        </main>

        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-white/90 backdrop-blur-2xl rounded-t-[2.5rem] border-t border-outline-variant/20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          <Link className="flex flex-col items-center justify-center text-outline/60 px-5 py-2 rounded-full transition-all" to={ROUTES.BUYER_MARKETPLACE}>
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[9px] font-black uppercase tracking-wider mt-1">Market</span>
          </Link>
          <Link className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-3xl px-8 py-3 transition-all shadow-lg shadow-primary/20 -translate-y-1" to={ROUTES.FARMER_AI_TRADE_PROPOSAL}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            <span className="text-[9px] font-black uppercase tracking-wider mt-1">Active</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-outline/60 px-5 py-2 rounded-full transition-all" to={ROUTES.PROTOTYPE}>
            <span className="material-symbols-outlined">account_balance_wallet</span>
            <span className="text-[9px] font-black uppercase tracking-wider mt-1">Ledger</span>
          </Link>
        </nav>
      </>
    </PrototypePageFrame>
  )
}

export default AiTradeProposalPage
