import type {
  User,
  DoctorApproval,
  Message,
  AgendaSlot,
  AdminStats,
  PatientRecord,
  UserRecord,
  AdminTokenTransaction,
} from "./api-types"

export interface Doctor {
  id: string
  name: string
  specialty: string
  avatar: string
  rating: number
  available: boolean
  initials: string
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  avatar: string
  initials: string
  allergies: string[]
  medications: string[]
  bloodPressure: string
  heartRate: number
  bloodType: string
  height: string
  weight: string
  vaccines: { name: string; date: string }[]
  chronicConditions: string[]
  surgeries: { name: string; year: string }[]
  familyHistory: string[]
  emergencyContact: { name: string; phone: string; relation: string }
}

export interface Consultation {
  id: string
  patient: Patient
  doctor: Doctor
  type: string
  status: "completed" | "in-progress" | "pending"
  date: string
  time: string
  reason: string
  severity: "low" | "medium" | "high"
}

export interface TokenTransaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  detail: string
  date: string
  status: string
}

const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Sarah Miller", specialty: "Médica General", avatar: "", rating: 4.9, available: true, initials: "SM" },
  { id: "d2", name: "Dr. James Chen", specialty: "Dermatología", avatar: "", rating: 4.8, available: true, initials: "JC" },
  { id: "d3", name: "Dr. Aris Chen", specialty: "Cardiología", avatar: "", rating: 4.9, available: true, initials: "AC" },
  { id: "d4", name: "Dr. Elena Vance", specialty: "Neurología", avatar: "", rating: 4.7, available: true, initials: "EV" },
  { id: "d5", name: "Dr. Marcus Thorne", specialty: "Cardiología", avatar: "", rating: 4.8, available: false, initials: "MT" },
  { id: "d6", name: "Dr. Robert Kim", specialty: "Pediatría", avatar: "", rating: 4.6, available: true, initials: "RK" },
]

