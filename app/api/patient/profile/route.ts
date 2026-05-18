import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export const dynamic = "force-static"

export async function GET() {
  const profile = store.getPatientProfile()
  const user = store.getPatientUser()
  return Response.json(ok({ user, profile }))
}
