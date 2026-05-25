import { NextRequest, NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase"

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

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (publicRoutes.includes(pathname)) return NextResponse.next()
  if (pathname.startsWith("/api/")) return NextResponse.next()
  if (pathname.startsWith("/_next/")) return NextResponse.next()
  if (pathname.startsWith("/favicon")) return NextResponse.next()
  if (pathname.endsWith(".js") || pathname.endsWith(".json") || pathname.endsWith(".map")) return NextResponse.next()

  const requiredRole = getRequiredRole(pathname)
  if (!requiredRole) return NextResponse.next()

  const supabase = createRouteClient(req)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (profile && profile.role !== requiredRole) {
    const dest =
      profile.role === "doctor" ? "/doctor"
      : profile.role === "admin" ? "/admin"
      : "/patient"
    return NextResponse.redirect(new URL(dest, req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
