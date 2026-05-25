import { NextRequest, NextResponse } from "next/server"
import { ok, err, type AuthResponse } from "@/lib/api-types"
import { createRouteClientWithResponse } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(err("Email y contraseña son requeridos"), { status: 400 })
  }

  const { supabase, response: supabaseResponse } = createRouteClientWithResponse(request)

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json(err("Credenciales inválidas"), { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", data.user.id)
    .single()

  if (!profile) {
    return NextResponse.json(err("Perfil no encontrado"), { status: 404 })
  }

  const user = {
    id: profile.id,
    email: data.user.email!,
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar || "",
    token: data.session.access_token,
  }

  const response = NextResponse.json(ok<AuthResponse>({ user }))

  // Copy Supabase auth cookies from the intermediate response
  for (const { name, value } of supabaseResponse.cookies.getAll()) {
    response.cookies.set(name, value)
  }

  return response
}
