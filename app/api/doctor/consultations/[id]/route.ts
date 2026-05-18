import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const consultation = store.getConsultation(id)

  if (!consultation) {
    return Response.json(err("Consulta no encontrada"), { status: 404 })
  }

  return Response.json(ok({ consultation }))
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { status } = body

  const consultation = store.updateConsultationStatus(id, status)

  if (!consultation) {
    return Response.json(err("Consulta no encontrada"), { status: 404 })
  }

  return Response.json(ok({ consultation }))
}
