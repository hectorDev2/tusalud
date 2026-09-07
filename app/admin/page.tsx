"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { AdminLayout } from "@/components/admin-layout"
import { CardSkeleton } from "@/components/skeleton"

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
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger" },
  { label: "Perfil", icon: "person", href: "/admin" },
]

interface Stats {
  activeUsers: number
  totalConsultations: number
  pendingApprovals: number
  tokensInCirculation: number
  tokensUsedThisWeek: number
  tokensNewThisWeek: number
  usageRate: number
}

function formatNumber(n: number): string {
  return n.toLocaleString("es-AR")
}

const defaultStats: Stats = {
  activeUsers: 0,
  totalConsultations: 0,
  pendingApprovals: 0,
  tokensInCirculation: 0,
  tokensUsedThisWeek: 0,
  tokensNewThisWeek: 0,
  usageRate: 0,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (r) => {
        const json = await r.json()
        if (!r.ok || !json.ok || !json.data?.stats) {
          throw new Error(json.error || "No se pudieron cargar las métricas")
        }
        return json
      })
      .then((json) => {
        setStats(json.data.stats)
        setError(null)
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar las métricas")
      })
      .finally(() => setLoading(false))
  }, [retryCount])

  function retryLoading() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  return (
    <AdminLayout
      title="Panel de Administración"
      subtitle="Control de Sistemas de Salud"
      sidebarItems={sidebarItems}
      bottomNavItems={bottomNavItems}
    >
      <div className="pt-6 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold font-headline text-on-surface">Visión general del sistema</h1>
        <p className="text-on-surface-variant mt-1 text-sm md:text-base">
          Métricas en tiempo real y acciones pendientes en TuSalud
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : error ? (
        <div className="mb-8 rounded-2xl border border-error/30 bg-error-container p-8 text-center">
          <span className="material-symbols-outlined text-4xl text-error">cloud_off</span>
          <p className="mt-2 text-sm text-on-error-container">{error}</p>
          <button type="button" onClick={retryLoading} className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error">
            Reintentar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-8">
          <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">person_play</span>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold font-headline text-on-surface">{formatNumber(stats.activeUsers)}</p>
            <p className="text-sm text-on-surface-variant mt-1">Usuarios activos</p>
          </div>

          <div className="rounded-2xl p-5 md:p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)] primary-gradient text-on-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-surface-container-lowest/20 flex items-center justify-center">
                <span className="material-symbols-outlined">video_chat</span>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold font-headline">{formatNumber(stats.totalConsultations)}</p>
            <p className="text-sm text-white/80 mt-1">consultas totales</p>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-5 md:p-6 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-error-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-error-container">how_to_reg</span>
              </div>
              {stats.pendingApprovals > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-widest bg-error-container text-on-error-container px-2.5 py-1 rounded-lg">
                  PENDIENTE
                </span>
              )}
            </div>
            <p className="text-2xl md:text-3xl font-bold font-headline text-on-surface">{stats.pendingApprovals}</p>
            <p className="text-sm text-on-surface-variant mt-1">Esperando verificación</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <h2 className="text-lg font-bold font-headline text-on-surface mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/doctor-approvals"
              className="flex items-center justify-between p-4 md:p-5 bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] group hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm md:text-base">
                    Aprobaciones de Doctores
                  </p>
                  <p className="text-sm text-on-surface-variant truncate">
                    {stats.pendingApprovals > 0
                      ? `${stats.pendingApprovals} verificaciones pendientes`
                      : "Sin verificaciones pendientes"}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                chevron_right
              </span>
            </Link>

            <Link
              href="/admin/user-management"
              className="flex items-center justify-between p-4 md:p-5 bg-surface-container-lowest rounded-2xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] group hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary">group</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-on-surface group-hover:text-primary transition-colors text-sm md:text-base">
                    Gestión de Usuarios
                  </p>
                  <p className="text-sm text-on-surface-variant truncate">Gestiona pacientes y personal</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors shrink-0">
                chevron_right
              </span>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-headline text-on-surface">Tokens en circulación</h2>
            <Link href="/admin/token-ledger" className="text-sm font-medium text-primary hover:underline">
              Ver todo
            </Link>
          </div>
          <div className="bg-surface-container-lowest/70 glass-panel rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)] border border-surface-container-low">
            <div className="flex items-center justify-between mb-4">
              <p className="text-2xl md:text-3xl font-bold font-headline text-on-surface">{formatNumber(stats.tokensInCirculation)}</p>
              <span className="text-sm text-tertiary bg-tertiary-fixed/30 px-2.5 py-1 rounded-lg font-semibold">
                {(stats.usageRate || 0).toFixed(1)}% uso
              </span>
            </div>
            <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full rounded-full primary-gradient" style={{ width: `${stats.usageRate || 0}%` }} />
            </div>
            <div className="flex justify-between mt-3 text-xs text-on-surface-variant">
              <span>{formatNumber(stats.tokensUsedThisWeek)} usados esta semana</span>
              <span>{formatNumber(stats.tokensNewThisWeek)} nuevos</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
