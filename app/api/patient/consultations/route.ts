import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const consultations = store.getPatientConsultations()
  return Response.json(ok({ consultations }))
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { reason, severity } = body

  if (!reason) {
    return Response.json(err("El motivo de la consulta es requerido"), { status: 400 })
  }

  const consultation = store.createConsultation({ reason, severity })
  return Response.json(ok({ consultation }), { status: 201 })
}
