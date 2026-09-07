import { NextRequest } from "next/server"
import { ok } from "@/lib/api-types"
import { requirePatient } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const [{ data: balance }, { data: transactions }] = await Promise.all([
    supabase.rpc("get_token_balance", { p_user_id: user.id }),
    supabase
      .from("token_transactions")
      .select("id, type, amount, description, detail, created_at, reference_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
  ])

  return Response.json(ok({ balance: balance ?? 0, transactions: transactions ?? [] }))
}
