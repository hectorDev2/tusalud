import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const approval = store.approveDoctor(id)

  if (!approval) {
    return Response.json(err("Solicitud no encontrada"), { status: 404 })
  }

  return Response.json(ok({ approval }))
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  store.rejectDoctor(id)
  return Response.json(ok({ message: "Solicitud rechazada y eliminada" }))
}
