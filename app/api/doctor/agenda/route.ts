import { ok } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET() {
  const agenda = store.getDoctorAgenda()
  return Response.json(ok({ agenda }))
}
