import { Link, useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n        .material-symbols-outlined {\n            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n        }\n        .glass-card {\n            background: rgba(250, 249, 246, 0.7);\n            backdrop-filter: blur(20px);\n        }\n        .moss-glow {\n            box-shadow: 0 20px 60px -15px rgba(74, 103, 65, 0.3);\n        }\n        .ai-border-gradient {\n            background: linear-gradient(135deg, #334F2B 0%, #735C00 100%);\n            padding: 2px;\n        }\n        .ai-inner-card {\n            background: #ffffff;\n            border-radius: calc(3rem - 2px);\n        }\n    ",
  "\n        body {\n          min-height: max(884px, 100dvh);\n        }\n    "
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

function NearbyBarterMatchesPage() {
  const navigate = useNavigate()

  return (
    <PrototypePageFrame
      title="TaniTrade AI"
      htmlClass="light"
      bodyClass="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="w-full top-0 sticky z-50 bg-[#FAF9F6] dark:bg-[#1A1C1A]">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-md mx-auto">
        <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
        <img alt="User Profile" className="w-full h-full object-cover" data-alt="Close-up portrait of a smiling Malaysian man in his 40s wearing a light linen shirt, soft natural lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBDqr7FUkGYhOxmZeoYgVtsMAJxiHzkzSPXgcL62_rsjj2rKu19eX69azwwSsGcULWhtv7kDWMwUTWkOAHpRzBcaMZXIB-McmPvj0FFL8EB1vaVY5vjvlXcCizlQcsVrHiD8CEEt_Dk04XD1Yi4rZKPdComlo_PxMVlwuPNkqASomWPzQLv36DqTb3aQ7L3PZIh5-V9jt9zZ0FpRCFef6NP4W4xODyr1B1K_m_udZ01CAKFc9BkKwAz7HjYADM_7uccerJlBneLdQ" />
        </div>
        <h1 className="font-headline font-extrabold text-[#334F2B] dark:text-[#FAF9F6] tracking-tighter text-xl">TaniTrade AI</h1>
        </div>
        <button className="text-[#334F2B] dark:text-[#FAF9F6] hover:opacity-80 transition-opacity" onClick={() => navigate(ROUTES.FARMER_PARSED_SUMMARY)} type="button">
        <span className="material-symbols-outlined" data-icon="location_on">location_on</span>
        </button>
        </div>
        </header>
        <main className="max-w-md mx-auto px-6 pb-32">

        <section className="mt-8 mb-8">
        <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight leading-tight mb-3">
                    Best Matches Nearby
                </h2>
        <div className="flex gap-2 items-start text-on-surface-variant">
        <span className="material-symbols-outlined text-primary shrink-0 text-xl" data-icon="hub">hub</span>
        <p className="font-medium text-[15px] leading-snug">
                        AI has analyzed <span className="text-primary font-bold">42 local inventories</span> to find your perfect barter partners.
                    </p>
        </div>
        </section>

        <section className="mb-10 relative h-40 rounded-full overflow-hidden bg-surface-container-high border-4 border-white shadow-inner">
        <img alt="Map Preview" className="w-full h-full object-cover opacity-60" data-alt="Stylized aerial map view of lush agricultural land with small road networks and green fields in soft earthy tones" data-location="Kuala Lumpur" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6EgTzIA-biQKWRP3qwpoGUT0Wlgc5gpNXoNTuuxqU7YKS1j_mHRbgB4XNX00n3KJL91ZSI27DB41dLkgSZJeRcUGDbFPTY6NjERxdSQUiLxsjneEaER3UBBWT8xZX7ze7wXCB58TqjMlOjLFVtjHhcYCYn5KDvZoFVwX10YqoU6R2_BKuMPOgOGLcT2r8NGLFNRHYr3VOcf-hYIAZn8pKCZCDLwfs25OftqYSTh0gcv3mYyS0Z0oMAGOGJ_DxbKi_Jqw262IMG0g" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface/40"></div>

        <div className="absolute top-1/2 left-1/3 -translate-y-1/2">
        <div className="relative">
        <div className="w-4 h-4 bg-primary rounded-full border-2 border-white animate-pulse"></div>
        <div className="absolute -top-10 -left-6 bg-white px-3 py-1 rounded-full shadow-sm text-[10px] font-bold text-primary whitespace-nowrap">
                            You are here
                        </div>
        </div>
        </div>
        <div className="absolute top-1/4 right-1/4">
        <div className="w-3 h-3 bg-tertiary rounded-full border-2 border-white"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/2">
        <div className="w-3 h-3 bg-tertiary rounded-full border-2 border-white"></div>
        </div>
        </section>

        <div className="space-y-8">

        <div className="relative group">

        <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-tertiary to-primary rounded-[3.25rem] opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
        <div className="ai-border-gradient rounded-[3rem] shadow-2xl moss-glow relative overflow-hidden">

        <div className="absolute top-0 right-0 bg-primary text-on-primary px-6 py-2 rounded-bl-3xl z-10 flex items-center gap-2 shadow-lg">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
        <span className="text-[11px] font-extrabold uppercase tracking-widest">Optimized Match</span>
        </div>
        <div className="ai-inner-card p-8">

        <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4 items-center">
        <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 p-1">
        <img alt="Pak Abu" className="w-full h-full object-cover rounded-full" data-alt="Portrait of an elderly Malaysian farmer with a kind face and weathered skin, wearing a traditional straw hat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdEhYHIoZ37hO9AyOcBnc996PJcCWY3sCUzj2rtyL2GpnGczOGhD8NzGDZOEUXXrzAAypRgqxiB64iLI5JbbWMV3B3uELtwAy0e15iXeuqIXG6gCO9QF8BvjVwTZ8z3Lukj7R8lyOCwG55wAWTh_KWuVGKeh-eWJStdlpu6D4A-LBbNf6CCKDBLkJVWlqBRvIQgPa68mVaGKswVMb6v2HNlkEFoP5SdqTL2KdoQj-_pXdX6t9jysHRV7GUnW-mdSfgkXK62rDrVec" />
        </div>
        <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
        </div>
        <div>
        <h3 className="font-headline font-black text-2xl text-on-surface">Pak Abu</h3>
        <div className="flex items-center gap-1 text-primary font-bold text-sm">
        <span className="material-symbols-outlined text-[18px]" data-icon="location_on">location_on</span>
        <span>2.4km • Active Now</span>
        </div>
        </div>
        </div>
        <div className="flex flex-col items-end">
        <span className="text-primary font-black text-3xl leading-none">95%</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mt-1">AI Rating</span>
        </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-variant shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-secondary/10 rounded-bl-2xl flex items-center justify-center">
        <span className="material-symbols-outlined text-secondary text-lg" data-icon="check_circle">check_circle</span>
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-black">He Offers</span>
        <div className="flex flex-col gap-1">
        <span className="font-extrabold text-on-surface text-[15px]">Organic Pesticide</span>
        <span className="text-xs text-on-surface-variant font-medium">15 Liters available</span>
        </div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-surface-variant shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-tertiary/10 rounded-bl-2xl flex items-center justify-center">
        <span className="material-symbols-outlined text-tertiary text-lg" data-icon="shopping_basket">shopping_basket</span>
        </div>
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant block mb-2 font-black">He Needs</span>
        <div className="flex flex-col gap-1">
        <span className="font-extrabold text-on-surface text-[15px]">Bio-Fertilizer</span>
        <span className="text-xs text-on-surface-variant font-medium">Immediate priority</span>
        </div>
        </div>
        </div>

        <div className="bg-primary/5 p-5 rounded-[2rem] border-2 border-dashed border-primary/20 mb-8 relative">
        <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-primary" data-icon="psychology" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
        </div>
        <div>
        <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-primary mb-1">Harvest Intelligence™ Insight</h4>
        <p className="text-[13px] text-on-surface leading-relaxed font-medium">
                                            Pak Abu's <span className="text-primary font-bold">Surplus Pesticide</span> directly matches your <span className="text-primary font-bold">Current Shortage</span>. AI predicts his soil quality will benefit 28% more from your specific compost blend compared to standard commercial alternatives.
                                        </p>
        </div>
        </div>
        </div>
        <button className="w-full py-5 bg-primary text-on-primary font-black rounded-full hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-primary/30 text-lg" onClick={() => navigate(ROUTES.FARMER_AI_TRADE_PROPOSAL)} type="button">
                                Execute Trade
                                <span className="material-symbols-outlined font-black" data-icon="bolt">bolt</span>
        </button>
        </div>
        </div>
        </div>

        <div className="pt-6 pb-2 border-t border-outline-variant/30">
        <h4 className="text-xs font-black uppercase tracking-[0.25em] text-on-surface-variant text-center">Other Potential Exchanges</h4>
        </div>

        <div className="bg-surface-container-low p-6 rounded-[2.5rem] transition-all border border-transparent hover:border-outline-variant/30 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden grayscale opacity-70 border-2 border-outline-variant shrink-0">
        <img alt="Lin Chen" className="w-full h-full object-cover" data-alt="Portrait of a young female farmer in a bright green field, modern agricultural setting with natural sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8_02-vjRuRVvEXHSFWMZlcsWv0kHiWvS7zPctIE_E1sw4wYUEsDhfIqy0G0T5lu8WBHWiJXBU6RZtDduZEedPXYzyAHFb75T4HtS3Jp3rCuY7FgOxQC7RSJN8buE8mW76GQ6MwMDrnPV18aop4J3jOLSDFjeqiNl-xpWZyG6dfK4puJAnNgks7KM7uuhyuj_SPN3LjUL-R91gGZqgpeYLE1FLaw7PBFATaK2DZcbD8fhp5t3C768_uaeAWNcntIuUZwtGnj-8Nls" />
        </div>
        <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
        <h3 className="font-headline font-bold text-lg text-on-surface">Lin Chen</h3>
        <span className="bg-surface-container-highest px-3 py-1 rounded-full text-on-surface-variant font-bold text-xs">82% Match</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-3 font-semibold">
        <span className="material-symbols-outlined text-[14px]" data-icon="distance">distance</span>
        <span>5.1km away</span>
        </div>
        <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-secondary"></span>
        <span className="text-xs font-bold text-on-surface">Seedling Trays</span>
        </div>
        <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
        <span className="text-xs font-bold text-on-surface">Compost Tea</span>
        </div>
        </div>
        </div>
        <button className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors" onClick={() => navigate(ROUTES.FARMER_AI_TRADE_PROPOSAL)} type="button">
        <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
        </button>
        </div>

        <div className="bg-surface-container-low p-6 rounded-[2.5rem] transition-all border border-transparent hover:border-outline-variant/30 flex items-center gap-5">
        <div className="w-20 h-20 rounded-full overflow-hidden grayscale opacity-70 border-2 border-outline-variant shrink-0">
        <img alt="Siti Sarah" className="w-full h-full object-cover" data-alt="Portrait of a woman wearing a hijab in a garden setting, holding fresh vegetables, warm sunset lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBomw3kKZjRggyQkJaEqMU_hXsF83yNrIGa7J2KrO_baoFmd6h8ZI_QC6HhDL8LlvggcktkKK7ruVgxi1bwbnBVffxPzRiicDLjSa29D6Dkh_jvcunlVr3KBb7j0fOc63H_yUd0d84m1jeqQ3iRIEbU8o8TWpusePm1k9mH5pMoajdwwabm9tPgWNcHB34-LHKenPA0LgMHyYfhH5JAUgqSvkR9Jorm6GcbJAeRGIeBRFMejdLTgWSnVixUIMRNhDACtNPdoyQX9aU" />
        </div>
        <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
        <h3 className="font-headline font-bold text-lg text-on-surface">Siti Sarah</h3>
        <span className="bg-surface-container-highest px-3 py-1 rounded-full text-on-surface-variant font-bold text-xs">76% Match</span>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-3 font-semibold">
        <span className="material-symbols-outlined text-[14px]" data-icon="distance">distance</span>
        <span>3.8km away</span>
        </div>
        <div className="flex gap-4">
        <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-secondary"></span>
        <span className="text-xs font-bold text-on-surface">Shovel Set</span>
        </div>
        <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-tertiary"></span>
        <span className="text-xs font-bold text-on-surface">Fruit Crates</span>
        </div>
        </div>
        </div>
        <button className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center text-on-surface hover:bg-surface-variant transition-colors" onClick={() => navigate(ROUTES.FARMER_AI_TRADE_PROPOSAL)} type="button">
        <span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
        </button>
        </div>
        </div>
        </main>

        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-6 pb-8 pt-4 bg-[#FAF9F6]/90 dark:bg-[#1A1C1A]/90 backdrop-blur-2xl rounded-t-[3rem] border-t border-[#334F2B]/10 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <Link className="flex flex-col items-center justify-center text-[#4A6741] opacity-50 px-5 py-2 hover:bg-[#4A6741]/5 rounded-full transition-all" to={ROUTES.HOME}>
        <span className="material-symbols-outlined" data-icon="home">home</span>
        <span className="font-['Inter'] text-[10px] font-black uppercase tracking-[0.1em] mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center bg-[#334F2B] text-white rounded-full px-6 py-2 transition-all shadow-lg" to={ROUTES.FARMER_NEARBY_MATCHES}>
        <span className="material-symbols-outlined" data-icon="handshake" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
        <span className="font-['Inter'] text-[10px] font-black uppercase tracking-[0.1em] mt-1">Trade</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#4A6741] opacity-50 px-5 py-2 hover:bg-[#4A6741]/5 rounded-full transition-all" to={ROUTES.PROTOTYPE}>
        <span className="material-symbols-outlined" data-icon="person">person</span>
        <span className="font-['Inter'] text-[10px] font-black uppercase tracking-[0.1em] mt-1">Profile</span>
        </Link>
        </nav>
      </>
    </PrototypePageFrame>
  )
}

export default NearbyBarterMatchesPage
