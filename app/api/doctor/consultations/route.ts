import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { data: consultations } = await supabase
    .from("consultations")
    .select("*, patient:patient_id(id, name, age, gender, avatar, blood_pressure, heart_rate, allergies, medications)")
    .order("created_at", { ascending: false })

  return Response.json(ok({ consultations: consultations || [] }))
}
