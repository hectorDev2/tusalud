import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const users = store.getUsers()
  return Response.json(ok({ users }))
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const { userId } = body

  if (!userId) {
    return Response.json(err("userId es requerido"), { status: 400 })
  }

  const user = store.toggleUserStatus(userId)
  if (!user) {
    return Response.json(err("Usuario no encontrado"), { status: 404 })
  }

  return Response.json(ok({ user }))
}
