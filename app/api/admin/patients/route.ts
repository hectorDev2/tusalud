import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"
import { requireAdmin } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  const sb = getServiceClient()

  const { data: patients, error } = await sb
    .from("patient_records")
    .select("*")

  if (error) return Response.json(err("No se pudieron cargar los pacientes"), { status: 500 })

  return Response.json(ok({ patients: patients || [] }))
}
