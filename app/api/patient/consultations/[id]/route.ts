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
    .select("*, doctor:doctor_id(id, name, specialty, avatar, rating, available)")
    .eq("id", id)
    .single()

  if (!consultation) {
    return Response.json(err("Consulta no encontrada"), { status: 404 })
  }

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", id)
    .eq("user_id", session.user.id)

  return Response.json(ok({ consultation, messages: messages || [] }))
}
