import { ok, err } from "@/lib/api-types"
import { store } from "@/lib/mock-store"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const consultation = store.getConsultation(id)

  if (!consultation) {
    return Response.json(err("Consulta no encontrada"), { status: 404 })
  }

  const messages = store.getMessages().filter((m) => m.threadId === id)

  return Response.json(ok({ consultation, messages }))
}
