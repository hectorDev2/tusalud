"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { ListSkeleton } from "@/components/skeleton"

const sidebarItems = [
  { label: "Panel", icon: "dashboard", href: "/admin" },
  { label: "Registros de Pacientes", icon: "folder_shared", href: "/admin/patient-records" },
  { label: "Aprobaciones de Doctores", icon: "verified_user", href: "/admin/doctor-approvals" },
  { label: "Gestión de Usuarios", icon: "group", href: "/admin/user-management" },
  { label: "Libro de Tokens", icon: "payments", href: "/admin/token-ledger", active: true },
]

const bottomNavItems = [
  { label: "Inicio", icon: "home", href: "/admin" },
  { label: "Tokens", icon: "payments", href: "/admin/token-ledger", active: true },
  { label: "Perfil", icon: "person", href: "/admin" },
]

const filters = ["Esta Semana", "Este Mes", "Este Año"] as const
type Filter = (typeof filters)[number]

interface TokenTransaction {
  id: string
  user_id: string
  type: string
  amount: number
  description: string
  detail: string | null
  date: string | null
  status: string | null
  created_at: string | null
}

const avatarColors = [
  "bg-primary-fixed/30 text-primary",
  "bg-secondary-container text-secondary",
  "bg-tertiary-fixed/30 text-tertiary",
  "bg-surface-container-high text-on-surface-variant",
]

function signedAmount(transaction: TokenTransaction): number {
  const amount = Math.abs(transaction.amount)
  return transaction.type === "debit" ? -amount : amount
}

function shortUserId(id: string): string {
  return id ? `Usuario ${id.slice(0, 8)}` : "Usuario sin ID"
}

function initials(id: string): string {
  return id.replace(/-/g, "").slice(0, 2).toUpperCase() || "??"
}

function isInFilter(date: string | null, filter: Filter): boolean {
  if (!date) return filter === "Esta Semana"
  const timestamp = Date.parse(date)
  if (Number.isNaN(timestamp)) return filter === "Esta Semana"
  const target = new Date(timestamp)
  const now = new Date()
  if (filter === "Este Año") return target.getFullYear() === now.getFullYear()
  if (filter === "Este Mes") return target.getFullYear() === now.getFullYear() && target.getMonth() === now.getMonth()
  const startOfWeek = new Date(now)
  const day = startOfWeek.getDay() || 7
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(startOfWeek.getDate() - day + 1)
  return target >= startOfWeek
}

function displayDate(transaction: TokenTransaction): string {
  if (transaction.date) return transaction.date
  if (!transaction.created_at) return "Sin fecha"
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(new Date(transaction.created_at))
}

