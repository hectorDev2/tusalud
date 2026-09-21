import { NextRequest } from "next/server"
import { err, ok } from "@/lib/api-types"
import { requireAdmin, requireAuth } from "@/lib/route-auth"
import { getServiceClient } from "@/lib/supabase"
import type { Database, Json } from "@/lib/database.types"

const BUCKET = "bug-report-attachments"
const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024
const allowedPriorities = ["low", "normal", "high", "critical"] as const
const allowedStatuses = ["open", "in_progress", "resolved", "closed"] as const

type BugReportPriority = Database["public"]["Enums"]["bug_report_priority"]
type BugReportStatus = Database["public"]["Enums"]["bug_report_status"]

function isPriority(value: string): value is BugReportPriority {
  return allowedPriorities.includes(value as BugReportPriority)
}

function isStatus(value: string): value is BugReportStatus {
  return allowedStatuses.includes(value as BugReportStatus)
}

function parseErrorContext(value: FormDataEntryValue | null): Json | null {
  if (typeof value !== "string" || !value.trim()) return null

  try {
    const parsed = JSON.parse(value) as unknown
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null
    return parsed as Record<string, Json | undefined>
  } catch {
    return { message: value.slice(0, 2000) }
  }
}

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").slice(-120) || "captura"
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request)
  if (!auth.ok) return auth.response

  const form = await request.formData()
  const title = String(form.get("title") ?? "").trim()
  const description = String(form.get("description") ?? "").trim()
  const priorityValue = String(form.get("priority") ?? "normal").trim()
  const pageUrl = String(form.get("pageUrl") ?? "").trim().slice(0, 1000) || null
  const userAgent = String(form.get("userAgent") ?? "").trim().slice(0, 1000) || null
  const attachment = form.get("attachment")

  if (title.length < 3 || title.length > 160) {
    return Response.json(err("El título debe tener entre 3 y 160 caracteres"), { status: 400 })
  }

  if (description.length < 10 || description.length > 10000) {
    return Response.json(err("La descripción debe tener entre 10 y 10.000 caracteres"), { status: 400 })
  }

  if (!isPriority(priorityValue)) {
    return Response.json(err("La prioridad no es válida"), { status: 400 })
  }

  let attachmentPath: string | null = null
  let attachmentName: string | null = null
  let attachmentMimeType: string | null = null
  let attachmentSize: number | null = null
  const service = getServiceClient()

  if (attachment instanceof File && attachment.size > 0) {
    if (!attachment.type.startsWith("image/")) {
      return Response.json(err("El archivo adjunto debe ser una imagen"), { status: 400 })
    }

    if (attachment.size > MAX_ATTACHMENT_SIZE) {
      return Response.json(err("La imagen no puede superar los 5 MB"), { status: 400 })
    }

    attachmentName = attachment.name.slice(0, 180)
    attachmentMimeType = attachment.type
    attachmentSize = attachment.size
    attachmentPath = `${auth.auth.user.id}/${crypto.randomUUID()}-${safeFileName(attachment.name)}`

    const { error: uploadError } = await service.storage
      .from(BUCKET)
      .upload(attachmentPath, await attachment.arrayBuffer(), {
        contentType: attachment.type,
        upsert: false,
      })

    if (uploadError) {
      console.error("Unable to upload bug report attachment", uploadError)
      return Response.json(err("No se pudo guardar la imagen adjunta"), { status: 500 })
    }
  }

  const { data: report, error } = await service
    .from("bug_reports")
    .insert({
      reporter_id: auth.auth.user.id,
      title,
      description,
      priority: priorityValue,
      page_url: pageUrl,
      user_agent: userAgent,
      error_context: parseErrorContext(form.get("errorContext")),
      attachment_path: attachmentPath,
      attachment_name: attachmentName,
      attachment_mime_type: attachmentMimeType,
      attachment_size: attachmentSize,
    })
    .select("id, title, priority, status, created_at")
    .single()

  if (error || !report) {
    if (attachmentPath) await service.storage.from(BUCKET).remove([attachmentPath])
    console.error("Unable to create bug report", error)
    return Response.json(err("No se pudo registrar el reporte"), { status: 500 })
  }

  return Response.json(ok({ report }), { status: 201 })
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  const requestedStatus = new URL(request.url).searchParams.get("status")
  if (requestedStatus && !isStatus(requestedStatus)) {
    return Response.json(err("El estado no es válido"), { status: 400 })
  }
  const status = requestedStatus && isStatus(requestedStatus) ? requestedStatus : null

  const service = getServiceClient()
  let query = service
    .from("bug_reports")
    .select("*, reporter:reporter_id(id, name, role)")
    .order("created_at", { ascending: false })
    .limit(100)

  if (status) query = query.eq("status", status)

  const { data: reports, error } = await query
  if (error) {
    console.error("Unable to load bug reports", error)
    return Response.json(err("No se pudieron cargar los reportes"), { status: 500 })
  }

  const withUrls = await Promise.all((reports ?? []).map(async (report) => {
    let attachmentUrl: string | null = null
    if (report.attachment_path) {
      const { data } = await service.storage.from(BUCKET).createSignedUrl(report.attachment_path, 3600)
      attachmentUrl = data?.signedUrl ?? null
    }
    return { ...report, attachment_url: attachmentUrl }
  }))

  return Response.json(ok({ reports: withUrls }))
}
