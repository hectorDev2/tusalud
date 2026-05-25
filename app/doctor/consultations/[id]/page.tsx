"use client"

import { use, useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { useChat } from "@/lib/use-chat"
import { useSession } from "@/lib/use-session"

interface PatientData {
  id: string
  name: string
  initials: string
  age: number
  gender: string
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

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pathname = usePathname()
  const { user } = useSession()
  const { messages, loading, sending, sendMessage } = useChat(id, user?.id || "")
  const [input, setInput] = useState("")
  const [patient, setPatient] = useState<PatientData | null>(null)
  const chatEnd = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/doctor/consultations/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data?.consultation?.patient) {
          const p = json.data.consultation.patient
          const initials = p.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??"

          setPatient({
            id: p.id,
            name: p.name,
            initials,
            age: p.age,
            gender: p.gender,
            allergies: p.allergies || [],
            medications: p.medications || [],
            bloodPressure: p.blood_pressure,
            heartRate: p.heart_rate,
            bloodType: p.blood_type,
            height: p.height,
            weight: p.weight,
            vaccines: p.vaccines || [],
            chronicConditions: p.chronic_conditions || [],
            surgeries: p.surgeries || [],
            familyHistory: p.family_history || [],
            emergencyContact: p.emergency_contact || { name: "", phone: "", relation: "" },
          })
        }
      })
  }, [id])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    const ok = await sendMessage(input)
    if (ok) setInput("")
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <div className="max-w-lg mx-auto px-4 pt-28 pb-4">
        <div className="flex lg:flex-row flex-col gap-6">
          {/* Chat area */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className={`w-2.5 h-2.5 rounded-full ${messages.length > 0 ? "bg-tertiary animate-pulse" : "bg-outline"}`} />
              <span className="text-sm font-semibold text-on-surface">
                {messages.length > 0 ? "Consulta en vivo" : "Esperando mensajes..."}
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                  {patient?.initials || "??"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {patient?.name || "Cargando..."}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {loading ? "Cargando mensajes..." : `${messages.length} mensajes`}
                  </p>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto p-5 space-y-4 no-scrollbar bg-surface-container-low/30">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse flex flex-col items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-high" />
                      <p className="text-sm text-on-surface-variant">Cargando conversación...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                        chat
                      </span>
                      <p className="mt-2 text-sm text-on-surface-variant">
                        No hay mensajes todavía. Enviá el primer mensaje para iniciar la consulta.
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender_id === user?.id
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                            isMe
                              ? "bg-primary text-white rounded-br-sm"
                              : "bg-surface-container-low text-on-surface rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? "text-white/60" : "text-on-surface-variant/60"}`}>
                            {new Date(msg.created_at).toLocaleTimeString("es-AR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={chatEnd} />
              </div>

              <form onSubmit={handleSend} className="flex items-center gap-3 px-5 py-4 border-t border-outline-variant/30 bg-white">
                <button type="button" className="text-on-surface-variant hover:text-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribí tu mensaje..."
                  disabled={sending}
                  className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100 shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {sending ? "hourglass" : "send"}
                  </span>
                </button>
              </form>
            </div>
          </div>

          {/* Patient info sidebar */}
          {patient && (
            <div className="lg:w-80 w-full space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-headline text-on-surface">
                    Información del paciente
                  </h3>
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                    Verificado
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-base font-bold text-on-surface-variant">
                    {patient.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{patient.name}</p>
                    <p className="text-xs text-on-surface-variant">{patient.age} años &middot; {patient.gender}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Alergias</p>
                    <div className="flex flex-wrap gap-2">
                      {patient.allergies.length > 0 ? patient.allergies.map((a) => (
                        <span key={a} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-error-container text-error">{a}</span>
                      )) : <span className="text-xs text-on-surface-variant/70">Sin alergias registradas</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Medicación activa</p>
                    <div className="space-y-2">
                      {patient.medications.length > 0 ? patient.medications.map((m) => (
                        <div key={m} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">medication</span>
                          <span className="text-xs text-on-surface">{m}</span>
                        </div>
                      )) : <span className="text-xs text-on-surface-variant/70">Sin medicación activa</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">Signos vitales</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-low rounded-xl p-3 text-center">
                        <p className="text-xs text-on-surface-variant">Presión arterial</p>
                        <p className="text-lg font-bold font-headline text-on-surface">{patient.bloodPressure}</p>
                      </div>
                      <div className="bg-surface-container-low rounded-xl p-3 text-center">
                        <p className="text-xs text-on-surface-variant">Frecuencia cardíaca</p>
                        <p className="text-lg font-bold font-headline text-on-surface">{patient.heartRate} <span className="text-xs font-normal text-on-surface-variant">lpm</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {patient.emergencyContact && (
                <div className="bg-white rounded-xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                  <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">Contacto de emergencia</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px] text-tertiary">emergency</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{patient.emergencyContact.name}</p>
                      <p className="text-xs text-on-surface-variant">{patient.emergencyContact.phone}</p>
                      <p className="text-[11px] text-on-surface-variant/70">{patient.emergencyContact.relation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: false },
          { label: "Consultas", icon: "group", href: "/doctor/consultations", active: pathname.startsWith("/doctor/consultations") },
          { label: "Agenda", icon: "calendar_month", href: "/doctor/agenda", active: false },
          { label: "Perfil", icon: "person", href: "/doctor/profile", active: false },
        ]}
      />
    </div>
  )
}
