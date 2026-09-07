"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"
import type { ApiResponse } from "@/lib/api-types"

interface Consultation {
  id: string
  patient: { id: string; name: string; avatar?: string | null } | null
  reason: string | null
  time?: string | null
  created_at?: string | null
  status: string
  assigned_doctor_id?: string | null
}

type StatusFilter = "todas" | "en_curso" | "pendiente" | "completadas"
type ConsultationsResponse = ApiResponse<{ consultations: Consultation[] }>

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  in_progress: { label: "En curso", color: "bg-tertiary-fixed/30 text-tertiary", bg: "bg-tertiary-fixed/20" },
  pending: { label: "Pendiente", color: "bg-surface-container-high text-on-surface-variant", bg: "bg-surface-container-high/50" },
  completed: { label: "Completada", color: "bg-secondary-container text-on-secondary-container", bg: "bg-secondary-container/50" },
}

function getInitials(name: string) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??"
}

function formatConsultationTime(consultation: Consultation) {
  if (consultation.time) return consultation.time
  if (!consultation.created_at) return "Sin fecha"

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(consultation.created_at))
}

export default function DoctorConsultations() {
  const router = useRouter()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("todas")

  useEffect(() => {
    let mounted = true

    async function loadConsultations() {
      setLoading(true)
      setError(null)

      try {
        const responses = await Promise.all(
          ["assigned", "pending"].map(async (filter) => {
            const response = await fetch(`/api/doctor/consultations?filter=${filter}`)
            const json = (await response.json()) as ConsultationsResponse

            if (!response.ok || !json.ok) {
              throw new Error(json.error || "No se pudieron cargar las consultas")
            }

            return json.data?.consultations ?? []
          }),
        )

        const combined = Array.from(
          new Map(responses.flat().map((consultation) => [consultation.id, consultation])).values(),
        )

        if (mounted) setConsultations(combined)
      } catch (loadError) {
        if (mounted) {
          setError(loadError instanceof Error ? loadError.message : "No se pudieron cargar las consultas")
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadConsultations()

    return () => {
      mounted = false
    }
  }, [reloadKey])

  async function claimConsultation(id: string) {
    setClaimingId(id)
    setError(null)

    try {
      const response = await fetch(`/api/doctor/consultations/${id}/claim`, { method: "POST" })
      const json = (await response.json()) as ApiResponse<{ consultationId: string }>

      if (!response.ok || !json.ok) {
        throw new Error(json.error || "No se pudo reclamar la consulta")
      }

      router.push(`/doctor/consultations/${json.data?.consultationId ?? id}`)
    } catch (claimError) {
      setClaimingId(null)
      setError(claimError instanceof Error ? claimError.message : "No se pudo reclamar la consulta")
    }
  }

  const filtered = consultations.filter((c) => {
    if (activeFilter === "todas") return true
    if (activeFilter === "en_curso") return c.status === "in_progress"
    if (activeFilter === "pendiente") return c.status === "pending"
    if (activeFilter === "completadas") return c.status === "completed"
    return true
  })

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">Consultas</h1>
          <p className="text-on-surface-variant text-sm mt-1">{consultations.length} consulta{consultations.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
          {[
            { key: "todas", label: "Todas" },
            { key: "en_curso", label: "En curso" },
            { key: "pendiente", label: "Pendientes" },
            { key: "completadas", label: "Completadas" },
          ].map((f) => (
            <button key={f.key} onClick={() => setActiveFilter(f.key as StatusFilter)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                activeFilter === f.key ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <ListSkeleton count={4} />
        ) : error ? (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-error">cloud_off</span>
            <p className="mt-3 text-sm text-on-surface-variant">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              Reintentar
            </button>
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((c) => {
              const cfg = statusConfig[c.status] || statusConfig.pending
              const cardContent = (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                      {getInitials(c.patient?.name || "")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{c.patient?.name || "Paciente"}</p>
                      <p className="text-xs text-on-surface-variant">{c.reason || "Sin motivo indicado"}</p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-0.5">{formatConsultationTime(c)}</p>
                    </div>
                  </div>
                  {c.status === "pending" ? (
                    <button
                      type="button"
                      onClick={() => claimConsultation(c.id)}
                      disabled={claimingId !== null}
                      className="shrink-0 rounded-xl bg-primary px-3 py-2 text-[11px] font-semibold text-on-primary transition-opacity disabled:cursor-wait disabled:opacity-60"
                    >
                      {claimingId === c.id ? "Reclamando..." : "Reclamar"}
                    </button>
                  ) : (
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${cfg.color}`}>{cfg.label}</span>
                  )}
                </>
              )

              if (c.status === "pending") {
                return (
                  <article key={c.id} className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_16px_rgba(25,28,30,0.04)] flex items-center justify-between group">
                    {cardContent}
                  </article>
                )
              }

              return (
                <Link key={c.id} href={`/doctor/consultations/${c.id}`} className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_4px_16px_rgba(25,28,30,0.04)] flex items-center justify-between group hover:shadow-md transition-shadow">
                  {cardContent}
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-container-low rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">group_off</span>
            <p className="mt-3 text-sm text-on-surface-variant">
              {activeFilter === "todas" ? "No tenés consultas asignadas" : `No hay consultas ${activeFilter.replace("_", " ")}`}
            </p>
          </div>
        )}
      </main>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: false },
          { label: "Consultas", icon: "group", href: "/doctor/consultations", active: true },
          { label: "Agenda", icon: "calendar_month", href: "/doctor/agenda", active: false },
          { label: "Perfil", icon: "person", href: "/doctor/profile", active: false },
        ]}
      />
    </div>
  )
}