const patients: Patient[] = [
  {
    id: "p1", name: "Sarah Mitchell", age: 28, gender: "Femenino", avatar: "", initials: "SM",
    allergies: ["Penicilina", "Látex"],
    medications: ["Inhalador de Albuterol (según necesidad)", "Complejo Multivitamínico"],
    bloodPressure: "118/76", heartRate: 72,
    bloodType: "A+", height: "1.65 m", weight: "62 kg",
    vaccines: [
      { name: "COVID-19 (Moderna)", date: "Mar 2024" },
      { name: "Antigripal", date: "Abr 2024" },
      { name: "Triple Viral", date: "Feb 2023" },
      { name: "Hepatitis B", date: "Ene 2022" },
    ],
    chronicConditions: ["Asma leve intermitente"],
    surgeries: [{ name: "Apendicectomía", year: "2018" }],
    familyHistory: ["Madre: Hipertensión", "Padre: Diabetes tipo 2"],
    emergencyContact: { name: "Tomás Mitchell", phone: "+54 11 5555-0199", relation: "Hermano" },
  },
  {
    id: "p2", name: "Marcus Chen", age: 45, gender: "Masculino", avatar: "", initials: "MC",
    allergies: ["Sulfa"],
    medications: ["Lisinopril 10mg", "Aspirina 81mg"],
    bloodPressure: "132/84", heartRate: 68,
    bloodType: "O+", height: "1.78 m", weight: "85 kg",
    vaccines: [
      { name: "COVID-19 (Pfizer)", date: "Jun 2024" },
      { name: "Antigripal", date: "May 2024" },
    ],
    chronicConditions: ["Hipertensión arterial", "Hipercolesterolemia"],
    surgeries: [],
    familyHistory: ["Madre: Cardiopatía", "Padre: Fallecido por infarto"],
    emergencyContact: { name: "Lin Chen", phone: "+54 11 5555-0288", relation: "Esposa" },
  },
  {
    id: "p3", name: "Elena Rodriguez", age: 35, gender: "Femenino", avatar: "", initials: "ER",
    allergies: [], medications: [],
    bloodPressure: "120/80", heartRate: 75,
    bloodType: "B+", height: "1.70 m", weight: "68 kg",
    vaccines: [{ name: "COVID-19 (Sinopharm)", date: "Ene 2024" }, { name: "Antigripal", date: "Abr 2024" }],
    chronicConditions: [],
    surgeries: [],
    familyHistory: [],
    emergencyContact: { name: "Carlos Rodriguez", phone: "+54 11 5555-0377", relation: "Padre" },
  },
  {
    id: "p4", name: "James Wilson", age: 52, gender: "Masculino", avatar: "", initials: "JW",
    allergies: ["Ibuprofeno"],
    medications: ["Atorvastatina 20mg"],
    bloodPressure: "140/90", heartRate: 80,
    bloodType: "AB-", height: "1.82 m", weight: "92 kg",
    vaccines: [{ name: "Antigripal", date: "Mar 2024" }],
    chronicConditions: ["Hipertensión", "Diabetes tipo 2"],
    surgeries: [{ name: "Colecistectomía", year: "2020" }],
    familyHistory: ["Madre: Diabetes", "Padre: Hipertensión"],
    emergencyContact: { name: "Anna Wilson", phone: "+54 11 5555-0466", relation: "Esposa" },
  },
  {
    id: "p5", name: "Laura Bennett", age: 29, gender: "Femenino", avatar: "", initials: "LB",
    allergies: [], medications: ["Anticonceptivos"],
    bloodPressure: "115/75", heartRate: 70,
    bloodType: "O-", height: "1.63 m", weight: "55 kg",
    vaccines: [{ name: "COVID-19 (Moderna)", date: "Feb 2024" }, { name: "HPV", date: "2023" }, { name: "Antigripal", date: "May 2024" }],
    chronicConditions: [],
    surgeries: [],
    familyHistory: ["Madre: Cáncer de mama (remisión)"],
    emergencyContact: { name: "Sophie Bennett", phone: "+54 11 5555-0555", relation: "Hermana" },
  },
  {
    id: "p6", name: "Robert Kim", age: 41, gender: "Masculino", avatar: "", initials: "RK",
    allergies: [], medications: ["Metformina 500mg"],
    bloodPressure: "128/82", heartRate: 72,
    bloodType: "A-", height: "1.75 m", weight: "78 kg",
    vaccines: [{ name: "COVID-19 (Pfizer)", date: "Ago 2024" }, { name: "Antigripal", date: "Abr 2024" }],
    chronicConditions: ["Prediabetes"],
    surgeries: [],
    familyHistory: ["Padre: Diabetes tipo 2"],
    emergencyContact: { name: "Yuna Kim", phone: "+54 11 5555-0644", relation: "Esposa" },
  },
  {
    id: "p7", name: "Ana Martinez", age: 38, gender: "Femenino", avatar: "", initials: "AM",
    allergies: ["Aspirina"], medications: [],
    bloodPressure: "122/78", heartRate: 74,
    bloodType: "AB+", height: "1.68 m", weight: "60 kg",
    vaccines: [{ name: "COVID-19 (Moderna)", date: "Mar 2024" }, { name: "Antigripal", date: "Abr 2024" }, { name: "Hepatitis B", date: "2022" }],
    chronicConditions: ["Migraña crónica"],
    surgeries: [{ name: "Cirugía de tobillo", year: "2021" }],
    familyHistory: ["Madre: Migraña"],
    emergencyContact: { name: "Pedro Martinez", phone: "+54 11 5555-0733", relation: "Esposo" },
  },
]

