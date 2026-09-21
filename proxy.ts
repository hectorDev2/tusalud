import { NextRequest, NextResponse } from "next/server"
import { createRouteClientWithResponse } from "@/lib/supabase"
import { getAuthProfile } from "@/lib/auth-profile"

const roleGroups: Record<string, string[]> = {
  patient: ["/patient"],
  doctor: ["/doctor"],
  admin: ["/admin"],
}

const publicRoutes = ["/", "/login", "/signup", "/verify"]

function getRequiredRole(pathname: string): string | null {
  for (const [role, prefixes] of Object.entries(roleGroups)) {
    for (const prefix of prefixes) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) return role
    }
  }
  return null
}

function copyCookies(from: NextResponse, to: NextResponse) {
  for (const cookie of from.cookies.getAll()) {
    to.cookies.set(cookie)
  }
}

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (publicRoutes.includes(pathname)) return NextResponse.next()
  if (pathname.startsWith("/api/")) return NextResponse.next()
  if (pathname.startsWith("/_next/")) return NextResponse.next()
  if (pathname.startsWith("/favicon")) return NextResponse.next()
  if (pathname.endsWith(".js") || pathname.endsWith(".json") || pathname.endsWith(".map")) return NextResponse.next()

  const requiredRole = getRequiredRole(pathname)
  if (!requiredRole) return NextResponse.next()

  const { supabase, response } = createRouteClientWithResponse(req)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.warn(`[proxy] redirecting ${pathname}: session not found`)
    const redirect = NextResponse.redirect(new URL("/login", req.url))
    copyCookies(response, redirect)
    return redirect
  }

  const profile = await getAuthProfile(user.id)

  if (!profile) {
    console.warn(`[proxy] redirecting ${pathname}: profile not found`)
    const redirect = NextResponse.redirect(new URL("/login", req.url))
    copyCookies(response, redirect)
    return redirect
  }

  if (profile.role !== requiredRole) {
    console.warn(`[proxy] redirecting ${pathname}: role ${profile.role} does not match ${requiredRole}`)
    const destination = profile.role === "admin" ? "/admin" : profile.role === "doctor" ? "/doctor" : "/patient"
    const redirect = NextResponse.redirect(new URL(destination, req.url))
    copyCookies(response, redirect)
    return redirect
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
