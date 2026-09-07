import { NextRequest, NextResponse } from "next/server"
import { ok, err, type AuthResponse } from "@/lib/api-types"
import { createRouteClientWithResponse, getServiceClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json(err("Todos los campos son requeridos"), { status: 400 })
  }

  const { supabase, response: supabaseResponse } = createRouteClientWithResponse(request)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role: "patient" },
    },
  })

  if (error) {
    return NextResponse.json(err(error.message), { status: 400 })
  }

  if (!data.user) {
    return NextResponse.json(err("Error al crear usuario"), { status: 500 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", data.user.id)
    .single()

  // If profile doesn't exist or can't be read (RLS issue), create it
  let profileData = profile
  if (!profileData) {
    // Use service role to bypass RLS
    const admin = getServiceClient()

    // First check if it exists with admin
    const { data: existingProfile } = await admin
      .from("profiles")
      .select("id, name, role, avatar")
      .eq("id", data.user.id)
      .single()

    if (existingProfile) {
      profileData = existingProfile
    } else {
      // Create it
      const { error: insertError } = await admin
        .from("profiles")
        .insert({ id: data.user.id, name, role: "patient" })

      if (insertError) {
        console.error("Failed to create profile:", insertError)
      } else {
        // Also ensure patients record exists for patient role
        await admin
          .from("patients")
          .upsert({ id: data.user.id })
          .then(({ error }) => {
            if (error) console.error("Failed to create patient record:", error)
          })
      }

      // Re-fetch profile after creation
      const { data: newProfile } = await admin
        .from("profiles")
        .select("id, name, role, avatar")
        .eq("id", data.user.id)
        .single()

      profileData = newProfile || null
    }
  }

  const user = {
    id: data.user.id,
    email: data.user.email!,
    name: profileData?.name || name,
    role: (profileData?.role as "patient" | "doctor" | "admin") || "patient",
    avatar: profileData?.avatar || "",
    token: data.session?.access_token || "",
  }

  const response = NextResponse.json(ok<AuthResponse>({ user }))

  for (const { name, value } of supabaseResponse.cookies.getAll()) {
    response.cookies.set(name, value)
  }

  return response
}
