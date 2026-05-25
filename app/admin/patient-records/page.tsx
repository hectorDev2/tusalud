"use client"

import { AdminLayout } from "@/components/admin-layout"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records", active: true },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Pacientes", icon: "folder_shared", href: "/admin/patient-records", active: true },
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger" },
  { label: "Perfil", icon: "person", href: "/admin" },
]

const stats = [
  { label: "Pacientes Activos", value: "1,284", icon: "group", change: "+3.2%", color: "text-primary", bg: "bg-primary-fixed/30" },
  { label: "Consultas Totales", value: "8,421", icon: "stethoscope", change: "+12.5%", color: "text-tertiary", bg: "bg-tertiary-fixed/30" },
  { label: "Altas este Mes", value: "342", icon: "patient_list", change: "+8.7%", color: "text-secondary", bg: "bg-secondary-container" },
]

const patients = [
  { initials: "SM", name: "Sarah Mitchell", email: "s.mitchell@email.com", age: 28, lastConsultation: "Hoy", active: true, color: "bg-primary-fixed/30", textColor: "text-primary" },
  { initials: "MC", name: "Marcus Chen", email: "m.chen@email.com", age: 45, lastConsultation: "Ayer", active: true, color: "bg-tertiary-fixed/30", textColor: "text-tertiary" },
  { initials: "ER", name: "Elena Rodriguez", email: "e.rodriguez@email.com", age: 35, lastConsultation: "3 días", active: true, color: "bg-secondary-container", textColor: "text-secondary" },
  { initials: "JW", name: "James Wilson", email: "j.wilson@email.com", age: 52, lastConsultation: "1 semana", active: false, color: "bg-surface-container-high", textColor: "text-on-surface-variant" },
  { initials: "LB", name: "Laura Bennett", email: "l.bennett@email.com", age: 29, lastConsultation: "2 semanas", active: true, color: "bg-primary-fixed/30", textColor: "text-primary" },
  { initials: "RK", name: "Robert Kim", email: "r.kim@email.com", age: 41, lastConsultation: "1 mes", active: false, color: "bg-surface-container-high", textColor: "text-on-surface-variant" },
]

export default function PatientRecordsPage() {
  return (
    <AdminLayout title="Panel de Administración" subtitle="Control de Sistemas de Salud" sidebarItems={sidebarItems} bottomNavItems={bottomNavItems}>
      <div className="pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Registros de Pacientes</h1>
        <p className="text-on-surface-variant mt-1 text-sm md:text-base">Visualiza y gestiona los perfiles de pacientes registrados en la plataforma.</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        <input type="text" placeholder="Busca por nombre, email o documento..." className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface-container-lowest border border-outline-variant text-on-surface placeholder:text-on-surface-variant/60 font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim focus:border-primary transition-all shadow-sm" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
              </div>
              <span className={`text-sm font-semibold ${stat.color} ${stat.bg} px-2.5 py-1 rounded-lg`}>{stat.change}</span>
            </div>
            <p className="text-2xl md:text-3xl font-bold font-headline text-on-surface">{stat.value}</p>
            <p className="text-sm text-on-surface-variant mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Table — desktop */}
      <div className="hidden md:block bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-surface-container">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Paciente</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Email</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Edad</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Última Consulta</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Estado</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.initials} className="border-b border-surface-container/50 hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center font-headline font-bold text-sm ${p.textColor}`}>{p.initials}</div>
                      <span className="font-semibold text-on-surface text-sm">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{p.email}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{p.age} años</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{p.lastConsultation}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${p.active ? "bg-tertiary-fixed/30 text-tertiary" : "bg-surface-container-high text-on-surface-variant"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-tertiary" : "bg-outline"}`} />
                      {p.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="md:hidden space-y-4">
        {patients.map((p) => (
          <div key={p.initials} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center font-headline font-bold text-sm ${p.textColor}`}>{p.initials}</div>
                <div>
                  <p className="font-semibold text-on-surface text-sm">{p.name}</p>
                  <p className="text-xs text-on-surface-variant">{p.email}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${p.active ? "bg-tertiary-fixed/30 text-tertiary" : "bg-surface-container-high text-on-surface-variant"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.active ? "bg-tertiary" : "bg-outline"}`} />
                {p.active ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-on-surface-variant">Edad</p><p className="font-medium text-on-surface">{p.age} años</p></div>
              <div><p className="text-xs text-on-surface-variant">Última Consulta</p><p className="font-medium text-on-surface">{p.lastConsultation}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-on-surface-variant">Mostrando <span className="font-semibold text-on-surface">6</span> de <span className="font-semibold text-on-surface">128</span> pacientes</p>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary text-on-primary text-sm font-semibold shadow-sm">1</button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors shadow-sm">2</button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors shadow-sm">3</button>
          <span className="text-on-surface-variant text-sm px-1">...</span>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors shadow-sm">22</button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors shadow-sm">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
