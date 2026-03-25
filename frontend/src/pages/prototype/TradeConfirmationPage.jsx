import { useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      .ai-gradient-bg {\n        background: linear-gradient(135deg, rgba(51, 79, 43, 0.05) 0%, rgba(115, 92, 0, 0.05) 100%);\n      }\n      @keyframes float {\n        0%, 100% { transform: translateY(0); }\n        50% { transform: translateY(-4px); }\n      }\n      .animate-float {\n        animation: float 3s ease-in-out infinite;\n      }\n      .step-line::after {\n        content: '';\n        position: absolute;\n        left: 19px;\n        top: 40px;\n        bottom: -24px;\n        width: 2px;\n        background-color: #e3e2e0;\n      }\n      .step-line-last::after {\n        display: none;\n      }\n    "
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
  "--radius-xl": "3rem"
}

function TradeConfirmationPage() {
  const navigate = useNavigate()

  return (
    <PrototypePageFrame
      title="TaniTrade AI"
      htmlClass="light"
      bodyClass="bg-background text-on-surface font-body selection:bg-primary-fixed"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <main className="min-h-screen max-w-md mx-auto flex flex-col px-6 pt-10 pb-8">

        <div className="flex flex-col items-center text-center space-y-6 mb-8">
        <div className="relative w-full aspect-[4/3] max-w-[320px]">
        <div className="absolute inset-0 bg-primary/10 blur-[60px] opacity-40 rounded-full animate-pulse-soft"></div>
        <div className="relative z-10 w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white">
        <img alt="Sustainable agriculture handshake" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzhSnFNsVmDvhN2g79gOR7FNLdJkXC5JQ6KNpJkcAkdudGdzfjP_iXect3QIxuqz7Xk56w1eKJukgKr-YDU-C9WWUNtmlatux7Aeb1fqrlPWwAwQGAEzox1tgSmgDhazP9VIN40L85cqAJbySRqlD8HXigTdNjCyOuIf0qrx_sl81svqtEkofEpr1z1UWZr1h4NN4l756h3MEh4Fwhijs6xip-d2syouMXx3v6b1wkD9jG6Ggody-PfGbYPaVPrNQ8bqEDPYjrKFY" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-tertiary-fixed text-on-tertiary-fixed px-4 py-2 rounded-full flex items-center gap-2 shadow-xl backdrop-blur-md">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        <span className="font-label text-[11px] font-extrabold uppercase tracking-widest">Trade Secured</span>
        </div>
        </div>
        </div>
        <div className="space-y-2">
        <h1 className="font-headline font-extrabold text-4xl tracking-tight text-primary">Success!</h1>
        <p className="text-on-surface-variant text-sm px-6 leading-relaxed">Your barter with Pak Abu is complete. Your farm is ready for the next phase.</p>
        </div>
        </div>

        <div className="mb-8 ai-gradient-bg border border-primary/10 rounded-3xl p-6 relative overflow-hidden group">
        <div className="absolute -top-6 -right-6 p-4 opacity-5 animate-float">
        <span className="material-symbols-outlined text-8xl">auto_awesome</span>
        </div>
        <div className="relative z-10 flex items-start gap-4">
        <div className="mt-1 flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="material-symbols-outlined text-white text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        </div>
        <div className="space-y-2">
        <h4 className="text-sm font-extrabold text-primary tracking-tight">Opportunity Unlocked</h4>
        <p className="text-sm text-on-surface leading-snug">
                            These new inputs are projected to increase your <span className="text-primary font-bold">yield by 15%</span>. We've started drafting your harvest listing.
                        </p>
        <div className="flex items-center gap-3 pt-1">
        <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-bounce [animation-delay:0.4s]"></div>
        </div>
        <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Market Draft Syncing...</span>
        </div>
        </div>
        </div>
        </div>

        <section className="bg-surface-container-low/40 border border-outline-variant/30 rounded-3xl p-6 space-y-6 mb-8">
        <div className="flex items-center justify-between">
        <span className="font-label text-[10px] font-black uppercase tracking-[0.2em] text-outline">Transaction Log</span>
        <span className="text-on-surface-variant font-mono text-[11px] font-bold bg-surface-variant/50 px-2 py-0.5 rounded">ID: TRD-90210</span>
        </div>
        <div className="space-y-5">
        <div className="bg-surface-container-lowest p-4 rounded-full flex items-center gap-4 border border-outline-variant/10 shadow-sm">
        <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
        <img alt="Pak Abu" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVCXi5nr8E1gsNHj_iRFD6mPhuoCkJsIvErzwrsGpxEgF6rAYABkbNMC8N5-Ijn6BUlBnlfFUaWXLKPbRH1Xe9h0wEMF3BhXeV4nqIGEbZTMul88v0zbvH1dMVf0xzsRj2relTAk4oPFEYyKvRp-3mkmFb2j9Ww2k4O4zJ3_nq9b6az87Q5nO-PY7bQQ2Yy_0RZoNW5y02K4biZcmOGt5TlUyw0VeExp0CcvEDVv0fu-9-_cSOV72A84nvgdeEgA4rMlYKj3RIQF8" />
        </div>
        <div>
        <p className="font-label text-[9px] text-outline uppercase font-black tracking-widest">Trading Partner</p>
        <p className="font-headline font-bold text-on-surface text-lg">Pak Abu</p>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-4 px-2">
        <div className="space-y-1">
        <p className="font-label text-[9px] text-outline uppercase font-black tracking-widest">Exchange</p>
        <div className="flex flex-col">
        <span className="text-xs font-medium text-on-surface-variant line-through opacity-50">Gave Fertilizer</span>
        <span className="text-sm font-bold text-primary">Got Pesticide</span>
        </div>
        </div>
        <div className="space-y-1 border-l border-outline-variant/30 pl-4">
        <p className="font-label text-[9px] text-outline uppercase font-black tracking-widest">Pickup</p>
        <div className="flex flex-col">
        <span className="text-xs font-medium text-on-surface-variant">Tomorrow, 9 AM</span>
        <span className="text-sm font-bold text-on-surface">Main Hall</span>
        </div>
        </div>
        </div>
        </div>
        </section>

        <section className="mb-12 px-2">
        <h3 className="font-headline font-extrabold text-xl mb-8 text-on-surface">Your Farm Journey</h3>
        <div className="space-y-12">

        <div className="flex items-start gap-6 relative step-line">
        <div className="z-10 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center ring-4 ring-background">
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <div className="pt-1.5">
        <p className="font-headline font-bold text-sm text-on-surface/50">Resource Exchange</p>
        <p className="text-xs text-on-surface-variant/50">Inputs secured successfully</p>
        </div>
        </div>

        <div className="flex items-start gap-6 relative step-line">
        <div className="z-10 w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center ring-[6px] ring-primary/10 shadow-xl shadow-primary/20">
        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>potted_plant</span>
        </div>
        <div className="pt-1.5 flex-1">
        <div className="flex items-center justify-between mb-0.5">
        <p className="font-headline font-extrabold text-sm text-on-surface">Planting &amp; Input Logging</p>
        <span className="bg-primary text-on-primary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">Active</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed">Start logging usage for yield validation</p>
        </div>
        </div>

        <div className="flex items-start gap-6 relative step-line-last">
        <div className="z-10 w-10 h-10 rounded-full bg-surface-container-highest text-outline/40 flex items-center justify-center ring-4 ring-background">
        <span className="material-symbols-outlined text-[22px]">lock</span>
        </div>
        <div className="pt-1.5">
        <p className="font-headline font-bold text-sm text-on-surface-variant">Harvest Listing</p>
        <p className="text-xs text-on-surface-variant/60">Coming after planting cycle</p>
        </div>
        </div>
        </div>
        </section>

        <div className="mt-auto pt-6 space-y-4">
        <button className="w-full bg-primary text-on-primary font-headline font-extrabold py-5 rounded-full shadow-2xl shadow-primary/30 active:scale-[0.97] transition-all flex items-center justify-center gap-3" onClick={() => navigate(ROUTES.FARMER_RECORD_PLANTING)} type="button">
        <span>Begin Planting Log</span>
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </button>
        <button className="w-full bg-transparent text-primary/60 font-headline font-bold py-3 rounded-full active:bg-surface-container-low transition-all text-sm tracking-wide" onClick={() => navigate(ROUTES.HOME)} type="button">
                    Back to Dashboard
                </button>
        </div>
        </main>
      </>
    </PrototypePageFrame>
  )
}

export default TradeConfirmationPage
