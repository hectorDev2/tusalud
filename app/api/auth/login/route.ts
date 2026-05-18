import { NextRequest, NextResponse } from "next/server"
import { ok, err, type AuthResponse } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(err("Email y contraseña son requeridos"), { status: 400 })
  }

  const user = store.login(email, password)
  if (!user) {
    return NextResponse.json(err("Credenciales inválidas"), { status: 401 })
  }

  const res = NextResponse.json(ok<AuthResponse>({ user }))

  res.cookies.set("session", JSON.stringify({ userId: user.id, role: user.role, name: user.name }), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  })

  return res
}
