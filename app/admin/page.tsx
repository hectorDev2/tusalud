"use client"

import Link from "next/link"
import { Sidebar } from "@/components/sidebar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin", active: true },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin", active: true },
  { label: "Consultas", icon: "video_chat", href: "/admin/doctor-approvals" },
  { label: "Tokens", icon: "payments", href: "/admin/tokens" },
  { label: "Perfil", icon: "person", href: "/admin/profile" },
]

const queueItems = [
  { initials: "AT", name: "Dr. Aris Thorne", specialty: "Cardiology", bg: "bg-primary-fixed/30", text: "text-primary" },
  { initials: "EV", name: "Dr. Elena Vance", specialty: "Neurology", bg: "bg-tertiary-fixed/30", text: "text-tertiary" },
  { initials: "JM", name: "Dr. Julian Marsh", specialty: "Pediatrics", bg: "bg-secondary-container", text: "text-secondary" },
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar title="Panel de Administración" subtitle="Control de Sistemas de Salud" items={sidebarItems} />

      <header className="fixed top-0 z-50 left-0 md:left-80 right-0 bg-background/85 backdrop-blur-xl border-b border-surface-container">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">medical_services</span>
            <span className="text-xl font-bold text-primary font-headline tracking-tight">
              Sanctuary Health
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-background" />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high shadow-sm flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                person
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="md:pl-80 pt-16 px-6 pb-32 md:pb-8">
        <div className="pt-8 pb-8">
          <h1 className="text-3xl font-bold font-headline text-on-surface">Visión general del sistema</h1>
          <p className="text-on-surface-variant mt-1">
            Métricas en tiempo real y acciones pendientes en Sanctuary Health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person_play</span>
              </div>
              <span className="text-sm font-semibold text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-lg">
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface">12,842</p>
            <p className="text-sm text-on-surface-variant mt-1">Usuarios activos</p>
            <div className="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full w-3/4 rounded-full primary-gradient" />
            </div>
          </div>

          <div className="rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)] primary-gradient text-on-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined">video_chat</span>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +8.2%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline">3,105</p>
            <p className="text-sm text-white/80 mt-1">482 agendadas mañana</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-error-container">how_to_reg</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-error-container text-on-error-container px-2.5 py-1 rounded-lg">
                URGENTE
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface">24</p>
            <p className="text-sm text-on-surface-variant mt-1">Esperando verificación</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <h2 className="text-lg font-bold font-headline text-on-surface mb-4">Acciones rápidas</h2>
            <div className="space-y-3">
              <Link
                href="/admin/doctor-approvals"
                className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] group hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                      Aprobaciones de Doctores
                    </p>
                    <p className="text-sm text-on-surface-variant">12 verificaciones pendientes</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </Link>

              <Link
                href="/admin/user-management"
                className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] group hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-secondary">group</span>
                  </div>
                  <div>
                    <p className="font-semibold text-on-surface group-hover:text-primary transition-colors">
                      Gestión de Usuarios
                    </p>
                    <p className="text-sm text-on-surface-variant">Gestiona pacientes y personal</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </Link>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold font-headline text-on-surface">Cola de verificación</h2>
              <Link
                href="/admin/doctor-approvals"
                className="text-sm font-medium text-primary hover:underline"
              >
                Ver todo
              </Link>
            </div>
            <div className="bg-surface-container-lowest/70 glass-panel rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)] border border-surface-container-low">
              <div className="space-y-3">
                {queueItems.map((item) => (
                  <div
                    key={item.initials}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center font-headline font-bold text-sm ${item.text}`}
                      >
                        {item.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{item.name}</p>
                        <p className="text-xs text-on-surface-variant">{item.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors">
                        Aprobar
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors">
                        Cerrar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="md:hidden">
        <BottomNavBar items={bottomNavItems} />
      </div>
    </div>
  )
}
