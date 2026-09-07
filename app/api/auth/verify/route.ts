import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { createRouteClient } from "@/lib/supabase"

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
