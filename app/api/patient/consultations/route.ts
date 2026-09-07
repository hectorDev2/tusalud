import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requirePatient } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { data: consultations } = await supabase
    .from("consultations")
    .select(`
      id, status, reason, severity, intake, created_at, assigned_at, closed_at,
      doctor:assigned_doctor_id(id, name, specialty, avatar, rating, available)
    `)
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })

  return Response.json(ok({ consultations: consultations ?? [] }))
}

export async function POST(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const body = await request.json()
  const { reason, severity = "low", specialty } = body

  if (!reason?.trim()) {
    return Response.json(err("El motivo de la consulta es requerido"), { status: 400 })
  }

  const intake = {
    chief_complaint: reason.trim(),
    severity,
    specialty: specialty ?? null,
    started_at: new Date().toISOString(),
  }

  // Atomic: verify token balance, debit 1 token, create consultation
  const { data: consultationId, error } = await supabase.rpc("start_consultation", {
    p_patient_id: user.id,
    p_reason: reason.trim(),
    p_severity: severity,
    p_intake: intake,
  })

  if (error) {
    if (error.message.includes("SIN_TOKENS")) {
      return Response.json(
        err("No tenés tokens disponibles. Esperá la asignación semanal o comprá más tokens."),
        { status: 422 }
      )
    }
    return Response.json(err(error.message), { status: 500 })
  }

  // Fetch the created consultation to return to the client
  const { data: consultation } = await supabase
    .from("consultations")
    .select(`
      id, status, reason, severity, intake, created_at, assigned_at,
      doctor:assigned_doctor_id(id, name, specialty, avatar, rating, available)
    `)
    .eq("id", consultationId)
    .single()

  return Response.json(ok({ consultation }), { status: 201 })
}
