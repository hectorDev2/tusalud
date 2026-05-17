"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals", active: true },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
]

const navItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Consultas", icon: "video_chat", href: "/admin/doctor-approvals", active: true },
  { label: "Tokens", icon: "payments", href: "/admin/tokens" },
  { label: "Perfil", icon: "person", href: "/admin/profile" },
]

const approvals = [
  { name: "Dr. Aris Thorne", specialty: "Cardiology", email: "thornea@sanctuary.health" },
  { name: "Dr. Elena Vance", specialty: "Neurology", email: "vance.e@neurowell.com" },
  { name: "Dr. Julian Marsh", specialty: "Pediatrics", email: "marsh_j@healthline.org" },
]

const avatarColors = [
  "bg-primary-fixed/30 text-primary",
  "bg-tertiary-fixed/30 text-tertiary",
  "bg-secondary-container text-secondary",
]

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
}

export default function DoctorApprovals() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 2

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
          <h1 className="text-3xl font-bold font-headline text-on-surface">Aprobaciones de Doctores</h1>
          <p className="text-on-surface-variant mt-1">
            Revisá y verificá las credenciales de los profesionales médicos antes de otorgar acceso al sistema
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <p className="text-2xl font-bold font-headline text-on-surface">12</p>
            <p className="text-sm text-on-surface-variant">Solicitudes pendientes</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <p className="text-2xl font-bold font-headline text-on-surface">48</p>
            <p className="text-sm text-on-surface-variant">Verificados esta semana</p>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <p className="text-2xl font-bold font-headline text-on-surface">4.2h</p>
            <p className="text-sm text-on-surface-variant">Tiempo promedio de revisión</p>
          </div>
        </div>

        <div className="space-y-3 md:hidden">
          {approvals.map((doc) => {
            const colorIndex = approvals.indexOf(doc) % avatarColors.length
            return (
              <div
                key={doc.email}
                className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${avatarColors[colorIndex]} flex items-center justify-center font-headline font-bold text-sm`}
                  >
                    {getInitials(doc.name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface">{doc.name}</p>
                    <p className="text-sm text-on-surface-variant">{doc.specialty}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed/30 text-primary px-2.5 py-1 rounded-lg">
                    Pendiente
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors">
                    Aprobar
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors">
                    Rechazar
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden md:block bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Nombre
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Especialidad
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Estado
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((doc) => {
                const colorIndex = approvals.indexOf(doc) % avatarColors.length
                return (
                  <tr
                    key={doc.email}
                    className="border-b border-surface-container last:border-b-0 group hover:bg-surface-container-low transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl ${avatarColors[colorIndex]} flex items-center justify-center font-headline font-bold text-sm`}
                        >
                          {getInitials(doc.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-on-surface">{doc.name}</p>
                          <p className="text-xs text-on-surface-variant">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{doc.specialty}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed/30 text-primary px-2.5 py-1 rounded-lg">
                        Pendiente
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors">
                          Aprobar
                        </button>
                        <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors">
                          Rechazar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
            <p className="text-sm text-on-surface-variant">Mostrando 3 de 12 solicitudes</p>
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
        <BottomNavBar items={navItems} />
      </div>
    </div>
  )
}
