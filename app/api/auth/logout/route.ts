import { NextRequest, NextResponse } from "next/server"
import { ok } from "@/lib/api-types"
import { createRouteClientWithResponse } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const { supabase, response: supabaseResponse } = createRouteClientWithResponse(request)

  await supabase.auth.signOut()

  const response = NextResponse.json(ok({ message: "Sesión cerrada" }))

  for (const { name, value } of supabaseResponse.cookies.getAll()) {
    response.cookies.set(name, value)
  }

  // Explicitly clear auth cookies
  response.cookies.set("sb-access-token", "", { expires: new Date(0) })
  response.cookies.set("sb-refresh-token", "", { expires: new Date(0) })
  response.cookies.set("supabase-auth-token", "", { expires: new Date(0) })

  return response
}
