"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management", active: true },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Consultas", icon: "video_chat", href: "/admin/doctor-approvals" },
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger" },
  { label: "Perfil", icon: "person", href: "/admin" },
]

type Role = "Paciente" | "Doctor" | "Administrador"
type Status = "Activo" | "Suspendido" | "Pendiente"
type FilterTab = "Todos" | "Pacientes" | "Doctores" | "Administradores"

interface User {
  id: string
  initials: string
  avatarBg: string
  avatarText: string
  name: string
  email: string
  role: Role
  status: Status
}

const initialUsers: User[] = [
  {
    id: "1",
    initials: "SM",
    avatarBg: "bg-tertiary-fixed/30",
    avatarText: "text-tertiary",
    name: "Sarah Mitchell",
    email: "s.mitchell@email.com",
    role: "Paciente",
    status: "Activo",
  },
  {
    id: "2",
    initials: "AT",
    avatarBg: "bg-primary-fixed/30",
    avatarText: "text-primary",
    name: "Dr. Aris Thorne",
    email: "thornea@sanctuary.health",
    role: "Doctor",
    status: "Activo",
  },
  {
    id: "3",
    initials: "SC",
    avatarBg: "bg-primary-fixed/30",
    avatarText: "text-primary",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@neuro.com",
    role: "Doctor",
    status: "Activo",
  },
  {
    id: "4",
    initials: "AP",
    avatarBg: "bg-secondary-container",
    avatarText: "text-secondary",
    name: "Admin Portal",
    email: "admin@sanctuary.health",
    role: "Administrador",
    status: "Activo",
  },
  {
    id: "5",
    initials: "MC",
    avatarBg: "bg-tertiary-fixed/30",
    avatarText: "text-tertiary",
    name: "Marcus Chen",
    email: "m.chen@email.com",
    role: "Paciente",
    status: "Activo",
  },
  {
    id: "6",
    initials: "JW",
    avatarBg: "bg-tertiary-fixed/30",
    avatarText: "text-tertiary",
    name: "James Wilson",
    email: "j.wilson@email.com",
    role: "Paciente",
    status: "Suspendido",
  },
  {
    id: "7",
    initials: "EV",
    avatarBg: "bg-primary-fixed/30",
    avatarText: "text-primary",
    name: "Dr. Elena Vance",
    email: "vance.e@neurowell.com",
    role: "Doctor",
    status: "Pendiente",
  },
]

const filterTabs: FilterTab[] = ["Todos", "Pacientes", "Doctores", "Administradores"]

const roleBadgeColors: Record<Role, { bg: string; text: string }> = {
  Paciente: { bg: "bg-tertiary-fixed/30", text: "text-tertiary" },
  Doctor: { bg: "bg-primary-fixed/30", text: "text-primary" },
  Administrador: { bg: "bg-secondary-container", text: "text-secondary" },
}

const statusColors: Record<Status, { bg: string; dot: string; label: string }> = {
  Activo: { bg: "bg-tertiary-fixed/30", dot: "bg-tertiary", label: "text-tertiary" },
  Suspendido: { bg: "bg-error-container", dot: "bg-error", label: "text-on-error-container" },
  Pendiente: { bg: "bg-surface-container-high", dot: "bg-outline", label: "text-on-surface-variant" },
}

const toggleStatus = (current: Status): Status => {
  if (current === "Activo") return "Suspendido"
  if (current === "Suspendido") return "Activo"
  return current
}

