import { Link, useNavigate } from "react-router-dom"

import { useFarmerFlow } from "@/context/FarmerFlowContext"
import { ROUTES } from "@/prototype/routes"

function navClasses(isActive) {
  return isActive
    ? "flex flex-col items-center justify-center rounded-full bg-primary px-6 py-2.5 text-on-primary shadow-lg shadow-primary/20 transition-all"
    : "flex flex-col items-center justify-center rounded-full px-5 py-2 text-primary/50 transition-all hover:bg-primary/5 hover:text-primary"
}

function FarmerShell({
  activeNav = "barter",
  backTo = null,
  children,
  containerClassName = "max-w-md",
  headerTitle,
}) {
  const navigate = useNavigate()
  const { flowIds } = useFarmerFlow()

  const harvestRoute = flowIds.harvestListingId
    ? ROUTES.FARMER_FUTURE_SUPPLY_READINESS
    : flowIds.tradeId
      ? ROUTES.FARMER_RECORD_PLANTING
      : ROUTES.FARMER_VOICE_INPUT

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/85 backdrop-blur-xl">
        <div
          className={`mx-auto flex w-full items-center justify-between gap-4 px-6 py-4 ${containerClassName}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            {backTo ? (
              <button
                aria-label="Go back"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary transition-colors hover:bg-surface-container"
                onClick={() => navigate(backTo)}
                type="button"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  agriculture
                </span>
              </div>
            )}

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary/60">
                {backTo ? "Farmer Flow" : "TaniTrade AI"}
              </p>
              <h1 className="truncate font-headline text-lg font-extrabold tracking-tight text-primary">
                {headerTitle}
              </h1>
            </div>
          </div>

          <div className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Farmer
            </span>
          </div>
        </div>
      </header>

      {children}

      <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-primary/10 bg-background/90 backdrop-blur-2xl">
        <div
          className={`mx-auto flex w-full items-center justify-around px-6 pb-8 pt-4 ${containerClassName}`}
        >
          <Link className={navClasses(activeNav === "home")} to={ROUTES.HOME}>
            <span className="material-symbols-outlined">home</span>
            <span className="mt-1 text-[10px] font-black uppercase tracking-[0.1em]">
              Home
            </span>
          </Link>

          <Link className={navClasses(activeNav === "barter")} to={ROUTES.FARMER_VOICE_INPUT}>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: activeNav === "barter" ? "'FILL' 1" : "'FILL' 0" }}
            >
              handshake
            </span>
            <span className="mt-1 text-[10px] font-black uppercase tracking-[0.1em]">
              Barter
            </span>
          </Link>

          <Link className={navClasses(activeNav === "harvest")} to={harvestRoute}>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: activeNav === "harvest" ? "'FILL' 1" : "'FILL' 0" }}
            >
              eco
            </span>
            <span className="mt-1 text-[10px] font-black uppercase tracking-[0.1em]">
              Harvest
            </span>
          </Link>
        </div>
      </nav>
    </>
  )
}

export default FarmerShell
