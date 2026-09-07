import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requireDoctor } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requireDoctor(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const [profileRes, statsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, name, specialty, rating, available, role")
      .eq("id", user.id)
      .single(),
    supabase
      .from("consultations")
      .select("status")
      .eq("assigned_doctor_id", user.id),
  ])

  if (profileRes.error) return Response.json(err(profileRes.error.message), { status: 500 })

  const consultations = statsRes.data ?? []
  const stats = {
    total: consultations.length,
    assigned: consultations.filter((c) => c.status === "assigned").length,
    in_progress: consultations.filter((c) => c.status === "in_progress").length,
    closed: consultations.filter((c) => c.status === "closed").length,
    completed: consultations.filter((c) => c.status === "completed").length,
  }

  const email = user.email ?? ""

  return Response.json(ok({ profile: { ...profileRes.data, email }, stats }))
}
