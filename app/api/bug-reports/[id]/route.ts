import { NextRequest } from "next/server"
import { err, ok } from "@/lib/api-types"
import { requireAdmin } from "@/lib/route-auth"
import { getServiceClient } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

const allowedStatuses = ["open", "in_progress", "resolved", "closed"] as const
const allowedPriorities = ["low", "normal", "high", "critical"] as const

type BugReportStatus = Database["public"]["Enums"]["bug_report_status"]
type BugReportPriority = Database["public"]["Enums"]["bug_report_priority"]

function isStatus(value: string): value is BugReportStatus {
  return allowedStatuses.includes(value as BugReportStatus)
}

function isPriority(value: string): value is BugReportPriority {
  return allowedPriorities.includes(value as BugReportPriority)
}

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  const { id } = await params
  let body: { status?: unknown; priority?: unknown; adminNotes?: unknown }

  try {
    body = await request.json()
  } catch {
    return Response.json(err("El cuerpo de la solicitud no es válido"), { status: 400 })
  }

  const update: Database["public"]["Tables"]["bug_reports"]["Update"] = {}

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !isStatus(body.status)) {
      return Response.json(err("El estado no es válido"), { status: 400 })
    }
    update.status = body.status
    update.resolved_at = body.status === "resolved" || body.status === "closed"
      ? new Date().toISOString()
      : null
  }

  if (body.priority !== undefined) {
    if (typeof body.priority !== "string" || !isPriority(body.priority)) {
      return Response.json(err("La prioridad no es válida"), { status: 400 })
    }
    update.priority = body.priority
  }

  if (body.adminNotes !== undefined) {
    if (typeof body.adminNotes !== "string" || body.adminNotes.length > 5000) {
      return Response.json(err("Las notas no pueden superar los 5.000 caracteres"), { status: 400 })
    }
    update.admin_notes = body.adminNotes.trim() || null
  }

  if (Object.keys(update).length === 0) {
    return Response.json(err("No hay cambios para guardar"), { status: 400 })
  }

  const { data: report, error } = await getServiceClient()
    .from("bug_reports")
    .update(update)
    .eq("id", id)
    .select("id, status, priority, admin_notes, resolved_at, updated_at")
    .single()

  if (error || !report) {
    return Response.json(err("No se pudo actualizar el reporte"), { status: error?.code === "PGRST116" ? 404 : 500 })
  }

  return Response.json(ok({ report }))
}
