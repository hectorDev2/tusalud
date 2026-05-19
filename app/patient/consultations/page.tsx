"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

interface ConsultationItem {
  id: string
  doctorName: string
  specialty: string
  date: string
  time: string
  status: "completed" | "in-progress" | "cancelled"
}

const mockConsultations: ConsultationItem[] = [
  { id: "c1", doctorName: "Dr. Sarah Miller", specialty: "Médica General", date: "Hoy", time: "10:30 AM", status: "completed" },
  { id: "c2", doctorName: "Dr. James Chen", specialty: "Dermatología", date: "Ayer", time: "2:15 PM", status: "in-progress" },
  { id: "c3", doctorName: "Dr. Elena Vance", specialty: "Neurología", date: "15 Oct", time: "9:00 AM", status: "completed" },
  { id: "c4", doctorName: "Dr. Marcus Thorne", specialty: "Cardiología", date: "10 Oct", time: "11:30 AM", status: "cancelled" },
  { id: "c5", doctorName: "Dr. Sarah Miller", specialty: "Médica General", date: "5 Oct", time: "4:00 PM", status: "completed" },
  { id: "c6", doctorName: "Dr. Robert Kim", specialty: "Pediatría", date: "28 Sep", time: "8:45 AM", status: "completed" },
]

const filters = ["Todas", "Activas", "Completadas", "Canceladas"] as const

const statusConfig = {
  completed: { label: "Completada", className: "bg-secondary-container text-on-secondary-container" },
  "in-progress": { label: "En curso", className: "bg-tertiary-container text-white" },
  cancelled: { label: "Cancelada", className: "bg-surface-container-high text-on-surface-variant" },
} as const

const avatarColors = [
  "bg-primary-fixed text-primary",
  "bg-tertiary-fixed text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-error-container text-error",
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
}

export default function PatientConsultations() {
  const pathname = usePathname()
  const [activeFilter, setActiveFilter] = useState<string>("Todas")

  const filtered = mockConsultations.filter((c) => {
    if (activeFilter === "Todas") return true
    if (activeFilter === "Activas") return c.status === "in-progress"
    if (activeFilter === "Completadas") return c.status === "completed"
    if (activeFilter === "Canceladas") return c.status === "cancelled"
    return true
  })

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: pathname.startsWith("/patient/consultations") },
    { label: "Mensajes", icon: "chat", href: "/patient/messages", active: pathname === "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens", active: pathname === "/patient/tokens" },
  ]

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        <section>
          <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Mis Consultas</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Historial de todas tus consultas médicas.</p>
        </section>

        <section className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-label text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all active:scale-[0.97] ${
                activeFilter === f
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              {f}
            </button>
          ))}
        </section>

        <section>
          {filtered.length > 0 ? (
            <div className="space-y-3">
              {filtered.map((c, i) => {
                const status = statusConfig[c.status]
                return (
                  <Link
                    key={c.id}
                    href={`/patient/consultations/${c.id}`}
                    className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(25,28,30,0.04)] hover:shadow-[0_12px_48px_rgba(25,28,30,0.06)] transition-shadow active:scale-[0.99] block"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-label font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}
                    >
                      {getInitials(c.doctorName)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label text-sm font-semibold text-on-surface">{c.doctorName}</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">{c.specialty}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="font-body text-[11px] text-on-surface-variant">{c.date}</span>
                        <span className="size-1 rounded-full bg-outline-variant" />
                        <span className="font-body text-[11px] text-on-surface-variant">{c.time}</span>
                        <span className={`font-label text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
                      chevron_right
                    </span>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-2xl p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant">calendar_month</span>
              <p className="font-headline text-lg font-semibold text-on-surface mt-3">Todavía no tienes consultas</p>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                Programá tu primera consulta con un especialista.
              </p>
              <Link
                href="/patient/new"
                className="inline-flex items-center gap-2 mt-4 primary-gradient text-on-primary font-label text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Nueva consulta
              </Link>
            </div>
          )}
        </section>
      </main>
      <BottomNavBar items={navItems} />
    </div>
  )
}
