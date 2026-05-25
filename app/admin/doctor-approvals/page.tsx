"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { ListSkeleton } from "@/components/skeleton"

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

interface Approval {
  id: string
  name: string
  specialty: string
  email: string
  avatar: string
  status: "pending" | "verified"
}

const avatarColors = [
  "bg-primary-fixed/30 text-primary",
  "bg-tertiary-fixed/30 text-tertiary",
  "bg-secondary-container text-secondary",
]

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("")
}

export default function DoctorApprovals() {
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/approvals")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setApprovals(json.data?.approvals || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleApprove(id: string) {
    setActing(id)
    const res = await fetch(`/api/admin/approvals/${id}`, { method: "PATCH" })
    const json = await res.json()
    if (json.ok) {
      setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: "verified" } : a)))
    }
    setActing(null)
  }

  async function handleReject(id: string) {
    setActing(id)
    const res = await fetch(`/api/admin/approvals/${id}`, { method: "DELETE" })
    if (res.ok) {
      setApprovals((prev) => prev.filter((a) => a.id !== id))
    }
    setActing(null)
  }

  const pending = approvals.filter((a) => a.status === "pending")

  return (
    <AdminLayout title="Panel de Administración" subtitle="Control de Sistemas de Salud" sidebarItems={sidebarItems} bottomNavItems={bottomNavItems}>
      <div className="pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Aprobaciones de Doctores</h1>
        <p className="text-on-surface-variant mt-1 text-sm md:text-base">Revisa y verifica las credenciales de los profesionales médicos antes de otorgar acceso al sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold font-headline text-on-surface">{pending.length}</p>
          <p className="text-sm text-on-surface-variant">Solicitudes pendientes</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold font-headline text-on-surface">{approvals.filter((a) => a.status === "verified").length}</p>
          <p className="text-sm text-on-surface-variant">Verificados</p>
        </div>
        <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
          <p className="text-2xl font-bold font-headline text-on-surface">{approvals.length}</p>
          <p className="text-sm text-on-surface-variant">Total de solicitudes</p>
        </div>
      </div>

      {loading ? (
        <ListSkeleton count={3} />
      ) : pending.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">verified_user</span>
          <p className="mt-4 text-sm text-on-surface-variant">No hay solicitudes pendientes</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {pending.map((doc, idx) => (
              <div key={doc.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${avatarColors[idx % avatarColors.length]} flex items-center justify-center font-headline font-bold text-sm`}>{getInitials(doc.name)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface truncate">{doc.name}</p>
                    <p className="text-sm text-on-surface-variant">{doc.specialty}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-primary-fixed/30 text-primary px-2.5 py-1 rounded-lg shrink-0">Pendiente</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(doc.id)} disabled={acting === doc.id}
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors disabled:opacity-50"
                  >{acting === doc.id ? "..." : "Aprobar"}</button>
                  <button onClick={() => handleReject(doc.id)} disabled={acting === doc.id}
                    className="flex-1 px-4 py-2 text-sm font-semibold rounded-xl bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors disabled:opacity-50"
                  >{acting === doc.id ? "..." : "Rechazar"}</button>
                </div>
              </div>
            ))}
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
                  {pending.map((doc, idx) => (
                    <tr key={doc.id} className="border-b border-surface-container last:border-b-0 group hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl ${avatarColors[idx % avatarColors.length]} flex items-center justify-center font-headline font-bold text-sm`}>{getInitials(doc.name)}</div>
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
                          <button onClick={() => handleApprove(doc.id)} disabled={acting === doc.id}
                            className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-tertiary text-on-tertiary hover:bg-tertiary/90 transition-colors disabled:opacity-50"
                          >{acting === doc.id ? "..." : "Aprobar"}</button>
                          <button onClick={() => handleReject(doc.id)} disabled={acting === doc.id}
                            className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors disabled:opacity-50"
                          >{acting === doc.id ? "..." : "Rechazar"}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
