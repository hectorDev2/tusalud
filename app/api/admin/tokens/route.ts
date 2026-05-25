import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const sb = getServiceClient()

  const { data: transactions } = await sb
    .from("token_transactions")
    .select("*")
    .order("created_at", { ascending: false })

  return Response.json(ok({ transactions: transactions || [] }))
}
