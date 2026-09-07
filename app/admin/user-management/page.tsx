"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { ListSkeleton } from "@/components/skeleton"
import { useToast } from "@/components/toast"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management", active: true },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Usuarios", icon: "group", href: "/admin/user-management", active: true },
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

const roleMap: Record<string, Role> = {
  patient: "Paciente",
  paciente: "Paciente",
  doctor: "Doctor",
  admin: "Administrador",
  administrador: "Administrador",
}

const avatarPalette = [
  "bg-tertiary-fixed/30 text-tertiary",
  "bg-primary-fixed/30 text-primary",
  "bg-secondary-container text-secondary",
  "bg-surface-container-high text-on-surface-variant",
]

export default function UserManagementPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Todos")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [toggling, setToggling] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/users")
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || !json.ok) throw new Error(json.error || "No se pudieron cargar los usuarios")
        return json
      })
      .then((json) => {
        if (!cancelled && json.data?.users) {
          setUsers(json.data.users.map((u: Record<string, string>, i: number) => ({
            id: u.id,
            initials: u.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??",
            avatarBg: avatarPalette[i % avatarPalette.length],
            avatarText: avatarPalette[i % avatarPalette.length].split(" ")[1],
            name: u.name,
            email: u.email,
            role: roleMap[u.role?.toLowerCase()] ?? "Paciente",
            status: (u.status === "suspendido" ? "Suspendido" : u.status === "pendiente" ? "Pendiente" : "Activo") as Status,
          })))
          setError(null)
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los usuarios")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [retryCount])

  const filteredUsers = users.filter((user) => {
    if (activeFilter === "Todos") return true
    if (activeFilter === "Pacientes") return user.role === "Paciente"
    if (activeFilter === "Doctores") return user.role === "Doctor"
    if (activeFilter === "Administradores") return user.role === "Administrador"
    return true
  })

  function retryLoading() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  async function handleToggleStatus(id: string) {
    setToggling(id)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json.error || "Error al actualizar")
      setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status: u.status === "Activo" ? "Suspendido" : "Activo" } : u))
      toast("Estado de usuario actualizado", "success")
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : "No se pudo actualizar el usuario", "error")
    } finally {
      setToggling(null)
    }
  }

  const filterCounts: Record<FilterTab, number> = {
    Todos: users.length,
    Pacientes: users.filter((u) => u.role === "Paciente").length,
    Doctores: users.filter((u) => u.role === "Doctor").length,
    Administradores: users.filter((u) => u.role === "Administrador").length,
  }

  const statsCards = [
    { label: "Total", value: String(users.length), icon: "group", color: "bg-primary-fixed/30", iconColor: "text-primary" },
    { label: "Pacientes", value: String(filterCounts.Pacientes), icon: "personal_injury", color: "bg-tertiary-fixed/30", iconColor: "text-tertiary" },
    { label: "Doctores", value: String(filterCounts.Doctores), icon: "stethoscopy", color: "bg-primary-fixed/30", iconColor: "text-primary" },
    { label: "Admins", value: String(filterCounts.Administradores), icon: "admin_panel_settings", color: "bg-secondary-container", iconColor: "text-secondary" },
  ]

  return (
    <AdminLayout title="Panel de Administración" subtitle="Control de Sistemas de Salud" sidebarItems={sidebarItems} bottomNavItems={bottomNavItems}>
      <div className="pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Gestión de Usuarios</h1>
        <p className="text-on-surface-variant mt-1 text-sm md:text-base">Administra roles, permisos y acceso de todos los usuarios de la plataforma.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold font-label transition-all duration-200 ${
              activeFilter === tab
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            {tab} ({filterCounts[tab]})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat) => (
          <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.iconColor}`}>{stat.icon}</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-bold font-headline text-on-surface">{stat.value}</p>
            <p className="text-sm text-on-surface-variant">{stat.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <ListSkeleton count={5} />
      ) : error ? (
        <div className="rounded-2xl border border-error/30 bg-error-container p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-error">cloud_off</span>
          <p className="mt-2 text-sm text-on-error-container">{error}</p>
          <button type="button" onClick={retryLoading} className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error">Reintentar</button>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl shadow-sm overflow-hidden">
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-surface-container">
                    <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">Usuario</th>
                    <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">Email</th>
                    <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">Rol</th>
                    <th className="text-left px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">Estado</th>
                    <th className="text-right px-6 py-4 text-xs font-bold font-label uppercase tracking-widest text-on-surface-variant">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const badge = roleBadgeColors[user.role]
                    const statusStyle = statusColors[user.status]
                    return (
                      <tr key={user.id} className="border-b border-surface-container-low hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${user.avatarBg} flex items-center justify-center font-headline font-bold text-sm ${user.avatarText}`}>{user.initials}</div>
                            <span className="font-semibold text-on-surface text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}>{user.role}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            <span className={statusStyle.label}>{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-primary" title="Editar permisos">
                              <span className="material-symbols-outlined text-lg">manage_accounts</span>
                            </button>
                            {user.status !== "Pendiente" && (
                              <button onClick={() => handleToggleStatus(user.id)} disabled={toggling === user.id}
                                className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                                  user.status === "Activo"
                                    ? "hover:bg-error-container text-on-surface-variant hover:text-error"
                                    : "hover:bg-tertiary-fixed/30 text-on-surface-variant hover:text-tertiary"
                                }`}
                                title={user.status === "Activo" ? "Suspender" : "Activar"}
                              >
                                <span className="material-symbols-outlined text-lg">{toggling === user.id ? "hourglass" : user.status === "Activo" ? "block" : "check_circle"}</span>
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
          </div>

          <div className="md:hidden divide-y divide-surface-container-low">
            {filteredUsers.map((user) => {
              const badge = roleBadgeColors[user.role]
              const statusStyle = statusColors[user.status]
              return (
                <div key={user.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl ${user.avatarBg} flex items-center justify-center font-headline font-bold text-sm ${user.avatarText}`}>{user.initials}</div>
                      <div className="min-w-0">
                        <p className="font-semibold text-on-surface text-sm truncate">{user.name}</p>
                        <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="p-2 rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant">
                        <span className="material-symbols-outlined">manage_accounts</span>
                      </button>
                      {user.status !== "Pendiente" && (
                        <button onClick={() => handleToggleStatus(user.id)} disabled={toggling === user.id}
                          className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${
                            user.status === "Activo" ? "hover:bg-error-container hover:text-error" : "hover:bg-tertiary-fixed/30 hover:text-tertiary"
                          } text-on-surface-variant`}
                        >
                          <span className="material-symbols-outlined">{toggling === user.id ? "hourglass" : user.status === "Activo" ? "block" : "check_circle"}</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${badge.bg} ${badge.text}`}>{user.role}</span>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${statusStyle.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      <span className={statusStyle.label}>{user.status}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-container">
            <p className="text-sm text-on-surface-variant">Mostrando <span className="font-semibold text-on-surface">{filteredUsers.length}</span> de <span className="font-semibold text-on-surface">{filterCounts[activeFilter]}</span> usuarios</p>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
