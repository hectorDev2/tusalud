import { NextRequest } from "next/server"
import { ok, err, type ApiResponse, type AuthResponse } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return Response.json(err("Email y contraseña son requeridos"), { status: 400 })
  }

  const user = store.login(email, password)
  if (!user) {
    return Response.json(err("Credenciales inválidas"), { status: 401 })
  }

  return Response.json(ok<AuthResponse>({ user }))
}
