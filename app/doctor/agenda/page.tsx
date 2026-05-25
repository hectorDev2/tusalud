"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"

const dayLabels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
const weekDays = [17, 18, 19, 20, 21, 22]

interface Slot {
  id: string
  time: string
  type: "appointment" | "free" | "break"
  patient_name?: string
  initials?: string
  reason?: string
  duration?: string
  status?: string
}

const statusBadge: Record<string, string> = {
  en_curso: "bg-tertiary-fixed/30 text-tertiary",
  pendiente: "bg-surface-container-high text-on-surface-variant",
}

const statusColors: Record<string, string> = {
  en_curso: "border-l-tertiary",
  pendiente: "border-l-outline-variant",
}

function statusLabel(s: string): string {
  const map: Record<string, string> = { en_curso: "En curso", pendiente: "Pendiente" }
  return map[s] || s
}

export default function DoctorAgenda() {
  const pathname = usePathname()
  const [schedule, setSchedule] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/doctor/agenda")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setSchedule(json.data?.agenda || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const appointments = schedule.filter((s) => s.type === "appointment")
  const freeSlots = schedule.filter((s) => s.type === "free")

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">Agenda</h1>
          <p className="text-on-surface-variant text-sm mt-1">Tu schedule de consultas y disponibilidad.</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)] mb-4">
          <div className="flex items-center justify-between mb-4">
            <button className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm font-semibold text-on-surface">17 - 23 de Mayo, 2026</span>
            <button className="w-8 h-8 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
          <div className="flex gap-2 justify-between">
            {dayLabels.map((label, i) => {
              const isActive = i === 0
              return (
                <button key={label}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? "bg-primary text-on-primary shadow-md shadow-primary/20" : "text-on-surface-variant hover:bg-surface-container-low"
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
          <div className="bg-white rounded-2xl p-3 shadow-[0_12px_48px_rgba(25,28,30,0.06)] text-center">
            <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
              {loading ? "-" : appointments.length}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">Consultas Hoy</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-[0_12px_48px_rgba(25,28,30,0.06)] text-center">
            <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
              {loading ? "-" : freeSlots.length}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">Bloques Libres</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-[0_12px_48px_rgba(25,28,30,0.06)] text-center">
            <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">22 min</p>
            <p className="text-[10px] text-on-surface-variant mt-0.5 leading-tight">Tiempo Promedio</p>
          </div>
        </div>

        {loading ? (
          <ListSkeleton count={6} />
        ) : schedule.length > 0 ? (
          <div className="space-y-1">
            {schedule.map((slot) => (
              <div key={slot.id || slot.time} className="flex items-start gap-3">
                <div className="w-14 pt-3 shrink-0">
                  <span className="text-xs font-bold text-on-surface-variant">{slot.time}</span>
                </div>
                <div className="flex flex-col items-center w-5 pt-[5px]">
                  <div className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                  <div className="w-0.5 flex-1 min-h-[24px] bg-outline-variant" />
                </div>
                <div className="flex-1 pb-1">
                  {slot.type === "free" ? (
                    <div className="bg-surface-container-low rounded-xl px-4 py-2.5 border border-dashed border-outline-variant">
                      <span className="text-xs font-medium text-on-surface-variant">Bloque libre</span>
                    </div>
                  ) : slot.type === "break" ? (
                    <div className="bg-surface-container-high rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-on-surface-variant">restaurant</span>
                      <span className="text-xs font-semibold text-on-surface">Almuerzo</span>
                    </div>
                  ) : (
                    <div className={`bg-white rounded-xl p-3 shadow-[0_4px_16px_rgba(25,28,30,0.06)] border-l-4 ${statusColors[slot.status || ""] || "border-l-outline-variant"}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-on-surface-variant shrink-0">
                          {slot.initials || "??"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-on-surface truncate">{slot.patient_name || "Paciente"}</p>
                          <p className="text-xs text-on-surface-variant truncate">{slot.reason}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-on-surface-variant/70">{slot.duration}</span>
                            {slot.status && (
                              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusBadge[slot.status] || "bg-surface-container-high text-on-surface-variant"}`}>
                                {statusLabel(slot.status)}
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
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">calendar_month</span>
            <p className="mt-3 text-sm text-on-surface-variant">No hay agenda para hoy</p>
          </div>
        )}
      </main>

      <button className="fixed bottom-28 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl primary-gradient shadow-lg shadow-primary/30 text-on-primary text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all">
        <span className="material-symbols-outlined text-xl">add</span>
        Agregar bloque libre
      </button>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: pathname === "/doctor" },
          { label: "Consultas", icon: "group", href: "/doctor/consultations", active: false },
          { label: "Agenda", icon: "calendar_month", href: "/doctor/agenda", active: true },
          { label: "Perfil", icon: "person", href: "/doctor/profile", active: false },
        ]}
      />
    </div>
  )
}
