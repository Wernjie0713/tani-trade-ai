import { Link } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      body {\n        min-height: 100dvh;\n        background-color: #faf9f6;\n      }\n    ",
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
  "--font-sans": "Inter, sans-serif",
  "--font-body": "Inter, sans-serif",
  "--font-label": "Manrope, sans-serif",
  "--font-headline": "Manrope, sans-serif",
  "--radius": "1rem",
  "--radius-lg": "2rem",
  "--radius-xl": "3rem",
}

function LandingRoleSelectionPage() {
  return (
    <PrototypePageFrame
      title="TaniTrade AI - Smart Barter & Early Demand"
      htmlClass="light"
      bodyClass="bg-background text-on-surface font-body selection:bg-primary/20 flex flex-col"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <header className="sticky top-0 z-50 w-full bg-[#FAF9F6]/80 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
            <span className="font-headline text-xl font-extrabold tracking-tight text-[#334F2B]">
              TaniTrade AI
            </span>
            <div className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1">
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                Choose Role
              </span>
            </div>
          </div>
        </header>

        <main className="flex-grow flex flex-col max-w-lg mx-auto w-full">
          <section className="px-6 pt-4 pb-6 flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high w-fit">
                <span
                  className="material-symbols-outlined text-primary text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  eco
                </span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                  New: AI-Driven Barter
                </span>
              </div>
              <h1 className="font-headline font-extrabold text-3xl text-primary leading-tight tracking-tight">
                Harvesting future demand through smart trade.
              </h1>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                Secure commitments before you even plant. The premium digital marketplace for smallholder farmers.
              </p>
            </div>

            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden shadow-sm">
              <img
                alt="Agricultural Fields"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYhfDrwXMB0lLO1PIXBrXUDjPXmQzZqdRZYlX5Nrr1vrrlsXjmHXQxQ7DBQN3nLR4aR9JcsF2z13U0zVCkIF2NgxI-1Ei34OCtnfqxawwWAP1qohtwxtRni-SdZfKDxAp8BObhjR5i6ETRL_nCgrRQtLhROq5UlrlFKTcwhDC_NGo2LT9Za7FDCRSmfDkG8DpOlkX961WrkaPD_md7CvexnSDX9S2xWRNJhGzu3eN9RRlBEcLMxQSIlLZvPbRNFwgghPZ9XhLd4Ig"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/20">
                <span className="material-symbols-outlined text-white text-sm">trending_up</span>
                <span className="text-white text-[10px] font-bold uppercase tracking-wider">
                  Live Market Activity
                </span>
              </div>
            </div>
          </section>

          <section className="px-6 pb-10 flex flex-col gap-4">
            <div className="text-center py-2">
              <p className="font-label text-[10px] font-extrabold uppercase tracking-[0.2em] text-tertiary">
                Begin Your Journey
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <Link
                className="group flex items-center gap-4 p-4 bg-surface-container-lowest rounded-full border border-outline-variant/30 active:scale-[0.98] transition-all shadow-sm"
                to={ROUTES.FARMER_VOICE_INPUT}
              >
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shrink-0">
                  <span className="material-symbols-outlined text-2xl">agriculture</span>
                </div>
                <div className="text-left flex-grow">
                  <h3 className="font-headline font-bold text-base text-primary">I am a Farmer</h3>
                  <p className="font-body text-[11px] text-on-surface-variant leading-tight">
                    List surplus and secure pre-harvest demand.
                  </p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>

              <Link
                className="group flex items-center gap-4 p-4 bg-surface-container-lowest rounded-full border border-outline-variant/30 active:scale-[0.98] transition-all shadow-sm"
                to={ROUTES.BUYER_MARKETPLACE}
              >
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    shopping_basket
                  </span>
                </div>
                <div className="text-left flex-grow">
                  <h3 className="font-headline font-bold text-base text-secondary">I am a Buyer</h3>
                  <p className="font-body text-[11px] text-on-surface-variant leading-tight">
                    Source fresh produce directly from the origin.
                  </p>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:translate-x-1 transition-transform">
                  chevron_right
                </span>
              </Link>
            </div>
          </section>
        </main>

        <footer className="px-6 py-8 bg-surface-container/50 text-center border-t border-outline-variant/10">
          <p className="text-[10px] text-on-surface-variant/60 font-semibold tracking-wide">
            © 2026 TANITRADE AI. WORKING MVP FOR FARMER BARTER AND BUYER RESERVATION.
          </p>
        </footer>
      </>
    </PrototypePageFrame>
  )
}

export default LandingRoleSelectionPage
