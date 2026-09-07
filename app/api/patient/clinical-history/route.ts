import { NextRequest } from "next/server"
import { ok, err } from "@/lib/api-types"
import { requirePatient } from "@/lib/route-auth"
import type { Database } from "@/lib/database.types"

type PatientUpdate = Database["public"]["Tables"]["patients"]["Update"]

export async function GET(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const { data: patient } = await supabase
    .from("patients")
    .select("id, age, gender, allergies, medications, chronic_conditions, blood_type, blood_pressure, heart_rate, height, weight")
    .eq("id", user.id)
    .single()

  return Response.json(ok({ clinicalHistory: patient ?? null }))
}

export async function PATCH(request: NextRequest) {
  const auth = await requirePatient(request)
  if (!auth.ok) return auth.response
  const { supabase, user } = auth.auth

  const body = await request.json()
  const { allergies, medications, chronic_conditions, age, gender, blood_type, height, weight } = body

  // Build update object — only include defined fields
  const updates: PatientUpdate = {}
  if (Array.isArray(allergies)) updates.allergies = allergies
  if (Array.isArray(medications)) updates.medications = medications
  if (Array.isArray(chronic_conditions)) updates.chronic_conditions = chronic_conditions
  if (age !== undefined) updates.age = age
  if (gender !== undefined) updates.gender = gender
  if (blood_type !== undefined) updates.blood_type = blood_type
  if (height !== undefined) updates.height = height
  if (weight !== undefined) updates.weight = weight

  if (Object.keys(updates).length === 0) {
    return Response.json(err("No hay campos para actualizar"), { status: 400 })
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .update(updates)
    .eq("id", user.id)
    .select("id, allergies, medications, chronic_conditions, age, gender, blood_type, height, weight")
    .single()

  if (error) return Response.json(err(error.message), { status: 500 })

  return Response.json(ok({ clinicalHistory: patient }))
}
