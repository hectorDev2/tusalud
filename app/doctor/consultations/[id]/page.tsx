"use client"

import { use, useState, useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { useChat } from "@/lib/use-chat"
import { useSession } from "@/lib/use-session"
import { useToast } from "@/components/toast"

interface PatientData {
  id: string
  name: string
  avatar: string
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

interface ConsultationMeta {
  status: string
  reason: string | null
  closure_summary: string | null
  requires_formal_consultation: boolean | null
}

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useSession()
  const { toast } = useToast()
  const { messages, loading, sending, sendMessage } = useChat(id, user?.id || "")
  const [input, setInput] = useState("")
  const [patient, setPatient] = useState<PatientData | null>(null)
  const [patientLoading, setPatientLoading] = useState(true)
  const [patientError, setPatientError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [consultation, setConsultation] = useState<ConsultationMeta | null>(null)
  const chatEnd = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close modal state
  const [closeModalOpen, setCloseModalOpen] = useState(false)
  const [summary, setSummary] = useState("")
  const [escalate, setEscalate] = useState(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/doctor/consultations/${id}`)
      .then(async (response) => {
        const json = await response.json()
        if (!response.ok || !json.ok) {
          throw new Error(json.error || "No se pudo cargar la consulta")
        }
        return json
      })
      .then((json) => {
        if (cancelled) return

        const c = json.data.consultation
        setConsultation({
          status: c.status,
          reason: c.reason,
          closure_summary: c.closure_summary,
          requires_formal_consultation: c.requires_formal_consultation,
        })

        const profile = c.patient
        const patientInfo = Array.isArray(c.patient_info) ? c.patient_info[0] : c.patient_info
        const clinical = Array.isArray(patientInfo?.patient_data)
          ? patientInfo.patient_data[0]
          : patientInfo?.patient_data

        if (profile) {
          const initials = profile.name
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "??"
          setPatient({
            id: profile.id,
            name: profile.name,
            avatar: profile.avatar ?? "",
            initials,
            age: clinical?.age ?? 0,
            gender: clinical?.gender ?? "",
            allergies: clinical?.allergies ?? [],
            medications: clinical?.medications ?? [],
            bloodPressure: clinical?.blood_pressure ?? "-",
            heartRate: clinical?.heart_rate ?? 0,
            bloodType: clinical?.blood_type ?? "-",
            height: clinical?.height ?? "-",
            weight: clinical?.weight ?? "-",
            vaccines: clinical?.vaccines ?? [],
            chronicConditions: clinical?.chronic_conditions ?? [],
            surgeries: clinical?.surgeries ?? [],
            familyHistory: clinical?.family_history ?? [],
            emergencyContact: clinical?.emergency_contact ?? { name: "", phone: "", relation: "" },
          })
        }
        setPatientError(null)
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPatientError(error instanceof Error ? error.message : "No se pudo cargar la consulta")
        }
      })
      .finally(() => {
        if (!cancelled) setPatientLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id, retryCount])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    const sent = await sendMessage(input)
    if (sent) setInput("")
    inputRef.current?.focus()
  }

  async function handleClose() {
    if (!summary.trim()) return
    setClosing(true)
    try {
      const res = await fetch(`/api/doctor/consultations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "close",
          closure_summary: summary,
          requires_formal_consultation: escalate,
        }),
      })
      const json = await res.json()
      if (!json.ok) {
        toast(json.error || "No se pudo cerrar la consulta", "error")
        return
      }
      setConsultation((prev) => prev ? { ...prev, status: "closed", closure_summary: summary } : null)
      setCloseModalOpen(false)
      toast("Consulta cerrada correctamente", "success")
      setTimeout(() => router.push("/doctor/consultations"), 1500)
    } finally {
      setClosing(false)
    }
  }

  const isClosed = consultation?.status === "closed" || consultation?.status === "completed"

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <div className="max-w-lg mx-auto px-4 pt-28 pb-4">
        {patientError && (
          <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-error/30 bg-error-container px-4 py-3 text-sm text-on-error-container">
            <span>{patientError}</span>
            <button
              type="button"
              onClick={() => {
                setPatientError(null)
                setPatientLoading(true)
                setRetryCount((count) => count + 1)
              }}
              className="shrink-0 rounded-xl bg-error px-3 py-1.5 font-semibold text-on-error"
            >
              Reintentar
            </button>
          </div>
        )}
        <div className="flex lg:flex-row flex-col gap-6">
          {/* Chat area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isClosed ? "bg-outline" : messages.length > 0 ? "bg-tertiary animate-pulse" : "bg-outline"}`} />
                <span className="text-sm font-semibold text-on-surface">
                  {isClosed ? "Consulta cerrada" : messages.length > 0 ? "Consulta en vivo" : "Esperando mensajes..."}
                </span>
              </div>

              {!isClosed && (
                <button
                  onClick={() => setCloseModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-error-container text-error text-xs font-semibold hover:bg-error hover:text-on-error transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Cerrar consulta
                </button>
              )}
            </div>

            {/* Closure summary banner (if closed) */}
            {isClosed && consultation?.closure_summary && (
              <div className="mb-4 bg-surface-container-low rounded-2xl p-4 border border-outline-variant/20">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Resumen clínico</p>
                <p className="text-sm text-on-surface">{consultation.closure_summary}</p>
                {consultation.requires_formal_consultation && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-primary font-semibold">
                    <span className="material-symbols-outlined text-[14px]">video_call</span>
                    Requiere consulta formal
                  </div>
                )}
              </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant overflow-hidden">
                  {patient?.avatar ? (
                    <div
                      role="img"
                      aria-label={`Avatar de ${patient.name}`}
                      className="h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${patient.avatar})` }}
                    />
                  ) : patient?.initials || "??"}
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    {patientLoading ? "Cargando..." : patient?.name || "Paciente sin nombre"}
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
                      <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">chat</span>
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

              <form onSubmit={handleSend} className="flex items-center gap-3 px-5 py-4 border-t border-outline-variant/30 bg-surface-container-lowest">
                <button type="button" className="text-on-surface-variant hover:text-primary transition-colors shrink-0">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isClosed ? "Consulta cerrada" : "Escribí tu mensaje..."}
                  disabled={sending || isClosed}
                  className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending || isClosed}
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
              <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold font-headline text-on-surface">Información del paciente</h3>
                  <span className="text-[10px] font-bold text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">Verificado</span>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-base font-bold text-on-surface-variant overflow-hidden">
                    {patient.avatar ? (
                      <div
                        role="img"
                        aria-label={`Avatar de ${patient.name}`}
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${patient.avatar})` }}
                      />
                    ) : patient.initials}
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
                        <div key={String(m)} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-primary">medication</span>
                          <span className="text-xs text-on-surface">{String(m)}</span>
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
                        <p className="text-xs text-on-surface-variant">Frec. cardíaca</p>
                        <p className="text-lg font-bold font-headline text-on-surface">{patient.heartRate} <span className="text-xs font-normal text-on-surface-variant">lpm</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {patient.emergencyContact?.name && (
                <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
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

      {/* Close consultation modal */}
      {closeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-[#1a1d21]/60 backdrop-blur-md" onClick={() => !closing && setCloseModalOpen(false)} />

          <div className="relative w-full md:max-w-lg bg-surface-container-lowest rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-4 border-b border-outline-variant/10">
              <div className="flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold text-on-surface">Cerrar consulta</h2>
                <button
                  onClick={() => setCloseModalOpen(false)}
                  disabled={closing}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors disabled:opacity-40"
                >
                  <span className="material-symbols-outlined text-on-surface-variant">close</span>
                </button>
              </div>
              <p className="font-body text-sm text-on-surface-variant mt-1">
                Dejá un resumen clínico para el paciente. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  Resumen clínico <span className="text-error">*</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Describí el diagnóstico presuntivo, indicaciones y próximos pasos para el paciente..."
                  rows={5}
                  className="mt-2 w-full bg-surface-container-low border-none rounded-2xl p-4 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/50 resize-none"
                />
                <p className="text-[11px] text-on-surface-variant mt-1 text-right">{summary.length} caracteres</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setEscalate((v) => !v)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    escalate ? "bg-primary border-primary" : "border-outline-variant"
                  }`}
                >
                  {escalate && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Requiere consulta formal</p>
                  <p className="text-xs text-on-surface-variant">El caso amerita una videollamada o consulta presencial</p>
                </div>
              </label>

              <div className="bg-error-container/40 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
                <p className="font-body text-xs text-on-surface-variant">
                  Al cerrar la consulta, el paciente no podrá enviar más mensajes. El resumen quedará visible en su historial.
                </p>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => setCloseModalOpen(false)}
                  disabled={closing}
                  className="flex-1 py-3.5 rounded-2xl border border-outline-variant/30 font-headline font-semibold text-on-surface hover:bg-surface-container-low transition-all disabled:opacity-40"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClose}
                  disabled={!summary.trim() || closing}
                  className="flex-1 py-3.5 rounded-2xl bg-error text-on-error font-headline font-semibold shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {closing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cerrando...
                    </>
                  ) : (
                    "Confirmar cierre"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
