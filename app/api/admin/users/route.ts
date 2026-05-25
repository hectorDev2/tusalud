import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const sb = getServiceClient()

  const { data: users } = await sb
    .from("users_view")
    .select("*")

  return Response.json(ok({ users: users || [] }))
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return Response.json(err("userId es requerido"), { status: 400 })
  }

  const sb = getServiceClient()

  const { data: profile } = await sb
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (!profile) {
    return Response.json(err("Usuario no encontrado"), { status: 404 })
  }

  return Response.json(ok({ user: { id: userId, ...profile } }))
}
