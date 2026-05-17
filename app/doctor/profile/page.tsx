"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const days = [
  { label: "Lun", active: true },
  { label: "Mar", active: true },
  { label: "Mié", active: true },
  { label: "Jue", active: true },
  { label: "Vie", active: true },
  { label: "Sáb", active: false },
  { label: "Dom", active: false },
]

export default function DoctorProfile() {
  const pathname = usePathname()
  const [available, setAvailable] = useState(true)
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  })

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <main className="max-w-5xl mx-auto px-4 pt-28">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 rounded-full bg-primary-fixed flex items-center justify-center mb-4 shadow-[0_12px_48px_rgba(0,100,124,0.12)]">
            <span className="text-3xl font-bold font-headline text-on-primary-fixed">
              DA
            </span>
          </div>
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">
            Dr. Aris Chen
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-semibold text-tertiary bg-tertiary-fixed/30 px-3 py-1 rounded-full">
              Cardiólogo
            </span>
            <span className="text-xs text-on-surface-variant">
              Miembro desde Mar 2023
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-lg">4.9 ⭐</span>
            <span className="text-sm text-on-surface-variant">128 consultas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section className="bg-white rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-5">
                Información Personal
              </h2>
              <div className="space-y-4">
                <div className="pb-3 border-b border-outline-variant">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Nombre Completo
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    Dr. Aris Chen
                  </p>
                </div>
                <div className="pb-3 border-b border-outline-variant">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    aris.chen@sanctuary.health
                  </p>
                </div>
                <div className="pb-3 border-b border-outline-variant">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Teléfono
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    +54 11 5555-9876
                  </p>
                </div>
                <div className="pb-3 border-b border-outline-variant">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Especialidad
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    Cardiología
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Número de Licencia
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    MN 123456
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-5">
                Ubicación
              </h2>
              <div className="space-y-4">
                <div className="pb-3 border-b border-outline-variant">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Dirección de Consultorio
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    Av. Santa Fe 1234, Piso 5
                  </p>
                </div>
                <div className="pb-3 border-b border-outline-variant">
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    Ciudad
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    CABA, Buenos Aires
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                    País
                  </p>
                  <p className="text-sm font-medium text-on-surface mt-1">
                    Argentina
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-white rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold font-headline text-on-surface">
                  Disponibilidad
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-on-surface-variant">
                    {available ? "Activo" : "Inactivo"}
                  </span>
                  <button
                    onClick={() => setAvailable(!available)}
                    className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                      available ? "bg-primary" : "bg-surface-container-high"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        available ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pb-4 border-b border-outline-variant mb-4">
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1">
                  Horario
                </p>
                <p className="text-sm font-semibold text-on-surface">
                  Lunes a Viernes, 09:00 - 17:00
                </p>
              </div>

              <div className="pb-4 border-b border-outline-variant mb-4">
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
                  Días laborales
                </p>
                <div className="flex gap-2 flex-wrap">
                  {days.map((day) => (
                    <span
                      key={day.label}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors ${
                        day.active
                          ? "bg-primary-fixed text-on-primary-fixed"
                          : "bg-surface-container-low text-on-surface-variant"
                      }`}
                    >
                      {day.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-1">
                  Consultas por hora
                </p>
                <p className="text-sm font-semibold text-on-surface">2</p>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-5">
                Preferencias
              </h2>

              <div className="pb-4 border-b border-outline-variant mb-4">
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-3">
                  Notificaciones
                </p>
                <div className="space-y-3">
                  {(["email", "sms", "push"] as const).map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-on-surface capitalize">
                        {type === "email"
                          ? "Email"
                          : type === "sms"
                            ? "SMS"
                            : "Push"}
                      </span>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [type]: !prev[type],
                          }))
                        }
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                          notifications[type]
                            ? "bg-primary"
                            : "bg-surface-container-high"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            notifications[type]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-4 border-b border-outline-variant mb-4">
                <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mb-2">
                  Duración de consulta predeterminada
                </p>
                <span className="inline-block text-xs font-semibold text-primary bg-primary-fixed/50 px-3 py-1.5 rounded-xl">
                  30 min
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-on-surface">
                  Recordatorios automáticos
                </span>
                <span className="relative w-11 h-6 rounded-full bg-primary transition-colors duration-200">
                  <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm translate-x-5" />
                </span>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
              <h2 className="text-lg font-bold font-headline text-on-surface mb-5">
                Estadísticas
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
                    847
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mt-1">
                    Pacientes atendidos
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
                    4.9
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mt-1">
                    Rating promedio
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold font-headline text-on-surface tracking-tight">
                    102
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-wider mt-1">
                    Consultas este mes
                  </p>
                </div>
              </div>
            </section>

            <button className="w-full py-3 rounded-2xl border border-error text-error text-sm font-semibold hover:bg-error-container transition-colors">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: false },
          {
            label: "Consultas",
            icon: "group",
            href: "/doctor/consultations",
            active: false,
          },
          {
            label: "Agenda",
            icon: "calendar_month",
            href: "/doctor",
            active: false,
          },
          {
            label: "Perfil",
            icon: "person",
            href: "/doctor/profile",
            active: true,
          },
        ]}
      />
    </div>
  )
}
