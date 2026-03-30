import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { useFarmerFlow } from "@/context/FarmerFlowContext"
import { createFarmerIntake } from "@/lib/farmerApi"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      .glass-card {\n        background: rgba(255, 255, 255, 0.4);\n        backdrop-filter: blur(20px);\n        -webkit-backdrop-filter: blur(20px);\n      }\n      .glow-edge {\n        box-shadow: 0 0 20px rgba(74, 103, 65, 0.1);\n      }\n      .voice-active {\n        animation: ripple 2s cubic-bezier(0, 0, 0.2, 1) infinite;\n      }\n      body {\n        min-height: max(884px, 100dvh);\n      }\n    ",
  "\n        .no-scrollbar::-webkit-scrollbar {\n            display: none;\n        }\n        .no-scrollbar {\n            -ms-overflow-style: none;\n            scrollbar-width: none;\n        }\n    ",
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
  "--color-primary": "#334f2b",
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
  "--radius-xl": "3rem",
}

function FarmerVoiceInputPage() {
  const navigate = useNavigate()
  const { bootstrap, bootstrapError, resetFlowIds, updateFlowIds } = useFarmerFlow()
  const [draftMessage, setDraftMessage] = useState("")
  const [submitState, setSubmitState] = useState({
    status: "idle",
    error: null,
  })

  const promptSuggestions = bootstrap?.quick_prompts?.length
    ? bootstrap.quick_prompts
    : [
        "I need pesticide",
        "What can I trade for seeds?",
        "Planting paddy next week",
      ]

  async function handleSubmit() {
    if (!draftMessage.trim()) {
      setSubmitState({
        status: "error",
        error: "Enter your barter request before continuing.",
      })
      return
    }

    setSubmitState({
      status: "loading",
      error: null,
    })

    try {
      const response = await createFarmerIntake(draftMessage)
      resetFlowIds()
      updateFlowIds({
        requestId: response.request_id,
      })
      navigate(ROUTES.FARMER_PARSED_SUMMARY)
    } catch (error) {
      setSubmitState({
        status: "error",
        error: error.message || "Unable to analyze this request right now.",
      })
    }
  }

  return (
    <PrototypePageFrame
      title="TaniTrade AI - Voice Input"
      htmlClass="light"
      bodyClass="bg-background text-on-surface font-body min-h-screen pb-32"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="w-full top-0 sticky z-50 bg-[#FAF9F6]/90 backdrop-blur-md">
          <div className="flex justify-between items-center w-full px-6 py-4 max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden ring-2 ring-primary-container/20">
                <img alt="User profile photo" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAexMsbu0p7B5HPpUf1nCNqj3V2ZiF9jibKmZrVn4W_u2tCyP0f7R-XRkLw8YI3QKBvE7o3iP1xhZqFu6O2TE0fpTHDnB5FlvCdKYgH4qGsjSZwcWw6BCVom19Cd525ugZL5JmEyoFux7-shzgyLHqRaNMOnNbc1WkgEpd9traIns3dDhc-O5u_cyy20wsWK5pKBYhb84OlR_wo5kIRUxTjUhoDZ6YE7PHlQwECevq_K7-mcU4M9m1kXMHXtNRXVKhnVr-Pf-Qc9-c" />
              </div>
              <h1 className="font-headline font-black text-[#334F2B] tracking-tighter text-lg">TaniTrade AI</h1>
            </div>
            <button className="text-[#334F2B] hover:opacity-80 transition-opacity p-2 bg-surface-container-low rounded-full" onClick={() => navigate(ROUTES.HOME)} type="button">
              <span className="material-symbols-outlined text-xl">location_on</span>
            </button>
          </div>
        </header>

        <main className="max-w-md mx-auto px-6 pt-6">
          <section className="mb-8 text-center">
            <h2 className="font-headline font-extrabold text-[32px] leading-tight text-primary tracking-tight mb-3">What's on your mind?</h2>
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <p className="text-sm font-semibold text-primary font-label uppercase tracking-widest">Listening</p>
            </div>
          </section>

          <div className="relative mb-10">
            <div className="glass-card glow-edge rounded-full aspect-square flex flex-col items-center justify-center border border-white/60 relative overflow-hidden mx-auto max-w-[340px]">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-container/5 blur-[40px] rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="absolute -inset-8 bg-primary-container/15 rounded-full blur-2xl animate-pulse"></div>
                <button className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white shadow-xl relative voice-active active:scale-95 transition-transform duration-150" type="button">
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'wght' 500, 'FILL' 1" }}>mic</span>
                </button>
              </div>

              <div className="mt-8 text-center relative z-10 px-8">
                <p className="text-on-surface font-semibold text-lg leading-snug">Speak now to find local trades...</p>
              </div>
            </div>
          </div>

          <div className="mb-8 bg-white/60 backdrop-blur-md rounded-full px-6 py-4 flex gap-3 items-center border border-primary/10 shadow-sm">
            <div className="bg-tertiary-container/20 p-2 rounded-full flex-shrink-0">
              <span className="material-symbols-outlined text-tertiary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
            </div>
            <p className="text-sm font-medium text-on-surface leading-tight">
              Try: <span className="text-primary italic">"{promptSuggestions[0]}"</span>
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <input className="w-full h-14 pl-6 pr-14 rounded-full bg-surface-container-highest/50 border-none focus:ring-2 focus:ring-primary/20 transition-all font-body text-on-surface placeholder:text-on-surface-variant/60" onChange={(event) => setDraftMessage(event.target.value)} placeholder="Type message..." type="text" value={draftMessage} />
              <button className="absolute right-2 top-2 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm disabled:opacity-70" disabled={submitState.status === "loading"} onClick={handleSubmit} type="button">
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>
            </div>
          </div>

          {(submitState.error || bootstrapError) && (
            <div className="mb-6 rounded-[1.5rem] border border-error/20 bg-error-container/60 px-5 py-4 text-sm font-medium text-on-error-container">
              {submitState.error || bootstrapError}
            </div>
          )}

          <section className="mb-10 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max pb-2">
              {promptSuggestions.slice(0, 3).map((prompt) => (
                <button className="px-5 py-2.5 rounded-full bg-surface-container-lowest border border-primary/10 hover:border-primary/30 transition-all text-sm font-semibold text-primary shadow-sm" key={prompt} onClick={() => setDraftMessage(prompt)} type="button">
                  "{prompt}"
                </button>
              ))}
            </div>
          </section>

          <button className="w-full bg-primary text-white py-5 rounded-full font-headline font-extrabold text-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-70" disabled={submitState.status === "loading"} onClick={handleSubmit} type="button">
            <span>{submitState.status === "loading" ? "Analyzing Request..." : "Analyze & Find Match"}</span>
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>temp_preferences_custom</span>
          </button>
        </main>

        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-[#FAF9F6]/90 backdrop-blur-xl shadow-[0_-8px_30px_rgba(0,0,0,0.05)] rounded-t-[2.5rem] border-t border-primary/5">
          <Link className="flex flex-col items-center justify-center text-primary/40 px-5 py-2 hover:text-primary transition-all duration-300" to={ROUTES.HOME}>
            <span className="material-symbols-outlined">home</span>
            <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-wider mt-1">Home</span>
          </Link>
          <Link className="flex flex-col items-center justify-center bg-primary text-white rounded-full px-6 py-2.5 shadow-lg shadow-primary/20 transition-all duration-300" to={ROUTES.FARMER_VOICE_INPUT}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
            <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-wider mt-1">AI Trades</span>
          </Link>
          <Link className="flex flex-col items-center justify-center text-primary/40 px-5 py-2 hover:text-primary transition-all duration-300" to={ROUTES.PROTOTYPE}>
            <span className="material-symbols-outlined">person</span>
            <span className="font-['Inter'] text-[10px] font-bold uppercase tracking-wider mt-1">Profile</span>
          </Link>
        </nav>
      </>
    </PrototypePageFrame>
  )
}

export default FarmerVoiceInputPage