export default function TokenLedger() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([])
  const [activeFilter, setActiveFilter] = useState<Filter>("Esta Semana")
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const pageSize = 7

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/tokens")
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || !json.ok) throw new Error(json.error || "No se pudieron cargar los movimientos")
        return json
      })
      .then((json) => {
        if (!cancelled) {
          setTransactions(json.data?.transactions ?? [])
          setError(null)
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los movimientos")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [retryCount])

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase()
    return transactions.filter((transaction) => {
      if (!isInFilter(transaction.created_at, activeFilter)) return false
      if (!query) return true
      return [transaction.user_id, transaction.description, transaction.detail].filter(Boolean).some((value) => value!.toLowerCase().includes(query))
    })
  }, [activeFilter, search, transactions])
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize))
  const visiblePage = Math.min(currentPage, totalPages)
  const visibleTransactions = filteredTransactions.slice((visiblePage - 1) * pageSize, visiblePage * pageSize)
  const credits = filteredTransactions.filter((transaction) => transaction.type === "credit").reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  const debits = filteredTransactions.filter((transaction) => transaction.type === "debit").reduce((total, transaction) => total + Math.abs(transaction.amount), 0)
  const net = credits - debits

  function retryLoading() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  function selectFilter(filter: Filter) {
    setActiveFilter(filter)
    setCurrentPage(1)
  }

  function changeSearch(value: string) {
    setSearch(value)
    setCurrentPage(1)
  }

  const stats = [
    ["Movimientos", filteredTransactions.length, "receipt_long", "text-primary", "bg-primary-fixed/30"],
    ["Créditos registrados", credits, "add_circle", "text-tertiary", "bg-tertiary-fixed/30"],
    ["Débitos registrados", debits, "remove_circle", "text-error", "bg-error-container"],
    ["Balance neto", net, "account_balance", net >= 0 ? "text-primary" : "text-error", "bg-secondary-container"],
  ]

  return (
    <AdminLayout title="Panel de Administración" subtitle="Control de Sistemas de Salud" sidebarItems={sidebarItems} bottomNavItems={bottomNavItems}>
      <div className="pb-6 pt-6"><h1 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">Libro de Tokens</h1><p className="mt-1 text-sm text-on-surface-variant md:text-base">Monitorea el flujo de tokens de todos los usuarios del sistema.</p></div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row"><div className="relative flex-1"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">search</span><input type="search" value={search} onChange={(event) => changeSearch(event.target.value)} placeholder="Busca por usuario o descripción..." aria-label="Buscar movimientos" className="h-11 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest pl-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim" /></div><div className="flex flex-wrap gap-2">{filters.map((filter) => <button key={filter} type="button" onClick={() => selectFilter(filter)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeFilter === filter ? "bg-primary text-on-primary" : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low"}`}>{filter}</button>)}</div></div>

      {!loading && !error && <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(([label, value, icon, color, bg]) => <div key={label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm md:p-6"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}><span className={`material-symbols-outlined ${color}`}>{icon}</span></div><p className="font-headline text-2xl font-bold text-on-surface md:text-3xl">{value}</p><p className="mt-1 text-sm text-on-surface-variant">{label}</p></div>)}</div>}

      {loading ? <ListSkeleton count={5} /> : error ? <div className="rounded-2xl border border-error/30 bg-error-container p-8 text-center"><span className="material-symbols-outlined text-4xl text-error">cloud_off</span><p className="mt-2 text-sm text-on-error-container">{error}</p><button type="button" onClick={retryLoading} className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error">Reintentar</button></div> : visibleTransactions.length === 0 ? <div className="rounded-2xl bg-surface-container-low p-8 text-center"><span className="material-symbols-outlined text-4xl text-on-surface-variant/50">receipt_long</span><p className="mt-2 text-sm text-on-surface-variant">{search ? "No encontramos movimientos con esa búsqueda." : "No hay movimientos para el período seleccionado."}</p></div> : <>
        <div className="hidden overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm md:block"><div className="overflow-x-auto"><table className="w-full min-w-[650px]"><thead><tr className="border-b border-surface-container"><th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Usuario</th><th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Descripción</th><th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">Monto</th><th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Fecha</th><th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-on-surface-variant">Estado</th></tr></thead><tbody>{visibleTransactions.map((transaction, index) => { const amount = signedAmount(transaction); return <tr key={transaction.id} className="border-b border-surface-container last:border-0 hover:bg-surface-container-low"><td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${avatarColors[index % avatarColors.length]}`}>{initials(transaction.user_id)}</div><span className="font-semibold text-on-surface">{shortUserId(transaction.user_id)}</span></div></td><td className="px-6 py-4 text-sm text-on-surface-variant"><span>{transaction.description}</span>{transaction.detail && <span className="ml-2 text-xs">{transaction.detail}</span>}</td><td className={`px-6 py-4 text-right text-sm font-bold ${amount >= 0 ? "text-tertiary" : "text-error"}`}>{amount >= 0 ? "+" : ""}{amount}</td><td className="px-6 py-4 text-sm text-on-surface-variant">{displayDate(transaction)}</td><td className="px-6 py-4"><span className="rounded-lg bg-surface-container-high px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{transaction.status || "Sin estado"}</span></td></tr> })}</tbody></table></div></div>
        <div className="space-y-3 md:hidden">{visibleTransactions.map((transaction, index) => { const amount = signedAmount(transaction); return <div key={transaction.id} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><div className="mb-3 flex items-center gap-3"><div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${avatarColors[index % avatarColors.length]}`}>{initials(transaction.user_id)}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold text-on-surface">{shortUserId(transaction.user_id)}</p><p className="truncate text-sm text-on-surface-variant">{transaction.description}</p></div><span className={`font-headline text-lg font-bold ${amount >= 0 ? "text-tertiary" : "text-error"}`}>{amount >= 0 ? "+" : ""}{amount}</span></div><div className="flex items-center justify-between"><span className="text-xs text-on-surface-variant">{displayDate(transaction)}</span><span className="rounded-lg bg-surface-container-high px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{transaction.status || "Sin estado"}</span></div></div> })}</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-on-surface-variant">Mostrando <span className="font-semibold text-on-surface">{visibleTransactions.length}</span> de <span className="font-semibold text-on-surface">{filteredTransactions.length}</span> movimientos</p><div className="flex items-center gap-1"><button type="button" aria-label="Página anterior" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={visiblePage === 1} className="rounded-lg p-2 text-on-surface-variant disabled:opacity-30"><span className="material-symbols-outlined">chevron_left</span></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => setCurrentPage(page)} aria-label={`Página ${page}`} aria-current={visiblePage === page ? "page" : undefined} className={`h-8 w-8 rounded-lg text-sm font-semibold ${visiblePage === page ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}>{page}</button>)}<button type="button" aria-label="Página siguiente" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={visiblePage === totalPages} className="rounded-lg p-2 text-on-surface-variant disabled:opacity-30"><span className="material-symbols-outlined">chevron_right</span></button></div></div>
      </>}
    </AdminLayout>
  )
}
