"use client"

import { useEffect, useMemo, useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { ListSkeleton } from "@/components/skeleton"

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

interface PatientRecord {
  id: string
  name: string | null
  email: string | null
  age: number | null
  last_consultation: string | null
  status: string | null
}

const avatarColors = [
  "bg-primary-fixed/30 text-primary",
  "bg-tertiary-fixed/30 text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-surface-container-high text-on-surface-variant",
]

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").toUpperCase().slice(0, 2) || "??"
}

function formatLastConsultation(value: string | null): string {
  if (!value) return "Sin registro"
  const timestamp = Date.parse(value)
  return !Number.isNaN(timestamp) && value.includes("T")
    ? new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" }).format(timestamp)
    : value
}

function PatientAvatar({ name, index }: { name: string; index: number }) {
  return <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-headline text-sm font-bold ${avatarColors[index % avatarColors.length]}`}>{getInitials(name)}</div>
}

export default function PatientRecordsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const pageSize = 6

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/patients")
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || !json.ok) throw new Error(json.error || "No se pudieron cargar los pacientes")
        return json
      })
      .then((json) => {
        if (!cancelled) {
          setPatients(json.data?.patients ?? [])
          setError(null)
        }
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : "No se pudieron cargar los pacientes")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [retryCount])

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return patients
    return patients.filter((patient) => [patient.name, patient.email, patient.id].filter(Boolean).some((value) => value!.toLowerCase().includes(query)))
  }, [patients, search])
  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize))
  const visiblePage = Math.min(currentPage, totalPages)
  const visiblePatients = filteredPatients.slice((visiblePage - 1) * pageSize, visiblePage * pageSize)
  const withConsultation = patients.filter((patient) => patient.last_consultation).length
  const withoutConsultation = patients.length - withConsultation
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => totalPages <= 5 || page === 1 || page === totalPages || Math.abs(page - visiblePage) <= 1)

  function retryLoading() {
    setError(null)
    setLoading(true)
    setRetryCount((count) => count + 1)
  }

  function renderStatus(patient: PatientRecord) {
    const active = patient.status?.toLowerCase() === "activo"
    return <span className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold ${active ? "bg-tertiary-fixed/30 text-tertiary" : "bg-surface-container-high text-on-surface-variant"}`}><span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-tertiary" : "bg-outline"}`} />{active ? "Activo" : "Sin actividad"}</span>
  }

  return (
    <AdminLayout title="Panel de Administración" subtitle="Control de Sistemas de Salud" sidebarItems={sidebarItems} bottomNavItems={bottomNavItems}>
      <div className="pb-6 pt-6"><h1 className="font-headline text-2xl font-bold text-on-surface md:text-3xl">Registros de Pacientes</h1><p className="mt-1 text-sm text-on-surface-variant md:text-base">Visualiza y gestiona los perfiles de pacientes registrados en la plataforma.</p></div>
      <div className="relative mb-6"><span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-lg text-on-surface-variant">search</span><input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} placeholder="Busca por nombre, email o ID..." aria-label="Buscar pacientes" className="h-12 w-full rounded-2xl border border-outline-variant bg-surface-container-lowest pl-11 pr-4 font-body text-sm text-on-surface shadow-sm placeholder:text-on-surface-variant/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim" /></div>

      {!loading && !error && <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">{[
        ["Pacientes registrados", patients.length, "group", "text-primary", "bg-primary-fixed/30"],
        ["Con consulta registrada", withConsultation, "stethoscope", "text-tertiary", "bg-tertiary-fixed/30"],
        ["Sin consulta registrada", withoutConsultation, "event_busy", "text-secondary", "bg-secondary-container"],
      ].map(([label, value, icon, color, bg]) => <div key={label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm md:p-6"><div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}><span className={`material-symbols-outlined ${color}`}>{icon}</span></div><p className="font-headline text-2xl font-bold text-on-surface md:text-3xl">{value}</p><p className="mt-1 text-sm text-on-surface-variant">{label}</p></div>)}</div>}

      {loading ? <ListSkeleton count={5} /> : error ? <div className="rounded-2xl border border-error/30 bg-error-container p-8 text-center"><span className="material-symbols-outlined text-4xl text-error">cloud_off</span><p className="mt-2 text-sm text-on-error-container">{error}</p><button type="button" onClick={retryLoading} className="mt-4 rounded-xl bg-error px-4 py-2 text-sm font-semibold text-on-error">Reintentar</button></div> : visiblePatients.length === 0 ? <div className="rounded-2xl bg-surface-container-low p-8 text-center"><span className="material-symbols-outlined text-4xl text-on-surface-variant/50">person_search</span><p className="mt-2 text-sm text-on-surface-variant">{search ? "No encontramos pacientes con esa búsqueda." : "Todavía no hay pacientes registrados."}</p></div> : <>
        <div className="hidden overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm md:block"><div className="overflow-x-auto"><table className="w-full min-w-[600px]"><thead><tr className="border-b border-surface-container"><th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Paciente</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Email</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Edad</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Última consulta</th><th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Estado</th></tr></thead><tbody>{visiblePatients.map((patient, index) => { const name = patient.name || "Paciente sin nombre"; return <tr key={patient.id} className="border-b border-surface-container/50 last:border-0 hover:bg-surface-container-low"><td className="px-6 py-4"><div className="flex items-center gap-3"><PatientAvatar name={name} index={index} /><span className="text-sm font-semibold text-on-surface">{name}</span></div></td><td className="px-6 py-4 text-sm text-on-surface-variant">{patient.email || "Sin email"}</td><td className="px-6 py-4 text-sm text-on-surface-variant">{patient.age == null ? "-" : `${patient.age} años`}</td><td className="px-6 py-4 text-sm text-on-surface-variant">{formatLastConsultation(patient.last_consultation)}</td><td className="px-6 py-4">{renderStatus(patient)}</td></tr> })}</tbody></table></div></div>
        <div className="space-y-4 md:hidden">{visiblePatients.map((patient, index) => { const name = patient.name || "Paciente sin nombre"; return <div key={patient.id} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><div className="mb-4 flex items-center justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><PatientAvatar name={name} index={index} /><div className="min-w-0"><p className="truncate text-sm font-semibold text-on-surface">{name}</p><p className="truncate text-xs text-on-surface-variant">{patient.email || "Sin email"}</p></div></div>{renderStatus(patient)}</div><div className="grid grid-cols-2 gap-3 text-sm"><div><p className="text-xs text-on-surface-variant">Edad</p><p className="font-medium text-on-surface">{patient.age == null ? "-" : `${patient.age} años`}</p></div><div><p className="text-xs text-on-surface-variant">Última consulta</p><p className="font-medium text-on-surface">{formatLastConsultation(patient.last_consultation)}</p></div></div></div> })}</div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-sm text-on-surface-variant">Mostrando <span className="font-semibold text-on-surface">{visiblePatients.length}</span> de <span className="font-semibold text-on-surface">{filteredPatients.length}</span> pacientes</p><div className="flex items-center gap-1"><button type="button" aria-label="Página anterior" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={visiblePage === 1} className="rounded-lg p-2 text-on-surface-variant disabled:opacity-30"><span className="material-symbols-outlined text-lg">chevron_left</span></button>{pageNumbers.map((page, index) => { const previous = pageNumbers[index - 1]; return <span key={page} className="flex items-center">{previous && page - previous > 1 && <span className="px-1 text-sm text-on-surface-variant">...</span>}<button type="button" onClick={() => setCurrentPage(page)} aria-label={`Página ${page}`} aria-current={visiblePage === page ? "page" : undefined} className={`h-8 w-8 rounded-lg text-sm font-semibold ${visiblePage === page ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low"}`}>{page}</button></span> })}<button type="button" aria-label="Página siguiente" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={visiblePage === totalPages} className="rounded-lg p-2 text-on-surface-variant disabled:opacity-30"><span className="material-symbols-outlined text-lg">chevron_right</span></button></div></div>
      </>}
    </AdminLayout>
  )
}
