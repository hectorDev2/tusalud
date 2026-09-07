import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"
import { requireAdmin } from "@/lib/route-auth"

// POST /api/admin/grant-tokens { userId, amount }
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  let body: { userId?: unknown; amount?: unknown; description?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json(err("El cuerpo de la solicitud no es válido"), { status: 400 })
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : ""
  const amount = body.amount === undefined ? 100 : body.amount
  const description = body.description === undefined ? "Grant manual de tokens" : body.description

  if (!userId) return Response.json(err("userId requerido"), { status: 400 })
  if (typeof amount !== "number" || !Number.isInteger(amount) || amount <= 0) {
    return Response.json(err("amount debe ser un entero positivo"), { status: 400 })
  }
  if (typeof description !== "string" || !description.trim()) {
    return Response.json(err("description debe ser texto no vacío"), { status: 400 })
  }

  const sb = getServiceClient()
  const { data: target } = await sb.from("profiles").select("id").eq("id", userId).single()
  if (!target) return Response.json(err("Usuario no encontrado"), { status: 404 })

  const { error } = await sb.from("token_transactions").insert({
    user_id: userId,
    type: "credit",
    amount,
    description: description.trim(),
    detail: `Otorgado por admin ${auth.auth.user.id}`,
  })

  if (error) return Response.json(err(error.message), { status: 500 })

  return Response.json(ok({ granted: amount }))
}
