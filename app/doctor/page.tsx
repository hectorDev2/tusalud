"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"
import { useSession } from "@/lib/use-session"
import { useToast } from "@/components/toast"

interface Consultation {
  id: string
  patient: { id: string; name: string } | null
  reason: string | null
  status: string
}

const HEARTBEAT_INTERVAL_MS = 60_000 // 1 min

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
  const { user } = useSession()
  const { toast } = useToast()

  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loadingConsultations, setLoadingConsultations] = useState(true)
  const [available, setAvailable] = useState(false)
  const [togglingAvailability, setTogglingAvailability] = useState(false)
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load initial availability state
  useEffect(() => {
    fetch("/api/doctor/availability")
      .then((r) => r.json())
      .then((json) => { if (json.ok) setAvailable(json.data.available) })
      .catch(() => {})
  }, [])

  // Load consultations
  useEffect(() => {
    fetch("/api/doctor/consultations")
      .then((r) => r.json())
      .then((json) => { if (json.ok) setConsultations(json.data.consultations ?? []) })
      .catch(() => {})
      .finally(() => setLoadingConsultations(false))
  }, [])

  // Heartbeat: while available, ping every minute to reset the 15-min auto-off clock
  const sendHeartbeat = useCallback(() => {
    fetch("/api/doctor/availability", { method: "POST" }).catch(() => {})
  }, [])

  useEffect(() => {
    if (available) {
      sendHeartbeat() // immediate beat on toggle-on
      heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
    } else {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
    }
    return () => { if (heartbeatRef.current) clearInterval(heartbeatRef.current) }
  }, [available, sendHeartbeat])

  // Also send heartbeat on user interaction (click anywhere on the page)
  useEffect(() => {
    if (!available) return
    const handler = () => sendHeartbeat()
    document.addEventListener("click", handler, { passive: true })
    return () => document.removeEventListener("click", handler)
  }, [available, sendHeartbeat])

  async function toggleAvailability(next: boolean) {
    if (togglingAvailability) return
    setTogglingAvailability(true)
    try {
      const res = await fetch("/api/doctor/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: next }),
      })
      const json = await res.json()
      if (json.ok) {
        setAvailable(next)
        toast(next ? "Estás disponible para recibir consultas" : "Marcado como no disponible", "success")
      } else {
        toast(json.error || "No se pudo cambiar disponibilidad", "error")
      }
    } finally {
      setTogglingAvailability(false)
    }
  }

  const activeConsultations = consultations.filter(
    (c) => c.status === "in_progress" || c.status === "assigned" || c.status === "pending"
  )

  const doctorName = user?.name?.split(" ")[0] ?? "Doctor"

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            Bienvenido, Dr. {doctorName}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {activeConsultations.length > 0
              ? `Tenés ${activeConsultations.length} consulta${activeConsultations.length > 1 ? "s" : ""} activa${activeConsultations.length > 1 ? "s" : ""}`
              : "Sin consultas activas por ahora"}
          </p>
        </div>

        {/* Availability toggle */}
        <div className="flex items-center gap-3 mb-8 bg-surface-container-lowest rounded-2xl px-5 py-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface">Disponibilidad</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {available
                ? "Los pacientes pueden asignarse a vos"
                : "No recibirás consultas nuevas"}
            </p>
          </div>

          <div className="flex rounded-xl overflow-hidden border border-outline-variant/30">
            <button
              onClick={() => !available && toggleAvailability(true)}
              disabled={togglingAvailability}
              className={`px-5 py-2.5 text-sm font-semibold transition-all ${
                available
                  ? "bg-tertiary text-white"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              } disabled:opacity-60`}
            >
              {available && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Disponible
                </span>
              )}
              {!available && "Disponible"}
            </button>
            <button
              onClick={() => available && toggleAvailability(false)}
              disabled={togglingAvailability}
              className={`px-5 py-2.5 text-sm font-semibold transition-all ${
                !available
                  ? "bg-surface-container-high text-on-surface"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              } disabled:opacity-60`}
            >
              Ausente
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-primary">event_available</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${available ? "text-tertiary bg-tertiary-fixed/30" : "text-on-surface-variant bg-surface-container-high"}`}>
                {available ? "En vivo" : "Pausado"}
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface tracking-tight">
              {loadingConsultations ? "-" : activeConsultations.length}
            </p>
            <p className="text-xs text-on-surface-variant mt-1">Consultas activas</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <span className="material-symbols-outlined text-tertiary">star</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                <span className="text-xs text-tertiary font-medium">Rating</span>
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface tracking-tight">4.9</p>
            <p className="text-xs text-on-surface-variant mt-1">Calificación promedio</p>
          </div>
        </div>

        {/* Consultations list */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-headline text-on-surface">Consultas activas</h2>
            <Link href="/doctor/consultations" className="text-sm font-medium text-primary hover:underline">
              Ver todas
            </Link>
          </div>

          {loadingConsultations ? (
            <ListSkeleton count={3} />
          ) : activeConsultations.length > 0 ? (
            <div className="space-y-3">
              {activeConsultations.map((c, i) => (
                <Link
                  key={c.id}
                  href={`/doctor/consultations/${c.id}`}
                  className="bg-surface-container-lowest rounded-2xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)] flex items-center justify-between group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                        {getInitials(c.patient?.name || "??")}
                      </div>
                      {i === 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-tertiary border-2 border-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                        {c.patient?.name || "Paciente"}
                      </p>
                      <p className="text-xs text-on-surface-variant line-clamp-1">{c.reason}</p>
                      <span className={`text-[10px] font-semibold mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                        c.status === "assigned"
                          ? "bg-primary-fixed/20 text-primary"
                          : c.status === "in_progress"
                          ? "bg-tertiary-fixed/20 text-tertiary"
                          : "bg-surface-container-high text-on-surface-variant"
                      }`}>
                        {c.status === "assigned" ? "Asignada" : c.status === "in_progress" ? "En curso" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                    chevron_right
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-surface-container-lowest rounded-2xl">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">event_busy</span>
              <p className="mt-3 text-sm text-on-surface-variant">
                {available ? "Esperando consultas..." : "Marcate como disponible para recibir consultas"}
              </p>
            </div>
          )}
        </section>
      </main>

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
