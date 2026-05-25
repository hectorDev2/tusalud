import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { id } = await params

  const { data: consultation } = await supabase
    .from("consultations")
    .select("*, patient:patient_id(*)")
    .eq("id", id)
    .single()

  if (!consultation) {
    return Response.json(err("Consulta no encontrada"), { status: 404 })
  }

  return Response.json(ok({ consultation }))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { status } = body

  const { data: consultation, error } = await supabase
    .from("consultations")
    .update({ status })
    .eq("id", id)
    .select("*, patient:patient_id(*)")
    .single()

  if (error || !consultation) {
    return Response.json(err("Consulta no encontrada"), { status: 404 })
  }

  return Response.json(ok({ consultation }))
}
