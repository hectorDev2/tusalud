import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const messages = store.getMessages()
  return Response.json(ok({ messages }))
}
