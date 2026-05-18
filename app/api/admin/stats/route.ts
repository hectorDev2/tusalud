import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const stats = store.getAdminStats()
  return Response.json(ok({ stats }))
}
