import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const consultations = store.getDoctorConsultations()
  return Response.json(ok({ consultations }))
}
