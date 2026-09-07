import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const USERS = [
  { email: "admin@admin.com", password: "admin", name: "Admin Portal", role: "admin" as const },
  { email: "doctor@test.com", password: "123", name: "Dr. Sarah Miller", role: "doctor" as const, specialty: "Médica General" },
  { email: "patient@test.com", password: "123", name: "Sarah Mitchell", role: "patient" as const },
]

async function createUser(email: string, password: string, meta: Record<string, string>) {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: meta,
  })
  if (error) {
    // Might already exist
    const { data: existing } = await admin.auth.admin.getUserByEmail(email)
    if (existing?.user) return existing.user
    throw error
  }
  return data.user
}

async function seed() {
  // 1. Create users (profiles auto-created via trigger)
  const created: Record<string, string> = {}
  for (const u of USERS) {
    const user = await createUser(u.email, u.password, { name: u.name, role: u.role })
    created[u.role] = user.id
    console.log(`✅ Created ${u.role}: ${u.email} -> ${user.id}`)

    // Update profile with additional info
    if (u.role === "doctor") {
      await admin.from("profiles").update({
        specialty: u.specialty,
        rating: 4.9,
        available: true,
      }).eq("id", user.id)
    }
  }

  const patientId = created.patient
  const doctorId = created.doctor

  // 2. Seed patient medical info
  const { error: pErr } = await admin.from("patients").upsert({
    id: patientId,
    age: 28,
    gender: "Femenino",
    allergies: ["Penicilina", "Látex"],
    medications: ["Inhalador de Albuterol (según necesidad)", "Complejo Multivitamínico"],
    blood_pressure: "118/76",
    heart_rate: 72,
    blood_type: "A+",
    height: "1.65 m",
    weight: "62 kg",
    vaccines: [
      { name: "COVID-19 (Moderna)", date: "Mar 2024" },
      { name: "Antigripal", date: "Abr 2024" },
      { name: "Triple Viral", date: "Feb 2023" },
      { name: "Hepatitis B", date: "Ene 2022" },
    ],
    chronic_conditions: ["Asma leve intermitente"],
    surgeries: [{ name: "Apendicectomía", year: "2018" }],
    family_history: ["Madre: Hipertensión", "Padre: Diabetes tipo 2"],
    emergency_contact: { name: "Tomás Mitchell", phone: "+54 11 5555-0199", relation: "Hermano" },
  })
  if (pErr) console.error("❌ Patient insert error:", pErr)
  else console.log("✅ Patient medical info seeded")

  // 3. Seed consultations
  const consultations = [
    {
      patient_id: patientId,
      assigned_doctor_id: doctorId,
      type: "Médica General",
      status: "assigned" as const,
      reason: "Opresión en el pecho y falta de aire",
      severity: "medium" as const,
      intake: { symptoms: "Opresión en el pecho", duration: "2 días", painScale: 6 },
    },
    {
      patient_id: patientId,
      assigned_doctor_id: doctorId,
      type: "Dermatología",
      status: "closed" as const,
      reason: "Control de erupción cutánea",
      severity: "low" as const,
      intake: { symptoms: "Erupción en brazo", duration: "1 semana", painScale: 2 },
      closure_summary: "Dermatitis de contacto leve. Se recomienda crema hidrocortisona 1% por 7 días.",
      requires_formal_consultation: false,
    },
  ]
  for (const c of consultations) {
    const { error: cErr } = await admin.from("consultations").insert(c)
    if (cErr) console.error(`❌ Consultation insert error:`, cErr)
  }
  console.log(`✅ ${consultations.length} consultations seeded`)

  // 4. Seed token transactions (100 tokens for test accounts)
  const tokens = [
    { user_id: patientId, type: "credit" as const, amount: 100, description: "Tokens de prueba", detail: "Cuenta de testing" },
  ]
  for (const t of tokens) {
    const { error: tErr } = await admin.from("token_transactions").insert(t)
    if (tErr) console.error(`❌ Token insert error:`, tErr)
  }
  console.log(`✅ ${tokens.length} token transactions seeded`)

  // 5. Seed messages
  const messages = [
    { user_id: patientId, from: doctorId, from_name: "Dr. Sarah Miller", from_initials: "SM", preview: "Tu receta fue enviada a la farmacia. Saludos, Dra. Miller", time: "Hace 2h", unread: true, thread_id: "c1" },
    { user_id: patientId, from: "system", from_name: "Sanctuary Health", from_initials: "SH", preview: "Tus 3 tokens semanales fueron acreditados", time: "8 Oct", unread: true, thread_id: "tokens" },
  ]
  for (const m of messages) {
    const { error: mErr } = await admin.from("messages").insert(m)
    if (mErr) console.error(`❌ Message insert error:`, mErr)
  }
  console.log(`✅ ${messages.length} messages seeded`)

  // 6. Seed doctor approvals
  const approvals = [
    { name: "Dr. Aris Thorne", specialty: "Cardiología", email: "thornea@sanctuary.health", status: "pending" as const },
    { name: "Dr. Elena Vance", specialty: "Neurología", email: "vance.e@neurowell.com", status: "pending" as const },
    { name: "Dr. Julian Marsh", specialty: "Pediatría", email: "marsh_j@healthline.org", status: "pending" as const },
  ]
  for (const a of approvals) {
    const { error: aErr } = await admin.from("doctor_approvals").insert(a)
    if (aErr) console.error(`❌ Approval insert error:`, aErr)
  }
  console.log(`✅ ${approvals.length} doctor approvals seeded`)

  // 7. Seed agenda slots for the doctor
  const agenda = [
    { doctor_id: doctorId, time: "09:00", type: "free" as const },
    { doctor_id: doctorId, time: "09:30", type: "appointment" as const, patient_name: "Sarah Mitchell", initials: "SM", reason: "Opresión en el pecho", duration: "30 min", status: "en_curso" as const },
    { doctor_id: doctorId, time: "10:15", type: "appointment" as const, patient_name: "Marcus Chen", initials: "MC", reason: "Control de erupción", duration: "20 min", status: "pendiente" as const },
    { doctor_id: doctorId, time: "10:45", type: "free" as const },
    { doctor_id: doctorId, time: "11:00", type: "appointment" as const, patient_name: "Elena Rodriguez", initials: "ER", reason: "Resultados chequeo", duration: "30 min", status: "pendiente" as const },
    { doctor_id: doctorId, time: "12:15", type: "break" as const },
    { doctor_id: doctorId, time: "14:00", type: "appointment" as const, patient_name: "Laura Bennett", initials: "LB", reason: "Seguimiento", duration: "20 min", status: "pendiente" as const },
    { doctor_id: doctorId, time: "16:00", type: "free" as const },
  ]
  for (const s of agenda) {
    const { error: sErr } = await admin.from("agenda_slots").insert(s)
    if (sErr) console.error(`❌ Agenda slot insert error:`, sErr)
  }
  console.log(`✅ ${agenda.length} agenda slots seeded`)

  console.log("\n🎉 Seed complete!")
  console.log(`\nCredentials:`)
  console.log(`  admin@admin.com / admin`)
  console.log(`  doctor@test.com / 123`)
  console.log(`  patient@test.com / 123`)
}

seed().catch(console.error)
