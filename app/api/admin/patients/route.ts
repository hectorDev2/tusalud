import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const sb = getServiceClient()

  const { data: patients } = await sb
    .from("patient_records")
    .select("*")

  return Response.json(ok({ patients: patients || [] }))
}
