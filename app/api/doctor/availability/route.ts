import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requireDoctor } from "@/lib/route-auth"

// GET: returns current availability state
export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { data: profile } = await supabase
    .from("profiles")
    .select("available, last_ui_activity_at")
    .eq("id", user.id)
    .single()

  return Response.json(ok({ available: profile?.available ?? false }))
}

// PATCH: toggle availability + update heartbeat
export async function PATCH(request: NextRequest) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const body = await request.json()
  const { available } = body

  if (typeof available !== "boolean") {
    return Response.json(err("'available' debe ser boolean"), { status: 400 })
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      available,
      last_ui_activity_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .eq("role", "doctor")

  if (error) return Response.json(err(error.message), { status: 500 })

  return Response.json(ok({ available }))
}

// POST: heartbeat only (no availability change)
export async function POST(request: NextRequest) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { error } = await supabase.rpc("doctor_heartbeat", { p_doctor_id: user.id })
  if (error) return Response.json(err("No se pudo actualizar la actividad"), { status: 500 })

  return Response.json(ok({ beat: true }))
}
