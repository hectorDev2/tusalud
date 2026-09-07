import { NextRequest } from "next/server"
import { err, ok } from "@/lib/api-types"
import { requireDoctor } from "@/lib/route-auth"

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: NextRequest, { params }: RouteContext) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response

  const { id } = await params
  if (!id) {
    return Response.json(err("Se requiere el identificador de la consulta"), { status: 400 })
  }

  const { data: consultationId, error } = await auth.auth.supabase.rpc(
    "claim_pending_consultation",
    { p_consultation_id: id },
  )

  if (error) {
    console.error("Unable to claim pending consultation", { consultationId: id, error })

    if (error.code === "PGRST116") {
      return Response.json(err("La consulta no existe o ya no está disponible"), { status: 404 })
    }

    if (error.code === "P0001" || error.code === "23505") {
      return Response.json(err("La consulta ya fue reclamada por otro médico"), { status: 409 })
    }

    return Response.json(err("No se pudo reclamar la consulta"), { status: 500 })
  }

  return Response.json(ok({ consultationId: consultationId ?? id }))
}
