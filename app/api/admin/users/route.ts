import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { getServiceClient } from "@/lib/supabase"
import { requireAdmin } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  // Fetch profiles + auth emails via service client
  const sb = getServiceClient()

  const [profilesRes, authRes] = await Promise.all([
    sb
      .from("profiles")
      .select("id, name, role, specialty, rating, available, created_at")
      .order("created_at", { ascending: false }),
    sb.auth.admin.listUsers({ perPage: 1000 }),
  ])

  if (profilesRes.error || authRes.error) {
    return Response.json(err("No se pudieron cargar los usuarios"), { status: 500 })
  }

  const emailMap = new Map<string, string>()
  for (const u of authRes.data?.users ?? []) {
    emailMap.set(u.id, u.email ?? "")
  }

  const authUsers = authRes.data?.users ?? []
  const users = (profilesRes.data ?? []).map((p) => ({
    ...p,
    email: emailMap.get(p.id) ?? "",
    status: authUsers.find((u) => u.id === p.id)?.banned_until &&
      new Date(authUsers.find((u) => u.id === p.id)!.banned_until!) > new Date()
      ? "suspendido"
      : "activo",
  }))

  return Response.json(ok({ users }))
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) return auth.response

  let body: { userId?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json(err("El cuerpo de la solicitud no es válido"), { status: 400 })
  }

  const userId = typeof body.userId === "string" ? body.userId.trim() : ""
  if (!userId) return Response.json(err("userId requerido"), { status: 400 })
  if (userId === auth.auth.user.id) {
    return Response.json(err("No podés suspender tu propio usuario"), { status: 400 })
  }

  const sb = getServiceClient()
  const { data: target, error: targetError } = await sb.auth.admin.getUserById(userId)
  if (targetError || !target.user) {
    return Response.json(err("Usuario no encontrado"), { status: 404 })
  }

  const isBanned = Boolean(
    target.user.banned_until && new Date(target.user.banned_until) > new Date(),
  )
  const { data: updated, error } = await sb.auth.admin.updateUserById(userId, {
    ban_duration: isBanned ? "none" : "876000h",
  })

  if (error || !updated.user) {
    return Response.json(err("No se pudo actualizar el estado del usuario"), { status: 500 })
  }

  return Response.json(ok({
    userId,
    status: isBanned ? "activo" : "suspendido",
  }))
}
