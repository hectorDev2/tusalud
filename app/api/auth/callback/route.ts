import { NextRequest, NextResponse } from "next/server"
import { createRouteClientWithResponse, getServiceClient } from "@/lib/supabase"

// GET /api/auth/callback
// Exchanges the OAuth code (Google, etc.) for a Supabase session and
// bootstraps a `profiles` row on first login, then hands off to /login
// which redirects to the right dashboard once the session is detected.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const { supabase, response } = createRouteClientWithResponse(request)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const admin = getServiceClient()

      const { data: existingProfile } = await admin
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .single()

      if (!existingProfile) {
        const name =
          data.user.user_metadata?.full_name ||
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "Usuario"

        await admin.from("profiles").insert({ id: data.user.id, name, role: "patient" })
        await admin.from("patients").upsert({ id: data.user.id })
      }
    }

    const redirect = NextResponse.redirect(`${origin}/login`)
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie)
    }
    return redirect
  }

  return NextResponse.redirect(`${origin}/login`)
}
