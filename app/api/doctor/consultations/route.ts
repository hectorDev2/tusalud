import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requireDoctor } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  // Doctor sees consultations assigned to them (or pending/unassigned)
  const { searchParams } = new URL(request.url)
  const filter = searchParams.get("filter") ?? "assigned" // "assigned" | "pending" | "all"

  if (filter === "pending") {
    const { data: pending, error } = await supabase.rpc("list_pending_consultations")

    if (error) return Response.json(err("No se pudieron cargar las consultas pendientes"), { status: 500 })

    const consultations = (pending ?? []).map((consultation) => ({
      id: consultation.id,
      status: consultation.status,
      reason: consultation.reason,
      severity: consultation.severity,
      intake: consultation.intake,
      created_at: consultation.created_at,
      assigned_at: consultation.assigned_at,
      closed_at: consultation.closed_at,
      assigned_doctor_id: null,
      patient: {
        id: consultation.patient_id,
        name: consultation.patient_name,
        avatar: consultation.patient_avatar,
      },
    }))

    return Response.json(ok({ consultations }))
  }

  let query = supabase
    .from("consultations")
    .select(`
      id, status, reason, severity, intake, created_at, assigned_at, closed_at,
      patient:patient_id(id, name, avatar)
    `)
    .order("created_at", { ascending: false })

  if (filter === "assigned") {
    query = query.eq("assigned_doctor_id", user.id)
  }
  // "all" returns everything (admin-like view for doctors)

  const { data: consultations, error } = await query

  if (error) return Response.json(err("No se pudieron cargar las consultas"), { status: 500 })

  return Response.json(ok({ consultations: consultations ?? [] }))
}
