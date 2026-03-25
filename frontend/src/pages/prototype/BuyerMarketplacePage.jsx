import { Link, useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"

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

function BuyerMarketplacePage() {
  const navigate = useNavigate()

  return (
    <PrototypePageFrame
      title="TaniTrade AI - Future Harvest Reservations"
      htmlClass="light"
      bodyClass="bg-surface text-on-surface font-body min-h-screen pb-32"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="w-full top-0 sticky z-40 bg-surface/90 backdrop-blur-md">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant/30">
        <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIfedCV03dBIrmZdY_HEkBCbFWZ0U-KrV3FCKM561c5xfB8sdOq10vfPhdwrcVOqOt4Gh6u72aggFwDOjZQpLCU6_CEMQFuZ322DBIXAH-lm-H48PlxLfodPMlekWvdPQjON1onoC_3ulJGzLSiDsk6RntmzhEAYmBbHtfGml0_bwsG_ufToZ5WXmvllahxDwhybHbC5GSJGB8zSSnQ46bx5tECnMN87xvF06AlGgtxgi12a7-vcZtsFkM4T6i6GWCBHf_aX5UXZU" />
        </div>
        <h1 className="font-headline font-extrabold text-primary tracking-tight text-lg">TaniTrade AI</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors" onClick={() => navigate(ROUTES.PROTOTYPE)} type="button">
        <span className="material-symbols-outlined text-primary" data-icon="notifications">notifications</span>
        </button>
        </div>
        </header>
        <main className="max-w-md mx-auto px-6 pt-4 space-y-10">

        <section className="relative">
        <div className="relative overflow-hidden bg-primary-container rounded-xl p-6 text-on-primary shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
        <span className="material-symbols-outlined text-[14px] text-tertiary-fixed" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white">AI Top Selection</span>
        </div>
        <span className="text-[9px] font-medium text-white/70 uppercase tracking-tighter mt-1">Refined by your purchase history</span>
        </div>
        </div>
        <h2 className="font-headline font-extrabold text-2xl leading-tight mb-3">Premium Organic Paddy</h2>
        <p className="font-body text-sm text-white/90 mb-8 leading-relaxed">Secured volume from High-Output Kedah Plot #42. 98% Yield Reliability Score.</p>
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
        <img alt="Farmer" className="w-8 h-8 rounded-full border-2 border-primary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV4wi9gXIY5EI0v0hFAQwuEE9wvxCXGdnq9dnvyN_EvPjhwewI7l8mcMKHfEv3iBEGTkXxtsq8clpfHgQ8hLtsKZNjqhVP38bHtU9hQfZSmWVDeCAn1y5R78ib9EjE77YHzsCmZ1iS0CbRaqCX9ty6Obai9BDWaXJHeevB6RDclJ1H74FbmZ-YyQ9zYFpyhbmFJv74zUS6Pc0kJ-gOJv5Bgjbvi3zUBtCzk9OZ6Qijn0H9g6NHTR9g6DCS0_mFxsM5-iMXM5UDp1I" />
        <div className="w-8 h-8 rounded-full border-2 border-primary-container bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">
                                    +12
                                </div>
        </div>
        <span className="text-[10px] font-semibold text-white/80">Active Interest</span>
        </div>
        <button className="bg-white text-primary hover:bg-surface-bright font-bold py-3 px-6 rounded-full text-sm transition-all shadow-lg active:scale-95" onClick={() => navigate(ROUTES.BUYER_RESERVATION_CONFIRMED)} type="button">
                            Reserve Now
                        </button>
        </div>
        </div>
        </section>

        <section className="flex overflow-x-auto gap-3 no-scrollbar pb-2 -mx-2 px-2">
        <button className="whitespace-nowrap px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md">All Crops</button>
        <button className="whitespace-nowrap px-6 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-colors">Paddy</button>
        <button className="whitespace-nowrap px-6 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-colors">Corn</button>
        <button className="whitespace-nowrap px-6 py-2 rounded-full bg-surface-container-low text-on-surface-variant font-semibold text-sm hover:bg-surface-container-high transition-colors">Q1 Windows</button>
        </section>

        <section className="space-y-8">
        <div className="flex items-center justify-between px-1">
        <h3 className="font-headline font-bold text-xl text-on-surface tracking-tight">Future Harvest Windows</h3>
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest bg-surface-container px-3 py-1.5 rounded-full">Projected Supply</span>
        </div>
        <div className="space-y-6">

        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md">
        <div className="h-48 relative">
        <img alt="Paddy field" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlLkvVJn16qvv6YbG7HviHuz3aih0PlvDYxOyxDM7-3PeFtTScoqYUvQjb6RBKuTmrBHowg32d2__lzIObbro67pDRNYenRus7LTOwyHzpGoL2kZU7yk2iXtKT7rkaAf2C6y69cTUeCAT2C5WLKscMR49nYIThJSTI_aZ7cKE7PQu80NBJ6wdZrTE30nkMjimGA4A4zGxuzdj8PKN6C4Q32qGCxLyL5UwVZkJm-6Ofo1dh823OZsiZsL6PypTpGDTGP_mkCHKFW_A" />
        <div className="absolute top-4 right-4 glass-insight px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-primary/20">
        <span className="material-symbols-outlined text-[16px] text-primary" data-icon="verified" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Verified Supply</span>
        </div>
        </div>
        <div className="p-6">
        <div className="flex justify-between items-start mb-6">
        <div>
        <h4 className="font-headline font-bold text-lg text-on-surface leading-tight">Elite Paddy - Plot #04</h4>
        <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">Est. Volume: 500kg</p>
        </div>
        <div className="text-right">
        <span className="block font-headline font-extrabold text-xl text-primary leading-none">RM 2,400</span>
        <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-tighter">Reservation Lock</span>
        </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface-container-low/50 p-3 rounded-lg flex flex-col items-center text-center">
        <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Expected Harvest</span>
        <span className="font-semibold text-sm text-primary">Jan 2026</span>
        </div>
        <div className="bg-surface-container-low/50 p-3 rounded-lg flex flex-col items-center text-center">
        <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest mb-1">Region</span>
        <span className="font-semibold text-sm text-primary">Kedah South</span>
        </div>
        </div>
        <button className="w-full py-4 bg-primary text-on-primary font-bold rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md" onClick={() => navigate(ROUTES.BUYER_FUTURE_SUPPLY_READINESS)} type="button">
        <span className="material-symbols-outlined text-lg" data-icon="calendar_month">calendar_month</span>
        <span>Secure Future Supply</span>
        </button>
        </div>
        </div>

        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/10 relative overflow-hidden">
        <div className="flex items-start gap-4">
        <div className="relative">
        <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm">
        <img alt="Sweet Corn" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXrOmFtt6skwiIhZhUxOZAj9pi9INE1vwtiQj5meZMO9h7wH3KkTNG5koWvOD-dScJ-cWZN1_nTDWCHpBvZB-HPwVttfee8WvI9JhJuraNUAjIrOVGfdkxcBp0yD2CS2qfWv523ZSFqN7vPjkNlUhBiD5msoY7iT86RGh3XFSSyToHXflmqIIqGHzqeBZqfScyZCIV7CYtk2MHQEfnei55t3uv4rsOCNV6Ep4VVxiI7DLhEaieF8m1soXy6SlrHsyw22bsB_T7PJE" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white border-2 border-surface-container-low">
        <span className="material-symbols-outlined text-[14px]" data-icon="auto_awesome" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
        </div>
        </div>
        <div className="flex-1">
        <div className="flex justify-between items-start">
        <div>
        <h4 className="font-headline font-bold text-on-surface">Sweet Corn - Grade A</h4>
        <div className="flex items-center gap-1 mt-0.5">
        <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">AI Curated Projection</span>
        </div>
        </div>
        <span className="font-extrabold text-primary">RM 850</span>
        </div>
        <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">Verified Supply: 200kg for Feb 2026 window. Highland Organic Co-op.</p>
        <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-primary" data-icon="verified_user" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
        <span className="text-[11px] font-semibold text-on-surface">Mak Teh • Perak</span>
        </div>
        <button className="text-primary font-bold text-[11px] flex items-center gap-1 hover:underline" onClick={() => navigate(ROUTES.BUYER_FUTURE_SUPPLY_READINESS)} type="button">
                                        Reservation Details
                                        <span className="material-symbols-outlined text-xs" data-icon="chevron_right">chevron_right</span>
        </button>
        </div>
        </div>
        </div>
        </div>

        <div className="bg-surface-container-highest/20 rounded-xl p-5 border border-outline-variant/30">
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
        <span className="material-symbols-outlined text-2xl" data-icon="monitoring">monitoring</span>
        </div>
        <div>
        <h4 className="font-headline font-bold text-on-surface text-sm">Mixed Veggie Projection</h4>
        <p className="text-[9px] text-on-surface-variant uppercase font-bold tracking-widest">Window: Mar 2026</p>
        </div>
        </div>
        <div className="text-right">
        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-tighter">Projected Supply</span>
        <span className="block font-headline font-extrabold text-primary text-lg">120kg</span>
        </div>
        </div>
        <button className="w-full mt-4 py-3 bg-white border border-outline-variant/50 text-primary font-bold rounded-full hover:bg-primary hover:text-on-primary transition-all text-sm" onClick={() => navigate(ROUTES.BUYER_FUTURE_SUPPLY_READINESS)} type="button">
                            Request Reservation Quote
                        </button>
        </div>
        </div>
        </section>

        <section className="glass-insight p-6 rounded-xl border border-white/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
        <span className="material-symbols-outlined text-6xl" data-icon="psychology">psychology</span>
        </div>
        <div className="flex items-start gap-4">
        <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
        <span className="material-symbols-outlined" data-icon="psychology" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
        <div>
        <h5 className="font-headline font-bold text-on-surface text-sm mb-1">AI Market Insight: Bullish</h5>
        <p className="text-xs text-on-surface-variant leading-relaxed">Paddy demand is projected to rise 14% by Dec. Secure your March 2026 reservation now to lock in current rates.</p>
        </div>
        </div>
        </section>
        </main>
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-surface/80 backdrop-blur-xl rounded-t-[2.5rem] border-t border-outline-variant/10 shadow-[0_-8px_30px_rgba(0,0,0,0.04)]">
        <Link className="flex flex-col items-center justify-center text-primary/40 px-5 py-2 hover:bg-primary/5 rounded-full transition-all" to={ROUTES.BUYER_MARKETPLACE}>
        <span className="material-symbols-outlined" data-icon="home">home</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Market</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-6 py-2.5 transition-all shadow-lg shadow-primary/20" to={ROUTES.BUYER_RESERVATION_CONFIRMED}>
        <span className="material-symbols-outlined" data-icon="assignment_turned_in" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Reservations</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-primary/40 px-5 py-2 hover:bg-primary/5 rounded-full transition-all" to={ROUTES.PROTOTYPE}>
        <span className="material-symbols-outlined" data-icon="person">person</span>
        <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Profile</span>
        </Link>
        </nav>
      </>
    </PrototypePageFrame>
  )
}

export default BuyerMarketplacePage
