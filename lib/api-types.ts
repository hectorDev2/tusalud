export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: string
}

export interface DoctorApproval {
  id: string
  name: string
  specialty: string
  email: string
  avatar: string
  status: "pending" | "verified"
}

export interface User {
  id: string
  email: string
  name: string
  role: "patient" | "doctor" | "admin"
  avatar: string
  token: string
}

export interface AuthResponse {
  user: User
}

export interface Message {
  id: string
  from: string
  fromName: string
  fromInitials: string
  preview: string
  time: string
  unread: boolean
  threadId: string
}

export interface AgendaSlot {
  time: string
  type: "appointment" | "free" | "break"
  patientName?: string
  initials?: string
  reason?: string
  duration?: string
  status?: "en-curso" | "pendiente" | "completada" | "cancelada"
}

export interface AdminStats {
  activeUsers: number
  totalConsultations: number
  pendingApprovals: number
  tokensInCirculation: number
  tokensUsedThisWeek: number
  tokensNewThisWeek: number
  usageRate: number
}

export interface PatientRecord {
  id: string
  name: string
  email: string
  age: number
  lastConsultation: string
  status: "activo" | "inactivo"
}

export interface UserRecord {
  id: string
  name: string
  email: string
  role: "paciente" | "doctor" | "administrador"
  status: "activo" | "suspendido" | "pendiente"
}

export interface AdminTokenTransaction {
  id: string
  userName: string
  initials: string
  description: string
  amount: number
  date: string
  status: "completado" | "pendiente"
}

export function ok<T>(data: T): ApiResponse<T> {
  return { ok: true, data }
}

export function err(error: string): ApiResponse<never> {
  return { ok: false, error }
}
