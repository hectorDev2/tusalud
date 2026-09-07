import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requireDoctor } from "@/lib/route-auth"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase } = auth.auth

  const { id } = await params

  const { data: consultation, error } = await supabase
    .from("consultations")
    .select(`
      id, status, reason, severity, intake, created_at, assigned_at, closed_at,
      closure_summary, requires_formal_consultation,
      patient:patient_id(id, name, avatar),
      patient_info:patient_id(
        patient_data:patients(
          age, gender, allergies, medications, chronic_conditions,
          blood_type, blood_pressure, heart_rate
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error) return Response.json(err("No se pudo cargar la consulta"), { status: 500 })
  if (!consultation) return Response.json(err("Consulta no encontrada"), { status: 404 })

  return Response.json(ok({ consultation }))
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { id } = await params
  const body = await request.json()
  const { action, closure_summary, requires_formal_consultation } = body

  // Fetch current consultation to validate ownership and state
  const { data: current } = await supabase
    .from("consultations")
    .select("id, status, assigned_doctor_id")
    .eq("id", id)
    .single()

  if (!current) return Response.json(err("Consulta no encontrada"), { status: 404 })

  // Only the assigned doctor can close the consultation
  if (action === "close") {
    if (current.assigned_doctor_id !== user.id) {
      return Response.json(err("Solo el médico asignado puede cerrar esta consulta"), { status: 403 })
    }
    if (current.status === "closed" || current.status === "completed") {
      return Response.json(err("La consulta ya está cerrada"), { status: 409 })
    }
    if (!closure_summary?.trim()) {
      return Response.json(err("El resumen de cierre es requerido"), { status: 400 })
    }

    const { data: updated, error } = await supabase
      .from("consultations")
      .update({
        status: "closed",
        closure_summary: closure_summary.trim(),
        requires_formal_consultation: requires_formal_consultation ?? false,
        closed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, status, closure_summary, requires_formal_consultation, closed_at, patient_id")
      .single()

    if (error) return Response.json(err(error.message), { status: 500 })

    // Audit (fire-and-forget)
    supabase.rpc("log_audit", {
      p_actor_id: user.id,
      p_action: "consultation.closed",
      p_resource_type: "consultation",
      p_resource_id: id,
      p_metadata: {
        patient_id: updated?.patient_id,
        requires_formal_consultation: requires_formal_consultation ?? false,
      },
    }).then(() => {})

    return Response.json(ok({ consultation: updated }))
  }

  // Generic status update (e.g., in_progress)
  const { status } = body
  if (!status) return Response.json(err("Se requiere 'action' o 'status'"), { status: 400 })

  const { data: updated, error } = await supabase
    .from("consultations")
    .update({ status })
    .eq("id", id)
    .eq("assigned_doctor_id", user.id)
    .select("id, status")
    .single()

  if (error || !updated) return Response.json(err("No se pudo actualizar"), { status: 500 })
  return Response.json(ok({ consultation: updated }))
}
