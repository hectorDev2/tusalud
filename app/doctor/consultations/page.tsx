"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"

interface Consultation {
  id: string
  patient: { id: string; name: string }
  reason: string
  time: string
  status: string
  type: string
}

type StatusFilter = "todas" | "en_curso" | "pendiente" | "completadas"

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  in_progress: { label: "En curso", color: "bg-tertiary-fixed/30 text-tertiary", bg: "bg-tertiary-fixed/20" },
  pending: { label: "Pendiente", color: "bg-surface-container-high text-on-surface-variant", bg: "bg-surface-container-high/50" },
  completed: { label: "Completada", color: "bg-secondary-container text-on-secondary-container", bg: "bg-secondary-container/50" },
}

function getInitials(name: string) {
  return name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "??"
}

export default function DoctorConsultations() {
  const pathname = usePathname()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("todas")

  useEffect(() => {
    fetch("/api/doctor/consultations")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setConsultations(json.data?.consultations || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
          <p className="text-on-surface-variant text-sm mt-1">{consultations.length} consulta{consultations.length !== 1 ? "s" : ""} asignada{consultations.length !== 1 ? "s" : ""}</p>
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
        ) : filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((c) => {
              const cfg = statusConfig[c.status] || statusConfig.pending
              return (
                <Link key={c.id} href={`/doctor/consultations/${c.id}`}
                  className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(25,28,30,0.04)] flex items-center justify-between group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                      {getInitials(c.patient?.name || "")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{c.patient?.name || "Paciente"}</p>
                      <p className="text-xs text-on-surface-variant">{c.reason}</p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-0.5">{c.time}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-lg ${cfg.color}`}>{cfg.label}</span>
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
