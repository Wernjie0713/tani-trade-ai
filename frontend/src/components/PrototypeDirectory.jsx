import { ArrowRight, Leaf, ShoppingBasket, Sprout } from "lucide-react"
import { Link } from "react-router-dom"

function PrototypeDirectory({ pages }) {
  const farmerPages = pages.filter((page) => page.group === "Farmer Flow")
  const buyerPages = pages.filter((page) => page.group === "Buyer Flow")
  const entryPages = pages.filter((page) => page.group === "Entry")

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-on-surface sm:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-outline-variant/40 bg-white p-8 shadow-[0_30px_120px_-70px_rgba(51,79,43,0.5)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/8 px-4 py-2 text-primary">
              <Leaf className="size-4" />
              <span className="font-label text-[11px] font-bold uppercase tracking-[0.22em]">
                Stitch Prototype Port
              </span>
            </div>

            <div className="mt-6 max-w-3xl space-y-4">
              <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
                TaniTrade AI frontend screens
              </h1>
              <p className="max-w-2xl text-base leading-7 text-on-surface-variant sm:text-lg">
                Each stitched HTML screen is now routed inside the React + Tailwind app.
                The pages below are preserved as close as possible to the supplied stitch
                markup so you can continue building frontend flows before wiring backend
                logic.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-outline-variant/30 bg-surface-container-low px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-outline">
                  Total pages
                </p>
                <p className="mt-3 font-headline text-3xl font-extrabold text-primary">
                  {pages.length}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-outline-variant/30 bg-surface-container-low px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-outline">
                  Farmer flow
                </p>
                <p className="mt-3 font-headline text-3xl font-extrabold text-primary">
                  {farmerPages.length}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-outline-variant/30 bg-surface-container-low px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-outline">
                  Buyer flow
                </p>
                <p className="mt-3 font-headline text-3xl font-extrabold text-primary">
                  {buyerPages.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-outline-variant/35 bg-primary p-8 text-on-primary shadow-[0_30px_120px_-70px_rgba(51,79,43,0.9)] sm:p-10">
            <p className="font-label text-[11px] font-bold uppercase tracking-[0.22em] text-primary-fixed">
              Recommended routes
            </p>
            <div className="mt-6 space-y-4">
              <Link
                className="flex items-center justify-between rounded-[1.5rem] border border-white/15 bg-white/10 px-5 py-4 transition hover:bg-white/14"
                to="/"
              >
                <div>
                  <p className="font-headline text-lg font-bold">Open landing page</p>
                  <p className="mt-1 text-sm text-white/72">
                    Start from the stitched role selection screen.
                  </p>
                </div>
                <ArrowRight className="size-5" />
              </Link>
              <Link
                className="flex items-center justify-between rounded-[1.5rem] border border-white/15 bg-white/10 px-5 py-4 transition hover:bg-white/14"
                to="/farmer/voice-input"
              >
                <div>
                  <p className="font-headline text-lg font-bold">Open farmer flow</p>
                  <p className="mt-1 text-sm text-white/72">
                    Voice input through planting record.
                  </p>
                </div>
                <ArrowRight className="size-5" />
              </Link>
              <Link
                className="flex items-center justify-between rounded-[1.5rem] border border-white/15 bg-white/10 px-5 py-4 transition hover:bg-white/14"
                to="/buyer/marketplace"
              >
                <div>
                  <p className="font-headline text-lg font-bold">Open buyer flow</p>
                  <p className="mt-1 text-sm text-white/72">
                    Marketplace through reservation confirmation.
                  </p>
                </div>
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-3">
          <RouteGroup
            description="Entry point and role choice."
            icon={Sprout}
            pages={entryPages}
            title="Entry"
          />
          <RouteGroup
            description="Farmer barter and planting journey."
            icon={Leaf}
            pages={farmerPages}
            title="Farmer Flow"
          />
          <RouteGroup
            description="Buyer reservation and future supply screens."
            icon={ShoppingBasket}
            pages={buyerPages}
            title="Buyer Flow"
          />
        </section>
      </div>
    </main>
  )
}

function RouteGroup({ description, icon, pages, title }) {
  const Icon = icon

  return (
    <section className="rounded-[2rem] border border-outline-variant/35 bg-white p-6 shadow-[0_24px_90px_-70px_rgba(51,79,43,0.55)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-surface-container-low p-3 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <h2 className="font-headline text-2xl font-extrabold tracking-tight text-primary">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-on-surface-variant">{description}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {pages.map((page) => (
          <Link
            key={page.path}
            className="group flex items-center justify-between rounded-[1.35rem] border border-outline-variant/30 bg-surface-container-lowest px-4 py-4 transition hover:border-primary/25 hover:bg-surface-container-low"
            to={page.path}
          >
            <div className="pr-4">
              <p className="font-headline text-base font-bold text-on-surface">
                {page.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                {page.description}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-outline transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default PrototypeDirectory
