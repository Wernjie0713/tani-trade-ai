import { useNavigate } from "react-router-dom"

import PrototypePageFrame from "@/components/PrototypePageFrame"
import { ROUTES } from "@/prototype/routes"

const styles = [
  "\n      .material-symbols-outlined {\n        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;\n      }\n      .glass-card {\n        background: rgba(250, 249, 246, 0.6);\n        backdrop-filter: blur(20px);\n        -webkit-backdrop-filter: blur(20px);\n      }\n      body {\n        min-height: max(884px, 100dvh);\n      }\n    "
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

function ReservationConfirmedPage() {
  const navigate = useNavigate()

  return (
    <PrototypePageFrame
      title="Harvest Cycle Joined - TaniTrade AI"
      htmlClass="light"
      bodyClass="bg-background font-body text-on-background antialiased"
      styles={styles}
      themeStyle={themeStyle}
    >
      <>
        <main className="min-h-screen flex flex-col items-center px-6 py-12 max-w-lg mx-auto">

        <div className="relative w-full aspect-square max-w-[320px] mb-8 group">
        <div className="absolute inset-0 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/20 transition-colors duration-700"></div>
        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-sm">
        <img alt="Basket filling with grain" className="w-full h-full object-cover" data-alt="Close up of high quality jasmine rice grains falling into a rustic handwoven bamboo basket, warm soft morning sunlight, editorial food photography style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQfJdsirtQ84d5u8GHHevRg0YSfupsAj9uyXEihZd1RTOGeWAGHOGrkqC5oAT52so1ZTTLWlp-DgMRHBoGV2qp2FSZAzyml2IfyVwR1wO-o4PZTGrokZv1EFzpLSTvuRqgDLX9WrxTjLktU1bZZNXreWhIdGk2jj3vTg6GXayvXrnEQrYwIiZKBBZy2ecrzIejY9JNgylohIHKt1OsIm4Hd7ZY8dz62vxd9D6H_RhvbWY6DBpMVviFd_n-LJEikb6t7qxKz4tlR0k" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
        </div>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-2 rounded-full flex items-center gap-2 shadow-lg border border-primary-container">
        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
        <span className="text-[11px] font-bold tracking-widest uppercase font-label">Supply Secured</span>
        </div>
        </div>

        <div className="text-center mb-10">
        <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-4">
                        Harvest Cycle Joined
                    </h1>
        <p className="text-on-surface-variant text-lg max-w-md mx-auto leading-relaxed px-4">
                        Your commitment to this season's yield strengthens our local food security. Thank you for partnering with our farmers.
                    </p>
        </div>

        <div className="w-full flex flex-col gap-4 mb-10">

        <div className="bg-surface-container-low rounded-lg p-8 border border-outline-variant/30">
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 block">Reserved Allocation</span>
        <h3 className="font-headline font-bold text-2xl text-primary mb-1">Premium Paddy</h3>
        <p className="text-on-surface-variant font-medium mb-6">100kg • Commitment Locked</p>
        <div className="inline-flex items-center gap-4 bg-surface-container-lowest px-4 py-3 rounded-full border border-outline-variant/20 shadow-sm">
        <img alt="Pak Abu Profile" className="w-10 h-10 rounded-full object-cover" data-alt="Portrait of an elderly Southeast Asian male farmer with a kind smile and sun-weathered skin wearing a traditional hat, blurred rice field background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCl4vXnJiWV34SGWKsxJ7n2U8yVTPBauSvym-GNe5JAXblgpePRAimYxJpKt2NUmUnZWzCk9myzSKLR2y72yl9CUvPSWOK-orwnCl-V4Eg05rE8lHJGt8DNqiV0Q-Xvf3rkfJwdvw72ee-kUgi3R_wEDx-Kk0BcpgXrdqe0dEDj7DqyIru7HW5BE2ZG8d4wDBpYPV6a5DhG2iOSsg0J6BcbBbboYxCWO3vcEhJoWV46BFQjkEbVodIsE-F72Q9C2o-D_o9jII8AaM8" />
        <div className="pr-2">
        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">Your Partner Farmer</p>
        <p className="font-bold text-primary">Pak Abu</p>
        </div>
        </div>
        </div>

        <div className="bg-surface-container-low rounded-full px-8 py-5 flex items-center gap-4 border border-outline-variant/10">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-[20px]">eco</span>
        </div>
        <div>
        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Est. Harvest</span>
        <p className="font-bold text-on-surface">January 2026</p>
        </div>
        </div>

        <div className="bg-tertiary-fixed rounded-full px-8 py-5 flex items-center gap-4 border border-tertiary-container/30">
        <div className="w-10 h-10 rounded-full bg-tertiary/20 flex items-center justify-center text-on-tertiary-fixed-variant">
        <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
        </div>
        <div>
        <span className="text-[10px] font-bold text-on-tertiary-fixed-variant uppercase tracking-widest block">Strategic Benefit</span>
        <p className="font-bold text-on-tertiary-fixed">10% Yield Bonus</p>
        </div>
        </div>

        <div className="w-full bg-surface-container-low rounded-lg p-6 flex items-start gap-4 border border-outline-variant/10">
        <span className="material-symbols-outlined text-secondary mt-1">handshake</span>
        <p className="text-sm text-on-surface-variant leading-relaxed italic">
                            "You're more than a buyer; you're a steward of this land. We'll send regular updates on Pak Abu's progress as the grain matures."
                        </p>
        </div>
        </div>

        <div className="w-full flex flex-col gap-4">
        <button className="w-full px-10 py-5 bg-primary text-on-primary rounded-full font-headline font-bold text-lg hover:opacity-95 active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-3" onClick={() => navigate(ROUTES.PROTOTYPE)} type="button">
        <span className="material-symbols-outlined">inventory_2</span>
                        Manage My Commitments
                    </button>
        <button className="w-full px-10 py-5 bg-surface-container-high text-primary rounded-full font-headline font-bold text-lg hover:bg-surface-container-highest active:scale-[0.98] transition-all flex items-center justify-center gap-3" onClick={() => navigate(ROUTES.BUYER_MARKETPLACE)} type="button">
        <span className="material-symbols-outlined">storefront</span>
                        Back to Marketplace
                    </button>
        </div>
        </main>
        <footer className="py-12 text-center opacity-40">
        <p className="font-headline font-black text-[#334F2B] tracking-tighter text-sm">TaniTrade AI</p>
        </footer>
      </>
    </PrototypePageFrame>
  )
}

export default ReservationConfirmedPage