let consultations: Consultation[] = [
  { id: "c1", patient: patients[0], doctor: doctors[0], type: "Médica General", status: "in-progress", date: "Hoy", time: "09:30 AM", reason: "Opresión en el pecho y falta de aire", severity: "medium" },
  { id: "c2", patient: patients[1], doctor: doctors[0], type: "Dermatología", status: "pending", date: "Hoy", time: "10:15 AM", reason: "Control de erupción cutánea", severity: "low" },
  { id: "c3", patient: patients[2], doctor: doctors[2], type: "Chequeo Anual", status: "pending", date: "Hoy", time: "11:00 AM", reason: "Resultados del chequeo anual", severity: "low" },
  { id: "c4", patient: patients[3], doctor: doctors[2], type: "Cardiología", status: "pending", date: "Hoy", time: "11:45 AM", reason: "Control de hipertensión", severity: "medium" },
  { id: "c5", patient: patients[4], doctor: doctors[0], type: "Seguimiento", status: "completed", date: "Ayer", time: "2:15 PM", reason: "Consulta de seguimiento", severity: "low" },
  { id: "c6", patient: patients[5], doctor: doctors[5], type: "Pediatría", status: "completed", date: "28 Sep", time: "8:45 AM", reason: "Revisión de medicación", severity: "low" },
  { id: "c7", patient: patients[6], doctor: doctors[2], type: "Consulta General", status: "completed", date: "15 Oct", time: "9:00 AM", reason: "Dolor lumbar crónico", severity: "medium" },
]

const tokenTransactions: TokenTransaction[] = [
  { id: "t1", type: "credit", amount: 3, description: "Reinicio semanal", detail: "Asignación programada", date: "Hoy", status: "Completado" },
  { id: "t2", type: "debit", amount: 1, description: "Consulta", detail: "Videollamada con Dr. Aris", date: "Ayer", status: "Debitado" },
  { id: "t3", type: "debit", amount: 2, description: "Recarga de receta", detail: "Cobro automático de farmacia", date: "Ayer", status: "Oct 12" },
  { id: "t4", type: "credit", amount: 3, description: "Reinicio semanal", detail: "Asignación programada", date: "15 Oct", status: "Completado" },
  { id: "t5", type: "debit", amount: 2, description: "Consulta Urgente", detail: "Prioridad alta", date: "12 Oct", status: "Completado" },
  { id: "t6", type: "debit", amount: 1, description: "Consulta", detail: "Seguimiento", date: "8 Oct", status: "Completado" },
]

export const messages: Message[] = [
  { id: "m1", from: "d1", fromName: "Dr. Sarah Miller", fromInitials: "SM", preview: "Tu receta fue enviada a la farmacia. Saludos, Dra. Miller", time: "Hace 2h", unread: true, threadId: "c1" },
  { id: "m2", from: "d2", fromName: "Dr. James Chen", fromInitials: "JC", preview: "Los resultados de laboratorio están listos. Podés...", time: "Ayer", unread: false, threadId: "c5" },
  { id: "m3", from: "d4", fromName: "Dr. Elena Vance", fromInitials: "EV", preview: "Recordatorio: tenés consulta mañana a las 9:00 AM", time: "15 Oct", unread: false, threadId: "c7" },
  { id: "m4", from: "d5", fromName: "Dr. Marcus Thorne", fromInitials: "MT", preview: "Tu presión arterial está estable. Seguí con...", time: "10 Oct", unread: false, threadId: "c4" },
  { id: "m5", from: "system", fromName: "Sanctuary Health", fromInitials: "SH", preview: "Tus 3 tokens semanales fueron acreditados", time: "8 Oct", unread: true, threadId: "tokens" },
]

export const doctorApprovals: DoctorApproval[] = [
  { id: "a1", name: "Dr. Aris Thorne", specialty: "Cardiología", email: "thornea@sanctuary.health", avatar: "", status: "pending" },
  { id: "a2", name: "Dr. Elena Vance", specialty: "Neurología", email: "vance.e@neurowell.com", avatar: "", status: "pending" },
  { id: "a3", name: "Dr. Julian Marsh", specialty: "Pediatría", email: "marsh_j@healthline.org", avatar: "", status: "pending" },
  { id: "a4", name: "Dr. Sofia Reyes", specialty: "Psiquiatría", email: "s.reyes@salud.com", avatar: "", status: "pending" },
]

