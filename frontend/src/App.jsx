import { useEffect, useState } from "react"
import {
  ArrowUpRight,
  Bot,
  Database,
  Leaf,
  RefreshCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { isSupabaseConfigured } from "@/lib/supabase"

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1"

const stackItems = [
  {
    title: "FastAPI backend",
    description: "Serve trading workflows, AI endpoints, and Supabase-safe server actions.",
    icon: Server,
  },
  {
    title: "React frontend",
    description: "Build trading dashboards with Tailwind CSS and shadcn/ui primitives.",
    icon: Sparkles,
  },
  {
    title: "Supabase data layer",
    description: "Use Postgres, auth, storage, and realtime from one managed backend.",
    icon: Database,
  },
]

const quickstartCommands = [
  {
    label: "Backend",
    command: "backend\\.venv\\Scripts\\Activate.ps1\nuvicorn app.main:app --reload --app-dir backend",
  },
  {
    label: "Frontend",
    command: "cd frontend\nnpm run dev",
  },
]

async function getApiHealth(signal) {
  const response = await fetch(`${apiBaseUrl}/health`, { signal })

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`)
  }

  return response.json()
}

async function refreshApiHealth(setApiHealth, signal) {
  setApiHealth((current) =>
    current.state === "ready"
      ? { ...current, refreshing: true }
      : { state: "loading", refreshing: false }
  )

  try {
    const data = await getApiHealth(signal)

    setApiHealth({
      state: "ready",
      refreshing: false,
      data,
    })
  } catch (error) {
    if (error.name === "AbortError") {
      return
    }

    setApiHealth({
      state: "error",
      refreshing: false,
      message: error.message,
    })
  }
}

function StatusRow({ icon, label, hint, ready }) {
  const Icon = icon

  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 bg-background/85 px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-xl bg-muted p-2 text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm leading-6 text-muted-foreground">{hint}</p>
        </div>
      </div>
      <Badge variant={ready ? "default" : "outline"}>
        {ready ? "Ready" : "Pending"}
      </Badge>
    </div>
  )
}

function App() {
  const [apiHealth, setApiHealth] = useState({
    state: "idle",
    refreshing: false,
  })

  useEffect(() => {
    const controller = new AbortController()

    void refreshApiHealth(setApiHealth, controller.signal)

    return () => controller.abort()
  }, [])

  const apiReady = apiHealth.state === "ready"
  const backendSupabaseConfigured = Boolean(apiHealth.data?.supabase_configured)
  const apiStatusLabel = apiReady
    ? "Backend reachable"
    : apiHealth.state === "error"
      ? "Backend offline"
      : "Checking backend"

  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/90 p-8 shadow-[0_35px_120px_-55px_rgba(21,128,61,0.55)] backdrop-blur sm:p-10">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
            <div className="absolute -left-24 top-12 size-64 rounded-full bg-emerald-500/12 blur-3xl" />
            <div className="absolute right-0 top-0 size-56 rounded-full bg-amber-400/10 blur-3xl" />

            <div className="relative flex flex-wrap gap-2">
              <Badge variant="secondary">Agritech</Badge>
              <Badge variant="secondary">FastAPI</Badge>
              <Badge variant="secondary">React 19</Badge>
              <Badge variant="secondary">Supabase</Badge>
            </div>

            <div className="relative mt-6 max-w-3xl space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-700">
                <Leaf className="size-4" />
                Built for agricultural trade intelligence
              </div>

              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                TaniTrade AI
              </h1>

              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                A clean fullstack starter for sourcing, market analysis, pricing workflows,
                and future AI-driven trade operations.
              </p>
            </div>

            <div className="relative mt-8 flex flex-wrap gap-3">
              <a
                className={cn(buttonVariants({ size: "lg" }))}
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
              >
                Open API docs
                <ArrowUpRight className="size-4" />
              </a>
              <a
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
              >
                Open Supabase
                <ArrowUpRight className="size-4" />
              </a>
            </div>

            <div className="relative mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">Frontend</p>
                <p className="mt-2 text-xl font-semibold">React + shadcn</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">Backend</p>
                <p className="mt-2 text-xl font-semibold">{apiStatusLabel}</p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/80 p-4">
                <p className="text-sm text-muted-foreground">Database</p>
                <p className="mt-2 text-xl font-semibold">
                  {isSupabaseConfigured ? "Supabase env ready" : "Needs credentials"}
                </p>
              </div>
            </div>
          </div>

          <Card className="overflow-hidden border-border/70 bg-card/92 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.5)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-emerald-600" />
                Runtime Checklist
              </CardTitle>
              <CardDescription>
                Use this panel to confirm the local stack is fully wired.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusRow
                icon={Server}
                label="Backend API health"
                hint={
                  apiHealth.state === "error"
                    ? apiHealth.message
                    : "Checks http://localhost:8000/api/v1/health."
                }
                ready={apiReady}
              />
              <StatusRow
                icon={Database}
                label="Frontend Supabase keys"
                hint="Reads VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from frontend/.env."
                ready={isSupabaseConfigured}
              />
              <StatusRow
                icon={Bot}
                label="Backend Supabase service key"
                hint="Reads SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from backend/.env."
                ready={backendSupabaseConfigured}
              />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Copy the example env files, add your Supabase credentials, then start the
                FastAPI server to move everything to ready.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  void refreshApiHealth(setApiHealth)
                }}
              >
                <RefreshCcw
                  className={cn("size-4", apiHealth.refreshing && "animate-spin")}
                />
                Refresh status
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-border/70 bg-card/92">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="size-5 text-emerald-600" />
                Project Stack
              </CardTitle>
              <CardDescription>
                The scaffold is ready for auth, dashboards, market data, and AI workflows.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              {stackItems.map((item) => {
                const Icon = item.icon

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/70 bg-background/85 p-4"
                  >
                    <div className="mb-4 inline-flex rounded-xl bg-muted p-2 text-muted-foreground">
                      <Icon className="size-4" />
                    </div>
                    <h2 className="text-base font-semibold text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/92">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-600" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Commands for this Windows workspace after the initial install.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickstartCommands.map(({ label, command }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border/70 bg-slate-950 p-4 text-slate-50"
                >
                  <p className="mb-3 text-sm font-medium text-slate-300">{label}</p>
                  <pre className="overflow-x-auto text-sm leading-6">
                    <code>{command}</code>
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  )
}

export default App
