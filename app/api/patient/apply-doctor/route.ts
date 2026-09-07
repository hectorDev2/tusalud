/**
 * POST /api/patient/apply-doctor
 * A patient submits an application to become a doctor.
 * Creates a doctor_approvals record linked to their user_id for admin review.
 */
import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"
import { requirePatient } from "@/lib/route-auth"

export async function POST(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { user } = auth.auth

  const profile = auth.auth.profile

  const body = await request.json()
  const { specialty } = body

  if (!specialty?.trim()) {
    return Response.json(err("La especialidad es requerida"), { status: 400 })
  }

  const sb = getServiceClient()

  // Check for existing pending application
  const { data: existing } = await sb
    .from("doctor_approvals")
    .select("id, status")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    const msg = existing.status === "pending"
      ? "Ya tenés una solicitud pendiente de revisión"
      : "Tu solicitud ya fue procesada"
    return Response.json(err(msg), { status: 409 })
  }

  const { data: approval, error } = await sb
    .from("doctor_approvals")
    .insert({
      user_id: user.id,
      name: profile.name,
      email: user.email ?? "",
      specialty: specialty.trim(),
      status: "pending",
    })
    .select("id, name, specialty, status, created_at")
    .single()

  if (error) return Response.json(err(error.message), { status: 500 })

  // Audit
  await sb.rpc("log_audit", {
    p_actor_id: user.id,
    p_action: "doctor.applied",
    p_resource_type: "doctor_approval",
    p_resource_id: approval.id,
    p_metadata: { specialty: specialty.trim() },
  })

  return Response.json(ok({ approval }), { status: 201 })
}
