import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"
import { requireAdmin } from "@/lib/route-auth"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response
  const adminId = auth.auth.user.id

  const { id } = await params
  const sb = getServiceClient()

  // Fetch the approval record (must have user_id to promote)
  const { data: approval } = await sb
    .from("doctor_approvals")
    .select("id, user_id, name, specialty, email, status")
    .eq("id", id)
    .single()

  if (!approval) return Response.json(err("Solicitud no encontrada"), { status: 404 })
  if (approval.status === "verified") {
    return Response.json(err("Esta solicitud ya fue aprobada"), { status: 409 })
  }

  // 1. Mark approval as verified
  const { error: approvalError } = await sb
    .from("doctor_approvals")
    .update({ status: "verified" })
    .eq("id", id)

  if (approvalError) return Response.json(err(approvalError.message), { status: 500 })

  // 2. Promote user role to doctor (if user_id is linked)
  if (approval.user_id) {
    const { error: profileError } = await sb
      .from("profiles")
      .update({
        role: "doctor",
        specialty: approval.specialty,
      })
      .eq("id", approval.user_id)

    if (profileError) {
      return Response.json(err(`Aprobación guardada pero no se pudo cambiar el rol: ${profileError.message}`), { status: 500 })
    }

    // 3. Audit
    await sb.rpc("log_audit", {
      p_actor_id: adminId,
      p_action: "doctor.approved",
      p_resource_type: "profile",
      p_resource_id: approval.user_id,
      p_metadata: { approval_id: id, doctor_name: approval.name, specialty: approval.specialty },
    })
  }

  return Response.json(ok({
    approval: { ...approval, status: "verified" },
    role_updated: !!approval.user_id,
  }))
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response
  const adminId = auth.auth.user.id

  const { id } = await params
  const sb = getServiceClient()

  const { data: approval } = await sb
    .from("doctor_approvals")
    .select("id, user_id, name")
    .eq("id", id)
    .single()

  if (!approval) return Response.json(err("Solicitud no encontrada"), { status: 404 })

  const { error } = await sb.from("doctor_approvals").delete().eq("id", id)
  if (error) return Response.json(err(error.message), { status: 500 })

  // Audit
  await sb.rpc("log_audit", {
    p_actor_id: adminId,
    p_action: "doctor.rejected",
    p_resource_type: "doctor_approval",
    p_resource_id: null,
    p_metadata: { approval_id: id, doctor_name: approval.name, user_id: approval.user_id },
  })

  return Response.json(ok({ message: "Solicitud rechazada" }))
}
