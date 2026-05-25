import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { data: agenda } = await supabase
    .from("agenda_slots")
    .select("*")
    .order("time", { ascending: true })

  return Response.json(ok({ agenda: agenda || [] }))
}
