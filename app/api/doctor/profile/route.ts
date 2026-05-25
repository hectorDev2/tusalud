import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const supabase = createRouteClient(request)

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return Response.json(err("No autorizado"), { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  if (!profile) return Response.json(err("Perfil no encontrado"), { status: 404 })

  const user = {
    id: profile.id,
    email: session.user.email || "",
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar || "",
    token: "",
  }

  return Response.json(ok({ user, profile }))
}
