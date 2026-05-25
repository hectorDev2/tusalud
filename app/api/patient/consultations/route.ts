import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { data: consultations } = await supabase
    .from("consultations")
    .select("*, doctor:doctor_id(id, name, specialty, avatar, rating, available)")
    .order("created_at", { ascending: false })

  return Response.json(ok({ consultations: consultations || [] }))
}

export async function POST(request: NextRequest) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const body = await request.json()
  const { reason, severity } = body

  if (!reason) {
    return Response.json(err("El motivo de la consulta es requerido"), { status: 400 })
  }

  const { data: doctor } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "doctor")
    .limit(1)
    .single()

  const { data: consultation, error } = await supabase
    .from("consultations")
    .insert({
      patient_id: session.user.id,
      doctor_id: doctor?.id || session.user.id,
      type: "Consulta General",
      status: "pending",
      date: "Hoy",
      time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      reason,
      severity: severity || "low",
    })
    .select("*, doctor:doctor_id(id, name, specialty, avatar, rating, available)")
    .single()

  if (error) return Response.json(err(error.message), { status: 500 })

  return Response.json(ok({ consultation }), { status: 201 })
}