const agenda: AgendaSlot[] = [
  { time: "09:00", type: "free" },
  { time: "09:30", type: "appointment", patientName: "Sarah Mitchell", initials: "SM", reason: "Opresión en el pecho", duration: "30 min", status: "en-curso" },
  { time: "10:15", type: "appointment", patientName: "Marcus Chen", initials: "MC", reason: "Control de erupción", duration: "20 min", status: "pendiente" },
  { time: "10:45", type: "free" },
  { time: "11:00", type: "appointment", patientName: "Elena Rodriguez", initials: "ER", reason: "Resultados chequeo", duration: "30 min", status: "pendiente" },
  { time: "11:45", type: "appointment", patientName: "James Wilson", initials: "JW", reason: "Control de hipertensión", duration: "25 min", status: "pendiente" },
  { time: "12:15", type: "break" },
  { time: "14:00", type: "appointment", patientName: "Laura Bennett", initials: "LB", reason: "Seguimiento", duration: "20 min", status: "pendiente" },
  { time: "14:30", type: "appointment", patientName: "Robert Kim", initials: "RK", reason: "Revisión medicación", duration: "15 min", status: "pendiente" },
  { time: "15:15", type: "appointment", patientName: "Ana Martinez", initials: "AM", reason: "Dolor lumbar", duration: "30 min", status: "pendiente" },
  { time: "16:00", type: "free" },
]

const patientRecords: PatientRecord[] = [
  { id: "p1", name: "Sarah Mitchell", email: "s.mitchell@email.com", age: 28, lastConsultation: "Hoy", status: "activo" },
  { id: "p2", name: "Marcus Chen", email: "m.chen@email.com", age: 45, lastConsultation: "Ayer", status: "activo" },
  { id: "p3", name: "Elena Rodriguez", email: "e.rodriguez@email.com", age: 35, lastConsultation: "3 días", status: "activo" },
  { id: "p4", name: "James Wilson", email: "j.wilson@email.com", age: 52, lastConsultation: "1 semana", status: "inactivo" },
  { id: "p5", name: "Laura Bennett", email: "l.bennett@email.com", age: 29, lastConsultation: "2 semanas", status: "activo" },
  { id: "p6", name: "Robert Kim", email: "r.kim@email.com", age: 41, lastConsultation: "1 mes", status: "inactivo" },
]

const users: UserRecord[] = [
  { id: "u1", name: "Sarah Mitchell", email: "s.mitchell@sanctuary.health", role: "paciente", status: "activo" },
  { id: "u2", name: "Dr. Aris Thorne", email: "thornea@sanctuary.health", role: "doctor", status: "activo" },
  { id: "u3", name: "Dr. Sarah Chen", email: "sarah.chen@neuro.com", role: "doctor", status: "activo" },
  { id: "u4", name: "Admin Portal", email: "admin@sanctuary.health", role: "administrador", status: "activo" },
  { id: "u5", name: "Marcus Chen", email: "m.chen@sanctuary.health", role: "paciente", status: "activo" },
  { id: "u6", name: "James Wilson", email: "j.wilson@sanctuary.health", role: "paciente", status: "suspendido" },
  { id: "u7", name: "Dr. Elena Vance", email: "vance.e@neurowell.com", role: "doctor", status: "pendiente" },
]

const adminTokenTx: AdminTokenTransaction[] = [
  { id: "at1", userName: "Sarah Mitchell", initials: "SM", description: "Reinicio Semanal", amount: 3, date: "Hoy", status: "completado" },
  { id: "at2", userName: "Marcus Chen", initials: "MC", description: "Consulta", amount: -1, date: "Ayer", status: "completado" },
  { id: "at3", userName: "Elena Rodriguez", initials: "ER", description: "Recarga de Receta", amount: -2, date: "Ayer", status: "completado" },
  { id: "at4", userName: "Admin", initials: "AD", description: "Reinicio Semanal (Sist.)", amount: 3, date: "3 días", status: "completado" },
  { id: "at5", userName: "Laura Bennett", initials: "LB", description: "Consulta Urgente", amount: -2, date: "5 días", status: "completado" },
  { id: "at6", userName: "James Wilson", initials: "JW", description: "Reinicio Semanal", amount: 3, date: "1 semana", status: "completado" },
  { id: "at7", userName: "Robert Kim", initials: "RK", description: "Consulta", amount: -1, date: "1 semana", status: "pendiente" },
]

