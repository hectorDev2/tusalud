export interface Doctor {
  id: string
  name: string
  specialty: string
  avatar: string
  rating: number
  available: boolean
}

export interface Patient {
  id: string
  name: string
  age: number
  gender: string
  avatar: string
  allergies: string[]
  medications: string[]
  bloodPressure: string
  heartRate: number
}

export interface Consultation {
  id: string
  patient?: Patient
  doctor?: Doctor
  type: string
  status: "completed" | "in-progress" | "pending"
  date: string
  time: string
  reason?: string
  severity?: "low" | "medium" | "high"
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

export interface DoctorApproval {
  id: string
  name: string
  specialty: string
  email: string
  avatar: string
  status: "pending" | "verified"
}

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Miller",
    specialty: "Médica General",
    avatar: "",
    rating: 4.9,
    available: true,
  },
  {
    id: "d2",
    name: "Dr. James Chen",
    specialty: "Dermatología",
    avatar: "",
    rating: 4.8,
    available: true,
  },
]

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Sarah Mitchell",
    age: 28,
    gender: "Femenino",
    avatar: "",
    allergies: ["Penicilina", "Látex"],
    medications: ["Inhalador de Albuterol (según necesidad)", "Complejo Multivitamínico"],
    bloodPressure: "118/76",
    heartRate: 72,
  },
  {
    id: "p2",
    name: "Marcus Chen",
    age: 45,
    gender: "Masculino",
    avatar: "",
  allergies: ["Sulfa"],
  medications: ["Lisinopril 10mg", "Aspirina 81mg"],
    bloodPressure: "132/84",
    heartRate: 68,
  },
]

export const consultations: Consultation[] = [
  {
    id: "c1",
    doctor: doctors[0],
    type: "Médica General",
    status: "completed",
    date: "Oct 14",
    time: "10:30 AM",
  },
  {
    id: "c2",
    doctor: doctors[1],
    type: "Dermatología",
    status: "completed",
    date: "Oct 08",
    time: "11:15 AM",
  },
]

export const tokenTransactions: TokenTransaction[] = [
  {
    id: "t1",
    type: "credit",
    amount: 3,
    description: "Reinicio semanal",
    detail: "Asignación programada",
    date: "",
    status: "completed",
  },
  {
    id: "t2",
    type: "debit",
    amount: 1,
    description: "Consulta",
    detail: "Videollamada con Dr. Aris",
    date: "",
    status: "Debitado",
  },
  {
    id: "t3",
    type: "debit",
    amount: 2,
    description: "Recarga de receta",
    detail: "Cobro automático de farmacia",
    date: "",
    status: "Oct 12",
  },
]

export const doctorApprovalsData: DoctorApproval[] = [
  {
    id: "a1",
    name: "Dr. Aris Thorne",
    specialty: "Cardiología",
    email: "thornea@sanctuary.health",
    avatar: "",
    status: "pending",
  },
  {
    id: "a2",
    name: "Dr. Elena Vance",
    specialty: "Neurología",
    email: "vance.e@neurowell.com",
    avatar: "",
    status: "pending",
  },
  {
    id: "a3",
    name: "Dr. Julian Marsh",
    specialty: "Pediatría",
    email: "marsh_j@healthline.org",
    avatar: "",
    status: "pending",
  },
]
