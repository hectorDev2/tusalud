import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requirePatient } from "@/lib/route-auth"

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user: authUser } = auth.auth

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single()

  if (!profile) return Response.json(err("Perfil no encontrado"), { status: 404 })

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", authUser.id)
    .single()

  const initials = profile.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const patientData = patient
    ? {
        id: patient.id,
        name: profile.name,
        initials,
        age: patient.age,
        gender: patient.gender,
        allergies: patient.allergies || [],
        medications: patient.medications || [],
        bloodPressure: patient.blood_pressure,
        heartRate: patient.heart_rate,
        bloodType: patient.blood_type,
        height: patient.height,
        weight: patient.weight,
        vaccines: patient.vaccines || [],
        chronicConditions: patient.chronic_conditions || [],
        surgeries: patient.surgeries || [],
        familyHistory: patient.family_history || [],
        emergencyContact: (patient.emergency_contact as Record<string, string>) || {},
      }
    : null

  const user = {
    id: profile.id,
    email: authUser.email || "",
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar || "",
    token: "",
  }

  return Response.json(ok({ user, profile: patientData }))
}
