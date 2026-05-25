import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const ADDITIONAL_USERS = [
  { email: "marcus@test.com", password: "123", name: "Marcus Chen", role: "patient" as const },
  { email: "elena@test.com", password: "123", name: "Elena Rodriguez", role: "patient" as const },
  { email: "james@test.com", password: "123", name: "James Wilson", role: "patient" as const },
  { email: "laura@test.com", password: "123", name: "Laura Bennett", role: "patient" as const },
  { email: "robert@test.com", password: "123", name: "Robert Kim", role: "patient" as const },
  { email: "ana@test.com", password: "123", name: "Ana Martinez", role: "patient" as const },
]

const EXTRA_PATIENTS = [
  {
    age: 45, gender: "Masculino",
    allergies: ["Sulfa"],
    medications: ["Lisinopril 10mg", "Aspirina 81mg"],
    blood_pressure: "132/84", heart_rate: 68,
    blood_type: "O+", height: "1.78 m", weight: "85 kg",
    vaccines: [{ name: "COVID-19 (Pfizer)", date: "Jun 2024" }, { name: "Antigripal", date: "May 2024" }],
    chronic_conditions: ["Hipertensión arterial", "Hipercolesterolemia"],
    surgeries: [],
    family_history: ["Madre: Cardiopatía", "Padre: Fallecido por infarto"],
    emergency_contact: { name: "Lin Chen", phone: "+54 11 5555-0288", relation: "Esposa" },
  },
  {
    age: 35, gender: "Femenino",
    allergies: [], medications: [],
    blood_pressure: "120/80", heart_rate: 75,
    blood_type: "B+", height: "1.70 m", weight: "68 kg",
    vaccines: [{ name: "COVID-19 (Sinopharm)", date: "Ene 2024" }, { name: "Antigripal", date: "Abr 2024" }],
    chronic_conditions: [],
    surgeries: [],
    family_history: [],
    emergency_contact: { name: "Carlos Rodriguez", phone: "+54 11 5555-0377", relation: "Padre" },
  },
  {
    age: 52, gender: "Masculino",
    allergies: ["Ibuprofeno"],
    medications: ["Atorvastatina 20mg"],
    blood_pressure: "140/90", heart_rate: 80,
    blood_type: "AB-", height: "1.82 m", weight: "92 kg",
    vaccines: [{ name: "Antigripal", date: "Mar 2024" }],
    chronic_conditions: ["Hipertensión", "Diabetes tipo 2"],
    surgeries: [{ name: "Colecistectomía", year: "2020" }],
    family_history: ["Madre: Diabetes", "Padre: Hipertensión"],
    emergency_contact: { name: "Anna Wilson", phone: "+54 11 5555-0466", relation: "Esposa" },
  },
  {
    age: 29, gender: "Femenino",
    allergies: [], medications: ["Anticonceptivos"],
    blood_pressure: "115/75", heart_rate: 70,
    blood_type: "O-", height: "1.63 m", weight: "55 kg",
    vaccines: [{ name: "COVID-19 (Moderna)", date: "Feb 2024" }, { name: "HPV", date: "2023" }, { name: "Antigripal", date: "May 2024" }],
    chronic_conditions: [],
    surgeries: [],
    family_history: ["Madre: Cáncer de mama (remisión)"],
    emergency_contact: { name: "Sophie Bennett", phone: "+54 11 5555-0555", relation: "Hermana" },
  },
  {
    age: 41, gender: "Masculino",
    allergies: [], medications: ["Metformina 500mg"],
    blood_pressure: "128/82", heart_rate: 72,
    blood_type: "A-", height: "1.75 m", weight: "78 kg",
    vaccines: [{ name: "COVID-19 (Pfizer)", date: "Ago 2024" }, { name: "Antigripal", date: "Abr 2024" }],
    chronic_conditions: ["Prediabetes"],
    surgeries: [],
    family_history: ["Padre: Diabetes tipo 2"],
    emergency_contact: { name: "Yuna Kim", phone: "+54 11 5555-0644", relation: "Esposa" },
  },
  {
    age: 38, gender: "Femenino",
    allergies: ["Aspirina"], medications: [],
    blood_pressure: "122/78", heart_rate: 74,
    blood_type: "AB+", height: "1.68 m", weight: "60 kg",
    vaccines: [{ name: "COVID-19 (Moderna)", date: "Mar 2024" }, { name: "Antigripal", date: "Abr 2024" }, { name: "Hepatitis B", date: "2022" }],
    chronic_conditions: ["Migraña crónica"],
    surgeries: [{ name: "Cirugía de tobillo", year: "2021" }],
    family_history: ["Madre: Migraña"],
    emergency_contact: { name: "Pedro Martinez", phone: "+54 11 5555-0733", relation: "Esposo" },
  },
]

async function main() {
  // Get the doctor user
  const { data: doctorUsers } = await admin.auth.admin.listUsers()
  const doctor = doctorUsers.users.find(u => u.email === "doctor@test.com")
  if (!doctor) {
    console.error("❌ Doctor not found. Run the main seed first.")
    return
  }

  for (let i = 0; i < ADDITIONAL_USERS.length; i++) {
    const u = ADDITIONAL_USERS[i]
    const patientData = EXTRA_PATIENTS[i]

    const { data, error } = await admin.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { name: u.name, role: u.role },
    })

    if (error) {
      console.error(`❌ Error creating ${u.name}:`, error.message)
      continue
    }

    const userId = data.user.id
    console.log(`✅ Created patient: ${u.name} -> ${userId}`)

    // Update patient record
    const { error: pErr } = await admin.from("patients").upsert({
      id: userId,
      ...patientData,
    })
    if (pErr) console.error(`❌ Error updating patient ${u.name}:`, pErr.message)

    // Create consultations for each patient with the doctor
    const consultations = [
      { patient_id: userId, doctor_id: doctor.id, type: "Consulta General", status: "completed" as const, date: "15 Oct", time: "09:00 AM", reason: "Dolor lumbar crónico", severity: "medium" as const },
      { patient_id: userId, doctor_id: doctor.id, type: "Seguimiento", status: "completed" as const, date: "28 Sep", time: "08:45 AM", reason: "Revisión de medicación", severity: "low" as const },
    ]
    for (const c of consultations) {
      await admin.from("consultations").insert(c)
    }
    console.log(`  ✅ Consultations seeded for ${u.name}`)

    // Token transactions
    const tokens = [
      { user_id: userId, type: "credit" as const, amount: 3, description: "Reinicio semanal", detail: "Asignación programada", date: "Lun", status: "Completado" },
      { user_id: userId, type: "debit" as const, amount: 1, description: "Consulta", detail: "Videollamada", date: "Ayer", status: "Debitado" },
    ]
    for (const t of tokens) {
      await admin.from("token_transactions").insert(t)
    }
    console.log(`  ✅ Tokens seeded for ${u.name}`)
  }

  console.log("\n🎉 Extra seed complete!")
}

main().catch(console.error)
