import { NextRequest } from "next/server"
import { ok } from "@/lib/api-types"
import { requirePatient } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return Response.json(ok({ messages: messages || [] }))
}
