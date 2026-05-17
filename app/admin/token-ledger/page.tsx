"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger", active: true },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Consultas", icon: "video_chat", href: "/admin/doctor-approvals" },
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger", active: true },
  { label: "Perfil", icon: "person", href: "/admin" },
]

const filters = ["Esta Semana", "Este Mes", "Este Año"]

const transactions = [
  { initials: "SM", name: "Sarah Mitchell", desc: "Reinicio Semanal", amount: 3, date: "Hoy", status: "Completado" },
  { initials: "MC", name: "Marcus Chen", desc: "Consulta", amount: -1, date: "Ayer", status: "Completado" },
  { initials: "ER", name: "Elena Rodriguez", desc: "Recarga de Receta", amount: -2, date: "Ayer", status: "Completado" },
  { initials: "AD", name: "Admin", desc: "Reinicio Semanal (Sist.)", amount: 3, date: "3 días", status: "Completado" },
  { initials: "LB", name: "Laura Bennett", desc: "Consulta Urgente", amount: -2, date: "5 días", status: "Completado" },
  { initials: "JW", name: "James Wilson", desc: "Reinicio Semanal", amount: 3, date: "1 semana", status: "Completado" },
  { initials: "RK", name: "Robert Kim", desc: "Consulta", amount: -1, date: "1 semana", status: "Pendiente" },
]

const avatarColors: Record<string, string> = {
  SM: "bg-primary-fixed/30 text-primary",
  MC: "bg-secondary-container text-secondary",
  ER: "bg-tertiary-fixed/30 text-tertiary",
  AD: "bg-surface-container-high text-on-surface-variant",
  LB: "bg-primary-fixed/30 text-primary",
  JW: "bg-secondary-container text-secondary",
  RK: "bg-error-container text-on-error-container",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
}

export default function TokenLedger() {
  const [activeFilter, setActiveFilter] = useState("Esta Semana")
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

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
          <h1 className="text-3xl font-bold font-headline text-on-surface">Libro de Tokens</h1>
          <p className="text-on-surface-variant mt-1">
            Monitoreá el flujo de tokens de todos los usuarios del sistema.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)] primary-gradient text-on-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined">token</span>
              </div>
              <span className="flex items-center gap-1 text-sm font-semibold bg-white/20 px-2.5 py-1 rounded-lg">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +4.7%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline">24,580</p>
            <p className="text-sm text-white/80 mt-1">Tokens en Circulación</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-error-container">trending_down</span>
              </div>
              <span className="text-sm font-semibold text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-lg">
                +12.3%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface">8,420</p>
            <p className="text-sm text-on-surface-variant mt-1">Usados esta Semana</p>
            <div className="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full w-[34%] rounded-full bg-error" />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary">add_circle</span>
              </div>
              <span className="text-sm font-semibold text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-lg">
                +8.1%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface">9,600</p>
            <p className="text-sm text-on-surface-variant mt-1">Nuevos esta Semana</p>
            <div className="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full w-[39%] rounded-full bg-tertiary" />
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">speed</span>
              </div>
              <span className="text-sm font-semibold text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-lg">
                +2.1%
              </span>
            </div>
            <p className="text-3xl font-bold font-headline text-on-surface">87.2%</p>
            <p className="text-sm text-on-surface-variant mt-1">Tasa de Uso</p>
            <div className="mt-4 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full w-[87%] rounded-full primary-gradient" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                activeFilter === f
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3 md:hidden">
          {transactions.map((tx) => (
            <div
              key={`${tx.initials}-${tx.desc}`}
              className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${avatarColors[tx.initials]} flex items-center justify-center font-headline font-bold text-sm`}
                >
                  {tx.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{tx.name}</p>
                  <p className="text-sm text-on-surface-variant truncate">{tx.desc}</p>
                </div>
                <span
                  className={`font-headline font-bold text-lg ${
                    tx.amount > 0 ? "text-tertiary" : "text-error"
                  }`}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">{tx.date}</span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                    tx.status === "Completado"
                      ? "bg-tertiary-fixed/30 text-tertiary"
                      : "bg-primary-fixed/30 text-primary"
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Usuario
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Descripción
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Monto
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Fecha
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={`${tx.initials}-${tx.desc}`}
                  className="border-b border-surface-container last:border-b-0 hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl ${avatarColors[tx.initials]} flex items-center justify-center font-headline font-bold text-sm`}
                      >
                        {tx.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface">{tx.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{tx.desc}</td>
                  <td className="px-6 py-4 text-right">
                    <span
                      className={`font-headline font-bold text-sm ${
                        tx.amount > 0 ? "text-tertiary" : "text-error"
                      }`}
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{tx.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        tx.status === "Completado"
                          ? "bg-tertiary-fixed/30 text-tertiary"
                          : "bg-primary-fixed/30 text-primary"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
            <p className="text-sm text-on-surface-variant">Mostrando 7 de 124 transacciones</p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === page
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
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
