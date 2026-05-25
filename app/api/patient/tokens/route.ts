import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { data: transactions } = await supabase
    .from("token_transactions")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  const { count: totalCredit } = await supabase
    .from("token_transactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("type", "credit")

  const { count: totalDebit } = await supabase
    .from("token_transactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", session.user.id)
    .eq("type", "debit")

  const balance = (totalCredit || 0) * 3 - (totalDebit || 0)

  return Response.json(ok({ balance, transactions: transactions || [] }))
}