// --- Store with mutable state ---

const CREDENTIALS: Record<string, { id: string; name: string; role: User["role"]; token: string }> = {
  "admin@admin.com": { id: "u-admin-1", name: "Admin Portal", role: "admin", token: "mock-token-admin-123" },
  "doctor@test.com": { id: "u-doctor-1", name: "Dr. Aris Chen", role: "doctor", token: "mock-token-doctor-123" },
  "patient@test.com": { id: "u-patient-1", name: "Sarah Mitchell", role: "patient", token: "mock-token-patient-123" },
}

const PASSWORDS: Record<string, string> = {
  "admin@admin.com": "admin",
  "doctor@test.com": "123",
  "patient@test.com": "123",
}

function createStore() {
  let currentUser: User = {
    id: "u-patient-1",
    email: "patient@test.com",
    name: "Sarah Mitchell",
    role: "patient",
    avatar: "",
    token: "mock-token-patient-123",
  }

  return {
    // Auth
    login(email: string, password: string): User | null {
      const creds = CREDENTIALS[email]
      if (!creds || PASSWORDS[email] !== password) return null
      const user: User = { ...creds, email, avatar: "" }
      currentUser = user
      return user
    },
    signup(_name: string, email: string, _password: string): User {
      currentUser = { ...currentUser, email, name: _name }
      return currentUser
    },

    // Users
    getPatientUser: () => currentUser,
    getDoctorUser: () => {
      const c = CREDENTIALS["doctor@test.com"]
      return { ...c, email: "doctor@test.com", avatar: "" } as User
    },
    getAdminUser: () => {
      const c = CREDENTIALS["admin@admin.com"]
      return { ...c, email: "admin@admin.com", avatar: "" } as User
    },

    // Patient
    getPatientProfile: () => patients[0],
    getPatientConsultations: () => consultations.filter((c) => c.patient.id === "p1"),
    getConsultation: (id: string) => consultations.find((c) => c.id === id) || null,
    createConsultation: (data: Partial<Consultation>) => {
      const c: Consultation = {
        id: `c${consultations.length + 1}`,
        patient: patients[0],
        doctor: doctors[0],
        type: "Consulta General",
        status: "pending",
        date: "Hoy",
        time: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
        reason: data.reason || "",
        severity: data.severity || "low",
      }
      consultations.unshift(c)
      return c
    },
    getTokenBalance: () => 12,
    getTokenTransactions: () => tokenTransactions,
    getMessages: () => messages,

    // Doctor
    getDoctorProfile: () => doctors[2],
    getDoctorConsultations: () => consultations,
    getDoctorAgenda: () => agenda,
    updateConsultationStatus: (id: string, status: Consultation["status"]) => {
      const c = consultations.find((c) => c.id === id)
      if (c) c.status = status
      return c
    },

    // Admin
    getAdminStats: (): AdminStats => ({
      activeUsers: 12842,
      totalConsultations: 3105,
      pendingApprovals: 24,
      tokensInCirculation: 24580,
      tokensUsedThisWeek: 8420,
      tokensNewThisWeek: 9600,
      usageRate: 87.2,
    }),
    getPatientRecords: () => patientRecords,
    getDoctorApprovals: () => doctorApprovals,
    approveDoctor: (id: string) => {
      const d = doctorApprovals.find((d) => d.id === id)
      if (d) d.status = "verified"
      return d
    },
    rejectDoctor: (id: string) => {
      const idx = doctorApprovals.findIndex((d) => d.id === id)
      if (idx !== -1) doctorApprovals.splice(idx, 1)
    },
    getUsers: () => users,
    toggleUserStatus: (id: string) => {
      const u = users.find((u) => u.id === id)
      if (u) u.status = u.status === "activo" ? "suspendido" : "activo"
      return u
    },
    getAdminTokenTransactions: () => adminTokenTx,
  }
}

export const store = createStore()