export default function UserManagementPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Todos")
  const [users, setUsers] = useState<User[]>(initialUsers)

  const filteredUsers = users.filter((user) => {
    if (activeFilter === "Todos") return true
    if (activeFilter === "Pacientes") return user.role === "Paciente"
    if (activeFilter === "Doctores") return user.role === "Doctor"
    if (activeFilter === "Administradores") return user.role === "Administrador"
    return true
  })

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: toggleStatus(u.status) } : u))
    )
  }

  const filterCounts: Record<FilterTab, number> = {
    Todos: users.length,
    Pacientes: users.filter((u) => u.role === "Paciente").length,
    Doctores: users.filter((u) => u.role === "Doctor").length,
    Administradores: users.filter((u) => u.role === "Administrador").length,
  }

  const statsCards = [
    { label: "Total", value: "2,450", icon: "group", color: "bg-primary-fixed/30", iconColor: "text-primary" },
    { label: "Pacientes", value: "1,284", icon: "personal_injury", color: "bg-tertiary-fixed/30", iconColor: "text-tertiary" },
    { label: "Doctores", value: "48", icon: "stethoscopy", color: "bg-primary-fixed/30", iconColor: "text-primary" },
    { label: "Admins", value: "6", icon: "admin_panel_settings", color: "bg-secondary-container", iconColor: "text-secondary" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        title="Panel de Administración"
        subtitle="Control de Sistemas de Salud"
        items={sidebarItems}
      />

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
        <div className="pt-8 pb-6">
          <h1 className="text-3xl font-bold font-headline text-on-surface">
            Gestión de Usuarios
          </h1>
          <p className="text-on-surface-variant mt-1">
            Administrá roles, permisos y acceso de todos los usuarios de la plataforma.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold font-label transition-all duration-200 ${
                activeFilter === tab
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}
                >
                  <span className={`material-symbols-outlined ${stat.iconColor}`}>
                    {stat.icon}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-bold font-headline text-on-surface">{stat.value}</p>
              <p className="text-sm text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-surface-container-lowest rounded-3xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-container">
                  <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">
                    Usuario
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">
                    Rol
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const badge = roleBadgeColors[user.role]
                  const statusStyle = statusColors[user.status]
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-surface-container-low hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl ${user.avatarBg} flex items-center justify-center font-headline font-bold text-sm ${user.avatarText}`}
                          >
                            {user.initials}
                          </div>
                          <span className="font-semibold text-on-surface text-sm">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                          />
                          <span className={statusStyle.label}>{user.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary"
                            title="Editar permisos"
                          >
                            <span className="material-symbols-outlined text-lg">
                              manage_accounts
                            </span>
                          </button>
                          {user.status !== "Pendiente" && (
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-2 rounded-xl transition-colors ${
                                user.status === "Activo"
                                  ? "hover:bg-error-container text-on-surface-variant hover:text-error"
                                  : "hover:bg-tertiary-fixed/30 text-on-surface-variant hover:text-tertiary"
                              }`}
                              title={
                                user.status === "Activo" ? "Suspender" : "Activar"
                              }
                            >
                              <span className="material-symbols-outlined text-lg">
                                {user.status === "Activo"
                                  ? "block"
                                  : "check_circle"}
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-surface-container-low">
            {filteredUsers.map((user) => {
              const badge = roleBadgeColors[user.role]
              const statusStyle = statusColors[user.status]
              return (
                <div key={user.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${user.avatarBg} flex items-center justify-center font-headline font-bold text-sm ${user.avatarText}`}
                      >
                        {user.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">
                          {user.name}
                        </p>
                        <p className="text-xs text-on-surface-variant">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant"
                        title="Editar permisos"
                      >
                        <span className="material-symbols-outlined">
                          manage_accounts
                        </span>
                      </button>
                      {user.status !== "Pendiente" && (
                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded-xl transition-colors ${
                            user.status === "Activo"
                              ? "hover:bg-error-container hover:text-error"
                              : "hover:bg-tertiary-fixed/30 hover:text-tertiary"
                          } text-on-surface-variant`}
                        >
                          <span className="material-symbols-outlined">
                            {user.status === "Activo" ? "block" : "check_circle"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}
                    >
                      {user.role}
                    </span>
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                      />
                      <span className={statusStyle.label}>{user.status}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
            <p className="text-sm text-on-surface-variant">
              Mostrando{" "}
              <span className="font-semibold text-on-surface">
                {filteredUsers.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-on-surface">
                {filterCounts[activeFilter]}
              </span>{" "}
              usuarios
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled
                className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_left
                </span>
              </button>
              <span className="w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                1
              </span>
              <button
                disabled
                className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant/50 cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg">
                  chevron_right
                </span>
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
