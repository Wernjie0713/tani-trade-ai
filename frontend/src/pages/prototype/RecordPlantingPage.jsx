import { Link, useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      body {\n        -webkit-tap-highlight-color: transparent;\n      }\n      .glass-card {\n        background: rgba(255, 255, 255, 0.7);\n        backdrop-filter: blur(20px);\n        -webkit-backdrop-filter: blur(20px);\n      }\n      .shimmer-bg {\n        background: linear-gradient(90deg, rgba(74, 103, 65, 0.05) 25%, rgba(74, 103, 65, 0.1) 50%, rgba(74, 103, 65, 0.05) 75%);\n        background-size: 200% 100%;\n        animation: shimmer 3s infinite linear;\n      }\n      @keyframes shimmer {\n        0% { background-position: 200% 0; }\n        100% { background-position: -200% 0; }\n      }\n      .premium-input-ring {\n        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n      }\n      .premium-input-ring:focus-within {\n        box-shadow: 0 0 0 2px #4A6741;\n      }\n    "
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
  "--radius-xl": "3rem"
}

function RecordPlantingPage() {
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    navigate(ROUTES.BUYER_FUTURE_SUPPLY_READINESS)
  }

  return (
    <PrototypePageFrame
      title="Planting Record - TaniTrade AI"
      htmlClass="light"
      bodyClass="bg-background text-on-surface font-body selection:bg-primary-fixed-dim selection:text-on-primary-fixed"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="w-full top-0 sticky z-50 bg-[#FAF9F6]/90 backdrop-blur-md dark:bg-[#1A1C1A]/90">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 ring-4 ring-primary/5">
        <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3x7a70rIl8arIeKucI72NnfFHuP_ke3EGeAoS1hVc1hdPX0nkroTCWJVjjPmI3bVc2UorskvN0LWqo6HHyJg1-IpWGr11ThlQC7jS6Z3F2BVm2RphBhtgCfLpoce7o5ywDkoxyJ2ZxWRfJbaLTxTl8Yu8vZPdeOZYX1rtLsCdCWuFMxWwurbVTBqvTNzi0JG5O-Z7Fz-f3eXd5BnYALGCsIEmbaxGvYPqHcqxF9cLBgcCcd03ZweBS0uuHSxnYEqwbDzoFbo2pOY" />
        </div>
        <h1 className="font-headline font-extrabold text-primary dark:text-[#FAF9F6] tracking-tight text-lg">TaniTrade AI</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low text-primary hover:bg-surface-container transition-colors" onClick={() => navigate(ROUTES.FARMER_TRADE_CONFIRMATION)} type="button">
        <span className="material-symbols-outlined" data-icon="location_on">location_on</span>
        </button>
        </div>
        </header>
        <main className="max-w-md mx-auto px-6 pt-4 pb-32">

        <section className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full mb-6 border border-primary/10">
        <span className="material-symbols-outlined text-[16px] text-primary fill-1" data-icon="hub">hub</span>
        <span className="font-label text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Harvest Intelligence v2.0</span>
        </div>
        <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-primary leading-[0.95] mb-4">
                    Planting <br />Success.
                </h2>
        <p className="text-[14px] text-on-surface-variant leading-relaxed max-w-[90%] font-medium">
                    Every data point you enter fuels our prediction engine, ensuring you connect with premium buyers weeks before the harvest.
                </p>
        </section>

        <form className="space-y-6" onSubmit={handleSubmit}>

        <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
        <label className="font-label text-[13px] font-bold text-primary uppercase tracking-wider" htmlFor="crop_type">Crop Variety</label>
        <span className="text-[11px] font-semibold text-primary/60 italic">Critical for yield modeling</span>
        </div>
        <div className="relative premium-input-ring rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30">
        <input className="w-full bg-transparent border-none rounded-full px-6 py-5 focus:ring-0 text-on-surface font-semibold placeholder:text-outline/50 text-base" id="crop_type" placeholder="e.g., Premium Paddy MR269" type="text" />
        </div>
        </div>

        <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
        <label className="font-label text-[13px] font-bold text-primary uppercase tracking-wider" htmlFor="planting_date">Date Sown</label>
        <span className="text-[11px] font-semibold text-primary/60 italic">Sets harvest window</span>
        </div>
        <div className="relative premium-input-ring rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30">
        <input className="w-full bg-transparent border-none rounded-full px-6 py-5 focus:ring-0 text-on-surface font-semibold placeholder:text-outline/50 text-base" id="planting_date" placeholder="e.g., Oct 15, 2023" type="text" />
        </div>
        </div>

        <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
        <label className="font-label text-[13px] font-bold text-primary uppercase tracking-wider" htmlFor="plot_size">Cultivation Area</label>
        <span className="text-[11px] font-semibold text-primary/60 italic">Calculates total volume</span>
        </div>
        <div className="relative premium-input-ring rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/30">
        <input className="w-full bg-transparent border-none rounded-full px-6 py-5 focus:ring-0 text-on-surface font-semibold placeholder:text-outline/50 text-base" id="plot_size" placeholder="e.g., 2.5 Hectares" type="text" />
        </div>
        </div>

        <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
        <label className="font-label text-[13px] font-bold text-primary uppercase tracking-wider" htmlFor="inputs">Treatments &amp; Inputs</label>
        <span className="text-[11px] font-semibold text-primary/60 italic">Boosts listing premium</span>
        </div>
        <div className="relative premium-input-ring rounded-[2rem] overflow-hidden bg-surface-container-high border border-outline-variant/30">
        <textarea className="w-full bg-transparent border-none rounded-[2rem] px-6 py-5 focus:ring-0 text-on-surface font-semibold placeholder:text-outline/50 text-base resize-none" id="inputs" placeholder="List fertilizers, organic treatments, or pesticides used..." rows="3"></textarea>
        </div>
        </div>

        <div className="mt-8 rounded-xl overflow-hidden h-44 relative group border border-primary/5">
        <img alt="Field imagery" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2000ms]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlbDM5deTWSNOlkDsAEhfCpRDBwDM2LEBjUpdRTReM2drALKFReO2C11F41B1EcO8MLThnZUYrTCDZM-4JuW9--W6f5mIFH4b1jlZl7l_vd8M67r0fUEp8-s9EmmrWmV-I8LDP-QXTwbSDuFyoKjlPxJMwdpT4xmBx621HXksjeBOH90HR1CQWaWxFz6gkjBTGFd5jOH4D9RJURe51UMA9BuY2Dlqy-Yg9PqIJu-KwVtLbmiedBI6_Q99M7rLHfEohp3ctqf4fD7g" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent flex flex-col justify-end p-6">
        <div className="flex items-center gap-3 mb-1">
        <div className="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-full animate-pulse shadow-[0_0_8px_rgba(233,195,73,0.8)]"></div>
        <p className="text-white text-[11px] font-bold tracking-[0.2em] uppercase opacity-90">Live Prediction Active</p>
        </div>
        <p className="text-white/80 text-[13px] font-medium leading-snug">
                            AI is currently analyzing local soil moisture &amp; climate trends for your crop type.
                        </p>
        </div>
        </div>

        <div className="pt-8">
        <button className="w-full bg-primary text-on-primary font-headline text-lg font-extrabold py-5 rounded-full shadow-2xl shadow-primary/30 hover:shadow-primary/40 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group" type="submit">
        <span>Generate Harvest Listing</span>
        <span className="material-symbols-outlined transition-transform duration-300 group-hover:translate-x-1" data-icon="arrow_forward">arrow_forward</span>
        </button>
        <p className="text-center text-[11px] font-bold text-on-surface-variant/40 mt-4 uppercase tracking-[0.15em]">
                        Secure Blockchain Registry Enabled
                    </p>
        </div>
        </form>
        </main>

        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-10 pt-4 bg-[#FAF9F6]/95 dark:bg-[#1A1C1A]/95 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.06)] rounded-t-[3rem] border-t border-primary/5">

        <Link className="flex flex-col items-center justify-center text-primary/40 px-5 py-2 hover:bg-primary/5 rounded-full transition-all" to={ROUTES.HOME}>
        <span className="material-symbols-outlined !text-[26px]" data-icon="dashboard">dashboard</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Home</span>
        </Link>

        <Link className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-6 py-3 transition-all duration-300 shadow-lg shadow-primary/20" to={ROUTES.FARMER_RECORD_PLANTING}>
        <div className="flex items-center gap-2">
        <span className="material-symbols-outlined !text-[24px]" data-icon="eco">eco</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-widest">Active Crop</span>
        </div>
        </Link>

        <Link className="flex flex-col items-center justify-center text-primary/40 px-5 py-2 hover:bg-primary/5 rounded-full transition-all" to={ROUTES.PROTOTYPE}>
        <span className="material-symbols-outlined !text-[26px]" data-icon="account_circle">account_circle</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-wider mt-1">Profile</span>
        </Link>
        </nav>
      </>
    </PrototypePageFrame>
  )
}

export default RecordPlantingPage
