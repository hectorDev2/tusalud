"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { useSession } from "@/lib/use-session"

interface DoctorProfile {
  id: string
  name: string
  email: string
  specialty: string | null
  rating: number | null
  available: boolean
  role: string
}

interface Stats {
  total: number
  assigned: number
  in_progress: number
  closed: number
  completed: number
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="pb-3 border-b border-outline-variant last:border-b-0 last:pb-0">
      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-on-surface mt-1">{value || "—"}</p>
    </div>
  )
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
        {value}
      </p>
      <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mt-1">
        {label}
      </p>
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default function DoctorProfile() {
  const pathname = usePathname()
  const { logout } = useSession()
  const [profile, setProfile] = useState<DoctorProfile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch("/api/doctor/profile")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setProfile(json.data.profile)
          setStats(json.data.stats)
        }
      })
  }, [])

  const navItems = [
    { label: "Inicio", icon: "home", href: "/doctor", active: false },
    { label: "Consultas", icon: "group", href: "/doctor/consultations", active: false },
    { label: "Agenda", icon: "calendar_month", href: "/doctor", active: false },
    { label: "Perfil", icon: "person", href: "/doctor/profile", active: pathname === "/doctor/profile" },
  ]

  if (!profile) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <TopAppBar showProfile role="doctor" />
        <main className="max-w-5xl mx-auto px-4 pt-28">
          <p className="text-center text-on-surface-variant py-20">Cargando...</p>
        </main>
        <BottomNavBar items={navItems} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-5xl mx-auto px-4 pt-28">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center mb-4 shadow-[0_12px_48px_rgba(0,100,124,0.12)]">
            <span className="text-3xl font-bold font-headline text-on-primary-fixed">
              {getInitials(profile.name)}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            {profile.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            {profile.specialty && (
              <span className="text-xs font-semibold text-tertiary bg-tertiary-fixed/30 px-3 py-1 rounded-full">
                {profile.specialty}
              </span>
            )}
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                profile.available
                  ? "bg-primary-fixed/40 text-primary"
                  : "bg-surface-container-high text-on-surface-variant"
              }`}
            >
              {profile.available ? "Disponible" : "No disponible"}
            </span>
          </div>
          {profile.rating && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-lg">{profile.rating.toFixed(1)} ⭐</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Personal Info */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-5">
                Información Personal
              </h2>
              <div className="space-y-4">
                <Field label="Nombre Completo" value={profile.name} />
                <Field label="Email" value={profile.email} />
                <Field label="Especialidad" value={profile.specialty ?? "—"} />
              </div>
            </section>

            {/* Stats */}
            {stats && (
              <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                <h2 className="text-lg font-bold font-headline text-on-surface mb-5">
                  Estadísticas
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  <StatCard value={stats.total} label="Total consultas" />
                  <StatCard value={profile.rating?.toFixed(1) ?? "—"} label="Rating" />
                  <StatCard
                    value={stats.in_progress + stats.assigned}
                    label="En curso"
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: "Asignadas", value: stats.assigned, color: "bg-secondary-fixed/40 text-secondary" },
                    { label: "En progreso", value: stats.in_progress, color: "bg-tertiary-fixed/40 text-tertiary" },
                    { label: "Cerradas", value: stats.closed, color: "bg-primary-fixed/40 text-primary" },
                    { label: "Completadas", value: stats.completed, color: "bg-surface-container-high text-on-surface" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${item.color}`}
                    >
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-6">
            {/* Availability */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold font-headline text-on-surface">
                  Disponibilidad
                </h2>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                    profile.available
                      ? "bg-primary-fixed/40 text-primary"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      profile.available ? "bg-primary" : "bg-on-surface-variant"
                    }`}
                  />
                  {profile.available ? "Activo" : "Inactivo"}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant">
                Cambia tu disponibilidad desde el{" "}
                <a href="/doctor" className="text-primary font-medium underline">
                  panel principal
                </a>
                . El sistema te desconectará automáticamente si no hay actividad por 15 minutos.
              </p>
            </section>

            {/* Quick links */}
            <section className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-4">
                Accesos rápidos
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Ver mis consultas", href: "/doctor/consultations", icon: "group" },
                  { label: "Ver agenda", href: "/doctor/agenda", icon: "calendar_month" },
                ].map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-on-surface-variant text-xl">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium text-on-surface">
                      {item.label}
                    </span>
                    <span className="material-symbols-outlined text-on-surface-variant text-base ml-auto">
                      chevron_right
                    </span>
                  </a>
                ))}
              </div>
            </section>

            <button
              onClick={async () => {
                await logout()
                window.location.href = "/login"
              }}
              className="w-full py-3 rounded-2xl border border-error text-error text-sm font-semibold hover:bg-error-container transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </div>
  )
}
