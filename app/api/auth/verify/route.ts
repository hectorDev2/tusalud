import { NextRequest, NextResponse } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient, createRouteClientWithResponse } from "@/lib/supabase"
import { ensureAuthProfile } from "@/lib/auth-profile"

export async function GET(request: NextRequest) {
  const { supabase, response: supabaseResponse } = createRouteClientWithResponse(request)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(err("Sesión no encontrada"), { status: 401 })
  }

  const profile = await ensureAuthProfile(user)

  if (!profile) {
    return NextResponse.json(err("Perfil no encontrado"), { status: 404 })
  }

  const result = NextResponse.json(ok({ role: profile.role }))
  for (const cookie of supabaseResponse.cookies.getAll()) {
    result.cookies.set(cookie)
  }

  return result
}

// POST /api/auth/verify
// Resends the Supabase signup confirmation email to the given address.
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email } = body

  if (!email?.trim()) {
    return Response.json(err("El email es requerido"), { status: 400 })
  }

  const supabase = createRouteClient(request)

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email.trim(),
  })

  if (error) {
    return Response.json(err(error.message), { status: 400 })
  }

  return Response.json(ok({ message: "Email de verificación reenviado", email }))
}
