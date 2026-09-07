import { NextRequest, NextResponse } from "next/server"
import { ok, err, type AuthResponse } from "@/lib/api-types"
import { createRouteClientWithResponse, getServiceClient } from "@/lib/supabase"

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

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", data.user.id)
    .single()

  // If profile doesn't exist or can't be read (RLS issue), create it
  let profile = profileData
  if (!profile || profileError) {
    // Use service role to bypass RLS
    const admin = getServiceClient()

    // First check if it exists with admin
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, name, role, avatar")
      .eq("id", data.user.id)
      .single()

    if (existingProfile) {
      profile = existingProfile
    } else {
      // Create it
      const { error: insertError } = await admin
        .from("profiles")
        .insert({ id: data.user.id, name: data.user.email?.split('@')[0] || 'User', role: 'patient' })

      if (insertError) {
        console.error("Failed to create profile on login:", insertError)
        return NextResponse.json(err("Perfil no encontrado y no se pudo crear"), { status: 404 })
      }

      // Re-fetch profile after creation
      const { data: newProfile } = await admin
        .from("profiles")
        .select("id, name, role, avatar")
        .eq("id", data.user.id)
        .single()

      profile = newProfile
    }
  }

  if (!profile) return Response.json(err("Perfil no encontrado"), { status: 404 })

  const user = {
    id: profile.id,
    email: data.user.email!,
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar || "",
    token: data.session.access_token,
  }

  const response = NextResponse.json(ok<AuthResponse>({ user }))

  // Copy Supabase auth cookies (with all options: httpOnly, path, sameSite, etc.)
  for (const cookie of supabaseResponse.cookies.getAll()) {
    response.cookies.set(cookie)
  }

  // Audit login (fire-and-forget via service role)
  getServiceClient().rpc("log_audit", {
    p_actor_id: profile.id,
    p_action: "auth.login",
    p_resource_type: "profile",
    p_resource_id: profile.id,
    p_metadata: { role: profile.role },
  }).then(() => {})

  return response
}
