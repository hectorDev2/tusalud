"use client"

import { useEffect, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { ListSkeleton } from "@/components/skeleton"
import { useToast } from "@/components/toast"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger" },
  { label: "Reportes de errores", icon: "bug_report", href: "/admin/bug-reports", active: true },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Reportes", icon: "bug_report", href: "/admin/bug-reports", active: true },
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger" },
  { label: "Perfil", icon: "person", href: "/admin" },
]

type ReportStatus = "open" | "in_progress" | "resolved" | "closed"
type ReportPriority = "low" | "normal" | "high" | "critical"

interface BugReport {
  id: string
  title: string
  description: string
  status: ReportStatus
  priority: ReportPriority
  page_url: string | null
  error_context: { message?: string; source?: string } | null
  attachment_url: string | null
  attachment_name: string | null
  created_at: string
  admin_notes: string | null
  reporter: { id: string; name: string; role: string } | null
}

const statusLabels: Record<ReportStatus, string> = {
  open: "Abierto",
  in_progress: "En revisión",
  resolved: "Resuelto",
  closed: "Cerrado",
}

const priorityLabels: Record<ReportPriority, string> = {
  low: "Baja",
  normal: "Normal",
  high: "Alta",
  critical: "Crítica",
}

const statusClasses: Record<ReportStatus, string> = {
  open: "bg-error-container text-error",
  in_progress: "bg-secondary-container text-secondary",
  resolved: "bg-tertiary-fixed text-tertiary",
  closed: "bg-surface-container-high text-on-surface-variant",
}

const priorityClasses: Record<ReportPriority, string> = {
  low: "text-on-surface-variant",
  normal: "text-secondary",
  high: "text-error",
  critical: "font-bold text-error",
}

function displayDate(value: string) {
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

export default function BugReportsPage() {
  const { toast } = useToast()
  const [reports, setReports] = useState<BugReport[]>([])
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const query = statusFilter === "all" ? "" : `?status=${statusFilter}`
    fetch(`/api/bug-reports${query}`)
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || !json.ok) throw new Error(json.error || "No se pudieron cargar los reportes")
        setReports(json.data?.reports ?? [])
        setError(null)
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los reportes")
      })
      .finally(() => setLoading(false))
  }, [statusFilter, retryCount])

  async function updateReport(id: string, patch: { status?: ReportStatus; priority?: ReportPriority; adminNotes?: string }) {
    try {
      const response = await fetch(`/api/bug-reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const json = await response.json()
      if (!response.ok || !json.ok) throw new Error(json.error || "No se pudo actualizar el reporte")
      toast("Reporte actualizado", "success")
      setRetryCount((count) => count + 1)
    } catch (requestError) {
      toast(requestError instanceof Error ? requestError.message : "No se pudo actualizar el reporte", "error")
    }
  }

  return (
    <AdminLayout
      title="Panel de Administración"
      subtitle="Control de Sistemas de Salud"
      sidebarItems={sidebarItems}
      bottomNavItems={bottomNavItems}
    >
      <div className="flex flex-col gap-4 py-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">Soporte operativo</p>
          <h1 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">Reportes de errores</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Recibí problemas reportados por pacientes y doctores.</p>
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as "all" | ReportStatus)} className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
          <option value="all">Todos los estados</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {loading ? <ListSkeleton count={4} /> : error ? (
        <div className="rounded-2xl border border-error/30 bg-error-container p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-error">cloud_off</span>
          <p className="mt-2 text-sm text-on-error-container">{error}</p>
          <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error">Reintentar</button>
        </div>
      ) : reports.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-low p-12 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant/50">task_alt</span>
          <p className="mt-3 font-semibold text-on-surface">No hay reportes para mostrar</p>
          <p className="mt-1 text-sm text-on-surface-variant">Los nuevos reportes aparecerán acá.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <article key={report.id} className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${statusClasses[report.status]}`}>{statusLabels[report.status]}</span>
                    <span className={`text-xs uppercase tracking-widest ${priorityClasses[report.priority]}`}>{priorityLabels[report.priority]}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-bold text-on-surface">{report.title}</h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-on-surface-variant">{report.description}</p>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                    <span>{report.reporter?.name || "Usuario"}</span>
                    <span>{displayDate(report.created_at)}</span>
                    {report.page_url && <span className="max-w-full truncate">{report.page_url}</span>}
                  </div>
                  {report.error_context?.message && <p className="mt-3 rounded-xl bg-error-container/60 px-3 py-2 font-mono text-xs text-on-error-container">{report.error_context.message}</p>}
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                  <select value={report.status} onChange={(event) => void updateReport(report.id, { status: event.target.value as ReportStatus })} className="rounded-xl border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface outline-none focus:border-primary">
                    {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  {report.attachment_url && <a href={report.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-fixed px-3 py-2 text-xs font-semibold text-primary hover:bg-primary-fixed/70"><span className="material-symbols-outlined text-base">image</span>Ver captura</a>}
                </div>
              </div>

              {report.admin_notes && <p className="mt-4 rounded-xl bg-secondary-container/40 px-3 py-2 text-sm text-on-surface">Notas: {report.admin_notes}</p>}
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
