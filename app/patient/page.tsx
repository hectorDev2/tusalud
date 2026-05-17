"use client"

import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { consultations } from "@/lib/mock-data"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
}

const avatarColors = [
  "bg-primary-fixed text-primary",
  "bg-tertiary-fixed text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-error-container text-error",
]

export default function PatientDashboard() {
  const pathname = usePathname()

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
        {/* Token Balance Hero */}
        <section className="primary-gradient rounded-3xl p-6 text-white shadow-[0_12px_48px_rgba(0,100,124,0.2)]">
          <p className="font-body text-sm text-white/80">Créditos disponibles</p>
          <h2 className="font-headline text-4xl font-bold tracking-tight mt-1">3 Tokens</h2>
          <button className="mt-4 bg-white/20 backdrop-blur-md text-white font-semibold font-label text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 active:scale-[0.97] transition-all">
            Nueva consulta
          </button>
        </section>

        {/* Health Alerts */}
        <section>
          <h3 className="font-headline text-lg font-semibold text-on-surface mb-3">Alertas de salud</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-tertiary-fixed rounded-2xl p-4 flex flex-col items-start gap-2">
              <span className="material-symbols-outlined text-tertiary text-2xl">check_circle</span>
              <div>
                <p className="font-label text-sm font-semibold text-tertiary">Todo bien</p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Resultados de sangre normales</p>
              </div>
            </div>
            <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-start gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">vaccines</span>
              <div>
                <p className="font-label text-sm font-semibold text-on-surface">Vacunación</p>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Vacuna antigripal la semana que viene</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Consultations */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-headline text-lg font-semibold text-on-surface">Consultas recientes</h3>
            <button className="font-label text-xs font-semibold text-primary">Ver todo</button>
          </div>
          {consultations.length > 0 ? (
            <div className="space-y-2">
              {consultations.map((c, i) => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(25,28,30,0.04)]"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-label font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}
                  >
                    {getInitials(c.doctor?.name ?? "")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label text-sm font-semibold text-on-surface truncate">
                      {c.doctor?.name}
                    </p>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">
                      {c.doctor?.specialty}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-body text-[11px] text-on-surface-variant">{c.date}</span>
                      <span className="bg-secondary-container text-on-secondary-container font-label text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {c.status}
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
                    chevron_right
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-2xl p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">search</span>
              <p className="font-body text-sm text-on-surface-variant mt-2">
                ¿Buscás un especialista? Explorá el directorio
              </p>
            </div>
          )}
        </section>
      </main>
      <BottomNavBar items={navItems} />
    </div>
  )
}
