import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requirePatient } from "@/lib/route-auth"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { id } = await params

  const { data: consultation } = await supabase
    .from("consultations")
    .select(`
      id, status, reason, severity, intake, created_at, assigned_at, closed_at,
      closure_summary, requires_formal_consultation,
      doctor:assigned_doctor_id(id, name, specialty, avatar)
    `)
    .eq("id", id)
    .eq("patient_id", user.id)
    .single()

  if (!consultation) return Response.json(err("Consulta no encontrada"), { status: 404 })

  return Response.json(ok({ consultation }))
}
