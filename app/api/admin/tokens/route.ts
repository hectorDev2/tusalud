import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"
import { requireAdmin } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  const sb = getServiceClient()

  const { data: transactions, error } = await sb
    .from("token_transactions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return Response.json(err("No se pudieron cargar las transacciones"), { status: 500 })

  return Response.json(ok({ transactions: transactions || [] }))
}
