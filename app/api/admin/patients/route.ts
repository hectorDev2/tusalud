import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const patients = store.getPatientRecords()
  return Response.json(ok({ patients }))
}
