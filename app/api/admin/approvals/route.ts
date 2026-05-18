import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const approvals = store.getDoctorApprovals()
  return Response.json(ok({ approvals }))
}
