import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const balance = store.getTokenBalance()
  const transactions = store.getTokenTransactions()
  return Response.json(ok({ balance, transactions }))
}
