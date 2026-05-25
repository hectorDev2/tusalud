import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sb = getServiceClient()

  const { data: approval, error } = await sb
    .from("doctor_approvals")
    .update({ status: "verified" })
    .eq("id", id)
    .select()
    .single()

  if (error || !approval) {
    return Response.json(err("Solicitud no encontrada"), { status: 404 })
  }

  return Response.json(ok({ approval }))
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const sb = getServiceClient()

  const { error } = await sb
    .from("doctor_approvals")
    .delete()
    .eq("id", id)

  if (error) {
    return Response.json(err("Solicitud no encontrada"), { status: 404 })
  }

  return Response.json(ok({ message: "Solicitud rechazada y eliminada" }))
}
