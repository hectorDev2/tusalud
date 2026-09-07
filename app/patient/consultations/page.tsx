"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"
import { NewConsultationModal } from "@/components/new-consultation-modal"
import { consultationStatusConfig, formatConsultationDate, formatConsultationTime, isConsultationOpen } from "@/lib/consultation-status"

interface ConsultationItem {
  id: string
  doctor: { name: string; specialty: string } | null
  doctorName: string
  specialty: string
  type: string
  created_at: string
  status: string
}

const filters = ["Todas", "Activas", "Completadas"] as const

const avatarColors = [
  "bg-primary-fixed text-primary",
  "bg-tertiary-fixed text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-error-container text-error",
]

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2)
}

export default function PatientConsultations() {
  const pathname = usePathname()
  const [consultations, setConsultations] = useState<ConsultationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [activeFilter, setActiveFilter] = useState<string>("Todas")
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch("/api/patient/consultations")
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || !json.ok) {
          throw new Error(json.error || "No se pudieron cargar tus consultas")
        }
        return json
      })
      .then((json) => {
        if (!cancelled && json.data?.consultations) {
          setConsultations(json.data.consultations.map((c: Record<string, unknown>) => ({
            id: c.id as string,
            doctor: (c.doctor as { name: string; specialty: string } | null) || null,
            doctorName: (c.doctor as { name: string } | null)?.name || "Buscando médico disponible…",
            specialty: (c.doctor as { specialty: string } | null)?.specialty || c.type as string,
            type: c.type as string,
            created_at: c.created_at as string,
            status: c.status as string,
          })))
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) {
          setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar tus consultas")
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [retryCount])

  function retryLoading() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  const filtered = consultations.filter((c) => {
    if (activeFilter === "Todas") return true
    if (activeFilter === "Activas") return isConsultationOpen(c.status)
    if (activeFilter === "Completadas") return c.status === "closed" || c.status === "completed"
    return true
  })

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: pathname.startsWith("/patient/consultations") },
    { label: "Mensajes", icon: "chat", href: "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens" },
  ]

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-headline text-2xl font-bold text-on-surface">Mis consultas</h1>
            <p className="font-body text-sm text-on-surface-variant mt-1">{consultations.length} consulta{consultations.length !== 1 ? "s" : ""} registrada{consultations.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 flex items-center gap-1.5 primary-gradient text-white font-label text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nueva
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === f ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <ListSkeleton count={4} />
        ) : error ? (
          <div className="rounded-2xl border border-error/30 bg-error-container p-6 text-center">
            <span className="material-symbols-outlined text-3xl text-error">cloud_off</span>
            <p className="mt-2 text-sm text-on-error-container">{error}</p>
            <button
              type="button"
              onClick={retryLoading}
              className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error"
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((c, i) => {
              const cfg = consultationStatusConfig(c.status)
              return (
                <Link key={c.id} href={`/patient/consultations/${c.id}`}
                  className="bg-surface-container-lowest rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(25,28,30,0.04)] hover:bg-surface-container-low transition-colors block"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-label font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                    {c.doctor ? getInitials(c.doctorName) : (
                      <span className="material-symbols-outlined text-lg">hourglass_top</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label text-sm font-semibold text-on-surface truncate">{c.doctorName}</p>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">{c.specialty}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-[11px] text-on-surface-variant">
                        {formatConsultationDate(c.created_at)} {formatConsultationTime(c.created_at)}
                      </span>
                      <span className={`font-label text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${cfg.className}`}>{cfg.label}</span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">chevron_right</span>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-surface-container-low rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">search</span>
            <p className="font-body text-sm text-on-surface-variant mt-2">
              {activeFilter === "Todas" ? "Todavía no tenés consultas. Tocá \"Nueva\" para empezar." : `No hay consultas ${activeFilter.toLowerCase()}`}
            </p>
          </div>
        )}
      </main>
      <BottomNavBar items={navItems} />

      <NewConsultationModal
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}
