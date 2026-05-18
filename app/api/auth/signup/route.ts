import { NextRequest, NextResponse } from "next/server"
import { ok, err, type AuthResponse } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json(err("Todos los campos son requeridos"), { status: 400 })
  }

  const user = store.signup(name, email, password)
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
