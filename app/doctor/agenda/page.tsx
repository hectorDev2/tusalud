"use client"

import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const weekDays = [17, 18, 19, 20, 21, 22]

const stats = [
  { label: "Consultas Hoy", value: "7" },
  { label: "Tiempo Promedio", value: "22 min" },
  { label: "Slot Libre Próximo", value: "11:45 AM" },
]

interface Appointment {
  time: string
  type: "appointment" | "free" | "lunch"
  initials?: string
  name?: string
  reason?: string
  duration?: string
  status?: string
}

const schedule: Appointment[] = [
  { time: "09:00", type: "free" },
  {
    time: "09:30",
    type: "appointment",
    initials: "SM",
    name: "Sarah Mitchell",
    reason: "Opresión en el pecho",
    duration: "30 min",
    status: "En curso",
  },
  {
    time: "10:15",
    type: "appointment",
    initials: "MC",
    name: "Marcus Chen",
    reason: "Control de erupción",
    duration: "20 min",
    status: "Pendiente",
  },
  { time: "10:45", type: "free" },
  {
    time: "11:00",
    type: "appointment",
    initials: "ER",
    name: "Elena Rodriguez",
    reason: "Resultados chequeo",
    duration: "30 min",
    status: "Pendiente",
  },
  {
    time: "11:45",
    type: "appointment",
    initials: "JW",
    name: "James Wilson",
    reason: "Control de hipertensión",
    duration: "25 min",
    status: "Pendiente",
  },
  { time: "12:15", type: "lunch" },
  {
    time: "14:00",
    type: "appointment",
    initials: "LB",
    name: "Laura Bennett",
    reason: "Seguimiento",
    duration: "20 min",
    status: "Pendiente",
  },
  {
    time: "14:30",
    type: "appointment",
    initials: "RK",
    name: "Robert Kim",
    reason: "Revisión medicación",
    duration: "15 min",
    status: "Pendiente",
  },
  {
    time: "15:15",
    type: "appointment",
    initials: "AM",
    name: "Ana Martinez",
    reason: "Dolor lumbar",
    duration: "30 min",
    status: "Pendiente",
  },
  { time: "16:00", type: "free" },
]

const statusColors: Record<string, string> = {
  "En curso": "border-l-[#00685c]",
  Pendiente: "border-l-[#bdc8ce]",
  Completada: "border-l-[#d0e1fb]",
  Cancelada: "border-l-[#e6e8ea]",
}

const statusBadge: Record<string, string> = {
  "En curso": "bg-[#62fae3]/30 text-[#00685c]",
  Pendiente: "bg-[#e6e8ea] text-[#3e484d]",
}

export default function DoctorAgenda() {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            Agenda
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Tu schedule de consultas y disponibilidad.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)] mb-4">
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm font-semibold text-on-surface">
              17 - 23 de Mayo, 2026
            </span>
            <button className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          <div className="flex gap-2 justify-between">
            {dayLabels.map((label, i) => {
              const isActive = i === 0
              return (
                <button
                  key={label}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-on-primary shadow-md shadow-primary/20"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  <span>{label}</span>
                  <span className="text-sm mt-0.5">{weekDays[i]}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-3 shadow-[0_12px_48px_rgba(25,28,30,0.06)] text-center"
            >
              <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
                {s.value}
              </p>
              <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-1">
          {schedule.map((slot) => (
            <div key={slot.time} className="flex items-start gap-3">
              <div className="w-14 pt-3 shrink-0">
                <span className="text-xs font-bold text-on-surface-variant">
                  {slot.time}
                </span>
              </div>

              <div className="flex flex-col items-center w-5 pt-[5px]">
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                <div className="w-0.5 flex-1 min-h-[24px] bg-outline-variant" />
              </div>

              <div className="flex-1 pb-1">
                {slot.type === "free" ? (
                  <div className="bg-surface-container-low rounded-xl px-4 py-2.5 border border-dashed border-outline-variant">
                    <span className="text-xs font-medium text-on-surface-variant">
                      Bloque libre
                    </span>
                  </div>
                ) : slot.type === "lunch" ? (
                  <div className="bg-surface-container-high rounded-xl px-4 py-2.5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                      restaurant
                    </span>
                    <span className="text-xs font-semibold text-on-surface">
                      Almuerzo
                    </span>
                  </div>
                ) : (
                  <div
                    className={`bg-white rounded-xl p-3 shadow-[0_4px_16px_rgba(25,28,30,0.06)] border-l-4 ${
                      statusColors[slot.status ?? ""] ?? "border-l-[#bdc8ce]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant shrink-0">
                        {slot.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-on-surface truncate">
                          {slot.name}
                        </p>
                        <p className="text-xs text-on-surface-variant truncate">
                          {slot.reason}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-on-surface-variant/70">
                            {slot.duration}
                          </span>
                          {slot.status && statusBadge[slot.status] && (
                            <span
                              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusBadge[slot.status]}`}
                            >
                              {slot.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <button
        className="fixed bottom-28 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl primary-gradient shadow-lg shadow-primary/30 text-on-primary text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <span className="material-symbols-outlined text-xl">add</span>
        Agregar bloque libre
      </button>

      <BottomNavBar
        items={[
          {
            label: "Inicio",
            icon: "home",
            href: "/doctor",
            active: pathname === "/doctor",
          },
          {
            label: "Consultas",
            icon: "group",
            href: "/doctor/consultations",
            active: false,
          },
          {
            label: "Agenda",
            icon: "calendar_month",
            href: "/doctor/agenda",
            active: true,
          },
          {
            label: "Perfil",
            icon: "person",
            href: "/doctor",
            active: false,
          },
        ]}
      />
    </div>
  )
}
