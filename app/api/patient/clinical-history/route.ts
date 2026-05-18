import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const profile = store.getPatientProfile()
  return Response.json(ok({ clinicalHistory: profile }))
}
