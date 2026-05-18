import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const profile = store.getDoctorProfile()
  const user = store.getDoctorUser()
  return Response.json(ok({ user, profile }))
}
