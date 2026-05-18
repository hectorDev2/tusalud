import { NextRequest } from "next/server"
import { ok, err, type ApiResponse, type AuthResponse } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return Response.json(err("Todos los campos son requeridos"), { status: 400 })
  }

  const user = store.signup(name, email, password)
  return Response.json(ok<AuthResponse>({ user }))
}
