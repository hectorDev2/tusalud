"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"

interface Consultation {
  id: string
  patient: {
    id: string
    name: string
  }
  reason: string
  time: string
  status: string
  type: string
}

const pendingRequests = [
  {
    id: "r1",
    title: "Recarga urgente de receta",
    badge: "Urgente",
    badgeClass: "bg-error-container text-error",
    buttons: [
      { label: "Aprobar", variant: "primary" as const },
      { label: "Revisar detalles", variant: "outline" as const },
    ],
  },
  {
    id: "r2",
    title: "Resultados de laboratorio listos",
    badge: "De rutina",
    badgeClass: "bg-surface-container-high text-on-surface-variant",
    buttons: [{ label: "Abrir laboratorio", variant: "primary" as const }],
  },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function DoctorDashboard() {
  const pathname = usePathname()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/doctor/consultations")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data?.consultations) {
          setConsultations(json.data.consultations)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const todayConsultations = consultations.filter(
    (c) => c.status === "in_progress" || c.status === "pending"
  )

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            Bienvenido, Dr. Aris
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {todayConsultations.length > 0
              ? `Tenés ${todayConsultations.length} consulta${todayConsultations.length > 1 ? "s" : ""} pendiente${todayConsultations.length > 1 ? "s" : ""}`
              : "¿Listo para tu turno matutino?"}
          </p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-sm font-semibold text-on-surface-variant">
            Disponibilidad
          </span>
          <div className="flex rounded-xl overflow-hidden border border-outline-variant">
            <button className="px-5 py-2 text-sm font-semibold bg-tertiary-container text-white transition-all">
              Disponible
            </button>
            <button className="px-5 py-2 text-sm font-medium text-on-surface-variant bg-white transition-all">
              Ausente
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary">
                event_available
              </span>
              <span className="text-xs font-semibold text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface tracking-tight">
              {loading ? "-" : todayConsultations.length}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Consultas hoy
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-tertiary">
                star
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="text-xs text-tertiary font-medium">En vivo</span>
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface tracking-tight">
              4.9
            </p>
            <p className="text-xs text-on-surface-variant mt-1">
              Calificación de pacientes
            </p>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-headline text-on-surface">
              Consultas asignadas
            </h2>
            <Link
              href="/doctor/consultations"
              className="text-sm font-medium text-primary hover:underline"
            >
              Ver todas
            </Link>
          </div>

          {loading ? (
            <ListSkeleton count={3} />
          ) : todayConsultations.length > 0 ? (
            <div className="space-y-3">
              {todayConsultations.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/doctor/consultations/${c.id}`}
                  className="bg-white rounded-2xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)] flex items-center justify-between group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                        {getInitials(c.patient?.name || "")}
                      </div>
                      {i === 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-tertiary border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {c.patient?.name || "Paciente"}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {c.reason}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-0.5">
                        {c.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {i === 0 && (
                      <span className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[18px]">
                          videocam
                        </span>
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-container-lowest rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                event_busy
              </span>
              <p className="mt-3 text-sm text-on-surface-variant">
                No tenés consultas asignadas hoy
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold font-headline text-on-surface mb-4">
            Solicitudes pendientes
          </h2>
          <div className="space-y-3">
            {pendingRequests.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-on-surface">
                    {r.title}
                  </p>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${r.badgeClass}`}
                  >
                    {r.badge}
                  </span>
                </div>
                <div className="flex gap-2">
                  {r.buttons.map((btn) => (
                    <button
                      key={btn.label}
                      className={
                        btn.variant === "primary"
                          ? "primary-gradient text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          : "text-xs font-semibold text-on-surface-variant px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-all"
                      }
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <button className="fixed bottom-28 right-6 z-50 w-14 h-14 rounded-full primary-gradient shadow-lg shadow-primary/30 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: pathname === "/doctor" },
          { label: "Consultas", icon: "group", href: "/doctor/consultations", active: false },
          { label: "Agenda", icon: "calendar_month", href: "/doctor/agenda", active: false },
          { label: "Perfil", icon: "person", href: "/doctor/profile", active: false },
        ]}
      />
    </div>
  )
}
