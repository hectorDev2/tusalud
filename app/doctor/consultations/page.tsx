"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const avatarColors = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-violet-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-orange-500",
]

type Status = "en_curso" | "en_espera" | "pendiente"

interface Consultation {
  id: string
  name: string
  initials: string
  reason: string
  time: string
  period: string
  duration: number
  status: Status
}

const consultations: Consultation[] = [
  {
    id: "c1",
    name: "Sarah Mitchell",
    initials: "SM",
    reason: "Opresión en el pecho",
    time: "09:30",
    period: "AM",
    duration: 30,
    status: "en_curso",
  },
  {
    id: "c2",
    name: "Marcus Chen",
    initials: "MC",
    reason: "Control de erupción cutánea",
    time: "10:15",
    period: "AM",
    duration: 20,
    status: "en_espera",
  },
  {
    id: "c3",
    name: "Elena Rodriguez",
    initials: "ER",
    reason: "Resultados de chequeo anual",
    time: "11:00",
    period: "AM",
    duration: 30,
    status: "en_espera",
  },
  {
    id: "c4",
    name: "James Wilson",
    initials: "JW",
    reason: "Control de hipertensión",
    time: "11:45",
    period: "AM",
    duration: 25,
    status: "pendiente",
  },
  {
    id: "c5",
    name: "Laura Bennett",
    initials: "LB",
    reason: "Consulta de seguimiento",
    time: "14:00",
    period: "PM",
    duration: 20,
    status: "pendiente",
  },
  {
    id: "c6",
    name: "Robert Kim",
    initials: "RK",
    reason: "Revisión de medicación",
    time: "14:30",
    period: "PM",
    duration: 15,
    status: "pendiente",
  },
  {
    id: "c7",
    name: "Ana Martinez",
    initials: "AM",
    reason: "Dolor lumbar crónico",
    time: "15:15",
    period: "PM",
    duration: 30,
    status: "pendiente",
  },
]

const statusConfig: Record<
  Status,
  {
    label: string
    dotColor: string
    borderColor: string
    pulse: boolean
    action: { label: string; variant: "primary-gradient" | "primary" } | null
  }
> = {
  en_curso: {
    label: "En curso",
    dotColor: "bg-tertiary",
    borderColor: "border-l-tertiary",
    pulse: true,
    action: { label: "Continuar", variant: "primary" },
  },
  en_espera: {
    label: "En espera",
    dotColor: "bg-outline-variant",
    borderColor: "border-l-outline-variant",
    pulse: false,
    action: null,
  },
  pendiente: {
    label: "Pendiente",
    dotColor: "bg-surface-container-high",
    borderColor: "border-l-surface-container-high",
    pulse: false,
    action: { label: "Iniciar", variant: "primary-gradient" },
  },
}

const filters = [
  { key: "todas", label: "Todas" },
  { key: "en_espera", label: "En espera" },
  { key: "en_curso", label: "En curso" },
  { key: "completadas", label: "Completadas" },
]

export default function ConsultationsPage() {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-1">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            Consultas
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Todas las consultas de pacientes asignadas.
          </p>
        </div>

        <div className="flex items-center justify-between mt-6 mb-5">
          <span className="text-sm font-semibold text-on-surface">
            Hoy, 17 de Mayo
          </span>
          <div className="flex gap-1">
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                chevron_left
              </span>
            </button>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f.key}
              className={
                f.key === "todas"
                  ? "primary-gradient text-on-primary text-sm font-semibold px-4 py-2 rounded-xl shadow-lg shadow-primary/10 transition-all"
                  : "text-sm font-semibold text-on-surface-variant px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-all"
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {consultations.map((c, i) => {
            const status = statusConfig[c.status]

            return (
              <Link
                key={c.id}
                href={`/doctor/consultations/${c.id}`}
                className={`block bg-white rounded-2xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)] border-l-4 ${status.borderColor} hover:scale-[1.02] active:scale-[0.98] transition-all`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-sm font-bold text-white shrink-0`}
                  >
                    {c.initials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {c.name}
                      </p>
                      <span className="flex items-center gap-1 shrink-0">
                        {status.pulse && (
                          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                        )}
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            c.status === "en_curso"
                              ? "bg-tertiary-fixed/30 text-tertiary"
                              : c.status === "en_espera"
                                ? "bg-surface-container-high text-on-surface-variant"
                                : "bg-surface-container-high text-on-surface-variant"
                          }`}
                        >
                          {status.label}
                        </span>
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant mt-0.5 leading-tight">
                      {c.reason}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[11px] text-on-surface-variant/70 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          schedule
                        </span>
                        {c.time} {c.period}
                      </span>
                      <span className="text-[11px] text-on-surface-variant/70 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          timer
                        </span>
                        {c.duration} min
                      </span>
                    </div>

                    <div className="mt-3">
                      {status.action && (
                        <span
                          className={
                            status.action.variant === "primary-gradient"
                              ? "inline-block primary-gradient text-on-primary text-xs font-semibold px-4 py-1.5 rounded-xl shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
                              : "inline-block bg-primary text-on-primary text-xs font-semibold px-4 py-1.5 rounded-xl hover:brightness-110 active:brightness-90 transition-all"
                          }
                        >
                          {status.action.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </main>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: pathname === "/doctor" },
          {
            label: "Consultas",
            icon: "group",
            href: "/doctor/consultations",
            active: pathname.startsWith("/doctor/consultations"),
          },
          { label: "Agenda", icon: "calendar_month", href: "/doctor", active: false },
          { label: "Perfil", icon: "person", href: "/doctor", active: false },
        ]}
      />
    </div>
  )
}
