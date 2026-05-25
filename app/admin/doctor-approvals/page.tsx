"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals", active: true },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Aprobaciones", icon: "verified_user", href: "/admin/doctor-approvals", active: true },
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger" },
  { label: "Perfil", icon: "person", href: "/admin" },
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
  return name.split(" ").map((n) => n[0]).join("")
}

export default function DoctorApprovals() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 2

  return (
    <AdminLayout title="Panel de Administración" subtitle="Control de Sistemas de Salud" sidebarItems={sidebarItems} bottomNavItems={bottomNavItems}>
      <div className="pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Aprobaciones de Doctores</h1>
        <p className="text-on-surface-variant mt-1 text-sm md:text-base">Revisa y verifica las credenciales de los profesionales médicos antes de otorgar acceso al sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold font-headline text-on-surface">12</p>
          <p className="text-sm text-on-surface-variant">Solicitudes pendientes</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold font-headline text-on-surface">48</p>
          <p className="text-sm text-on-surface-variant">Verificados esta semana</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold font-headline text-on-surface">4.2h</p>
          <p className="text-sm text-on-surface-variant">Tiempo promedio de revisión</p>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {approvals.map((doc) => {
          const colorIndex = approvals.indexOf(doc) % avatarColors.length
          return (
            <div key={doc.email} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl ${avatarColors[colorIndex]} flex items-center justify-center font-headline font-bold text-sm`}>{getInitials(doc.name)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{doc.name}</p>
                  <p className="text-sm text-on-surface-variant">{doc.specialty}</p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed/30 text-primary px-2.5 py-1 rounded-lg shrink-0">Pendiente</span>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors">Aprobar</button>
                <button className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors">Rechazar</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Nombre</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Especialidad</th>
                <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Estado</th>
                <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((doc) => {
                const colorIndex = approvals.indexOf(doc) % avatarColors.length
                return (
                  <tr key={doc.email} className="border-b border-surface-container last:border-b-0 group hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${avatarColors[colorIndex]} flex items-center justify-center font-headline font-bold text-sm`}>{getInitials(doc.name)}</div>
                        <div>
                          <p className="font-semibold text-on-surface">{doc.name}</p>
                          <p className="text-xs text-on-surface-variant">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{doc.specialty}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed/30 text-primary px-2.5 py-1 rounded-lg">Pendiente</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors">Aprobar</button>
                        <button className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors">Rechazar</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
          <p className="text-sm text-on-surface-variant">Mostrando 3 de 12 solicitudes</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${currentPage === page ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}>{page}</button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
