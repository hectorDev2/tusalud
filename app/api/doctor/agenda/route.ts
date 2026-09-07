import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requireDoctor } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase } = auth.auth

  const { data: agenda, error } = await supabase
    .from("agenda_slots")
    .select("*")
    .order("time", { ascending: true })

  if (error) return Response.json(err("No se pudo cargar la agenda"), { status: 500 })

  return Response.json(ok({ agenda: agenda || [] }))
}
