"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { NewConsultationModal } from "@/components/new-consultation-modal"
import { ListSkeleton } from "@/components/skeleton"
import { consultationStatusConfig, formatConsultationDate, formatConsultationTime } from "@/lib/consultation-status"

interface Consultation {
  id: string
  doctor: { name: string; specialty: string } | null
  type: string
  status: string
  created_at: string
}

const avatarColors = [
  "bg-primary-fixed text-primary",
  "bg-tertiary-fixed text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-error-container text-error",
]

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2)
}

export default function PatientDashboard() {
  const pathname = usePathname()
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [tokenBalance, setTokenBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch("/api/patient/consultations").then((r) => r.json()),
      fetch("/api/patient/tokens").then((r) => r.json()),
    ])
      .then(([consJson, tokJson]) => {
        if (!consJson.ok || !tokJson.ok) {
          throw new Error(consJson.error || tokJson.error || "No se pudo cargar el resumen")
        }
        setConsultations(consJson.data?.consultations || [])
        setTokenBalance(tokJson.data?.balance || 0)
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "No se pudo cargar el resumen")
      })
      .finally(() => setLoading(false))
  }, [retryCount])

  function retryLoading() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: pathname.startsWith("/patient/consultations") },
    { label: "Historial", icon: "health_and_safety", href: "/patient/history", active: pathname === "/patient/history" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens", active: pathname === "/patient/tokens" },
  ]

  const recentConsults = consultations.slice(0, 3)

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        {/* Token Balance Hero */}
        <section className="primary-gradient rounded-3xl p-6 text-white shadow-[0_12px_48px_rgba(0,100,124,0.2)]">
          <p className="font-body text-sm text-white/80">Créditos disponibles</p>
          <h2 className="font-headline text-4xl font-bold tracking-tight mt-1">
            {loading ? "..." : `${tokenBalance} Tokens`}
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-surface-container-lowest/20 backdrop-blur-md text-white font-semibold font-label text-sm px-5 py-2.5 rounded-xl hover:bg-surface-container-lowest/30 active:scale-[0.97] transition-all"
          >
            Nueva consulta
          </button>
        </section>

        {/* Health Alerts */}
        <section>
          <h3 className="font-headline text-lg font-semibold text-on-surface mb-3">Alertas de salud</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-tertiary-fixed rounded-2xl p-4 flex flex-col items-start gap-2">
              <span className="material-symbols-outlined text-tertiary text-2xl">check_circle</span>
              <div>
                <p className="font-label text-sm font-semibold text-tertiary">Todo bien</p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Resultados de sangre normales</p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-start gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">vaccines</span>
              <div>
                <p className="font-label text-sm font-semibold text-on-surface">Vacunación</p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Vacuna antigripal la semana que viene</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Consultations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-lg font-semibold text-on-surface">Consultas recientes</h3>
            <button onClick={() => router.push("/patient/consultations")} className="font-label text-xs font-semibold text-primary">Ver todo</button>
          </div>
          {error ? (
            <div className="rounded-2xl border border-error/30 bg-error-container p-6 text-center">
              <span className="material-symbols-outlined text-3xl text-error">cloud_off</span>
              <p className="mt-2 text-sm text-on-error-container">{error}</p>
              <button type="button" onClick={retryLoading} className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error">
                Reintentar
              </button>
            </div>
          ) : loading ? (
            <ListSkeleton count={2} />
          ) : recentConsults.length > 0 ? (
            <div className="space-y-2">
              {recentConsults.map((c, i) => {
                const cfg = consultationStatusConfig(c.status)
                return (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/patient/consultations/${c.id}`)}
                    className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(25,28,30,0.04)] cursor-pointer hover:bg-surface-container-low transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-label font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                      {c.doctor ? getInitials(c.doctor.name) : (
                        <span className="material-symbols-outlined text-lg">hourglass_top</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label text-sm font-semibold text-on-surface truncate">
                        {c.doctor?.name || "Buscando médico disponible…"}
                      </p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">
                        {c.doctor?.specialty || c.type}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-body text-[11px] text-on-surface-variant">
                          {formatConsultationDate(c.created_at)} {formatConsultationTime(c.created_at)}
                        </span>
                        <span className={`font-label text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.className}`}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
                      chevron_right
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-2xl p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">search</span>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                Todavía no tenés consultas. Tocá &quot;Nueva consulta&quot; para empezar.
              </p>
            </div>
          )}
        </section>
      </main>
      <BottomNavBar items={navItems} />

      <NewConsultationModal open={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
}
