import { NextRequest, NextResponse } from "next/server"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"
import { getAuthProfile } from "@/lib/auth-profile"
import type { Database } from "@/lib/database.types"

export type AppRole = Database["public"]["Enums"]["user_role"]

type Profile = Pick<Database["public"]["Tables"]["profiles"]["Row"], "id" | "name" | "role">

export type AuthContext = {
  supabase: ReturnType<typeof createRouteClient>
  user: SupabaseUser
  profile: Profile
}

export type AuthResult =
  | { ok: true; auth: AuthContext }
  | { ok: false; response: NextResponse }

function unauthorized(message = "No autorizado") {
  return NextResponse.json(err(message), { status: 401 })
}

function forbidden(message = "Acceso denegado") {
  return NextResponse.json(err(message), { status: 403 })
}

/** Authenticates the request with Supabase Auth and loads the server profile. */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  const supabase = createRouteClient(request)
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return { ok: false, response: unauthorized() }
  }

  const profile = await getAuthProfile(data.user.id)

  if (!profile) {
    return { ok: false, response: forbidden("Perfil no autorizado") }
  }

  return {
    ok: true,
    auth: { supabase, user: data.user, profile },
  }
}

export async function requireRole(
  request: NextRequest,
  role: AppRole,
): Promise<AuthResult> {
  const result = await requireAuth(request)
  if (!result.ok) return result

  if (result.auth.profile.role !== role) {
    return { ok: false, response: forbidden() }
  }

  return result
}

export function requireAdmin(request: NextRequest) {
  return requireRole(request, "admin")
}

export function requireDoctor(request: NextRequest) {
  return requireRole(request, "doctor")
}

export function requirePatient(request: NextRequest) {
  return requireRole(request, "patient")
}
