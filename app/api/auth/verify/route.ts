import { NextRequest } from "next/server"
import { ok } from "@/lib/api-types"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email } = body

  return Response.json(ok({ message: "Email verificado correctamente", email }))
}
