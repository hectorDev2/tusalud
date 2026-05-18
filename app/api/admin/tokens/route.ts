import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const transactions = store.getAdminTokenTransactions()
  return Response.json(ok({ transactions }))
}
