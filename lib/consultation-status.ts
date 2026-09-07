// Shared status labels/badges for patient-facing consultation lists.
// Mirrors the real `consultation_status` enum from Supabase:
// "pending" | "assigned" | "in_progress" | "closed" | "completed"

export const CONSULTATION_STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "En cola",
    className: "bg-surface-container-high text-on-surface-variant",
  },
  assigned: {
    label: "Médico asignado",
    className: "bg-primary-fixed/30 text-primary",
  },
  in_progress: {
    label: "En curso",
    className: "bg-tertiary-container text-white",
  },
  closed: {
    label: "Cerrada",
    className: "bg-secondary-container text-on-secondary-container",
  },
  completed: {
    label: "Completada",
    className: "bg-secondary-container text-on-secondary-container",
  },
}

export function consultationStatusConfig(status: string) {
  return (
    CONSULTATION_STATUS_CONFIG[status] || {
      label: status,
      className: "bg-surface-container-high text-on-surface-variant",
    }
  )
}

export function isConsultationOpen(status: string) {
  return status === "pending" || status === "assigned" || status === "in_progress"
}

export function formatConsultationDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" })
}

export function formatConsultationTime(iso: string | null | undefined): string {
  if (!iso) return ""
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ""
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
}
