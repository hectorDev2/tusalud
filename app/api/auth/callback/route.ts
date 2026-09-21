import { NextRequest, NextResponse } from "next/server"
import { createRouteClientWithResponse } from "@/lib/supabase"
import { ensureAuthProfile } from "@/lib/auth-profile"

// GET /api/auth/callback
// Exchanges the OAuth code (Google, etc.) for a Supabase session and
// bootstraps a `profiles` row on first login, then hands off to /login
// which redirects to the right dashboard once the session is detected.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const isPopup = searchParams.get("popup") === "1"
  const oauthError = searchParams.get("error")
  let role: "patient" | "doctor" | "admin" = "patient"

  const getDestination = () => {
    if (!isPopup) return `${origin}/login`

    const destination = new URL(`${origin}/auth/popup-callback`)
    destination.searchParams.set("role", role)
    if (oauthError) destination.searchParams.set("error", oauthError)
    return destination.toString()
  }

  if (code) {
    const { supabase, response } = createRouteClientWithResponse(request)
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const profile = await ensureAuthProfile(data.user)
      if (profile) role = profile.role
    }

    const redirect = NextResponse.redirect(getDestination())
    for (const cookie of response.cookies.getAll()) {
      redirect.cookies.set(cookie)
    }
    return redirect
  }

  return NextResponse.redirect(getDestination())
}
