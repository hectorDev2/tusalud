"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const specialties = [
  { id: "general", label: "Médica General", icon: "stethoscope" },
  { id: "dermatology", label: "Dermatología", icon: "dermatology" },
  { id: "cardiology", label: "Cardiología", icon: "monitor_heart" },
  { id: "neurology", label: "Neurología", icon: "psychology" },
  { id: "pediatrics", label: "Pediatría", icon: "pediatrics" },
  { id: "psychiatry", label: "Psiquiatría", icon: "psychiatry" },
]

const severityLevels = [
  {
    id: "low",
    label: "Leve",
    desc: "Molestia menor, puede esperar",
    color: "bg-tertiary-fixed/20 text-tertiary border-tertiary-fixed/30",
    activeColor: "bg-tertiary text-on-tertiary border-tertiary",
  },
  {
    id: "medium",
    label: "Moderado",
    desc: "Incomodidad constante, requiere atención",
    color: "bg-primary-fixed/20 text-primary border-primary-fixed/30",
    activeColor: "bg-primary text-on-primary border-primary",
  },
  {
    id: "high",
    label: "Urgente",
    desc: "Dolor intenso, atención inmediata",
    color: "bg-error-container/50 text-error border-error-container",
    activeColor: "bg-error text-on-error border-error",
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function NewConsultationModal({ open, onClose }: Props) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [reason, setReason] = useState("")
  const [specialty, setSpecialty] = useState("")
  const [severity, setSeverity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open) return null

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const res = await fetch("/api/patient/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, severity }),
    })

    const json = await res.json()

    if (!json.ok) {
      setError(json.error || "Error al crear la consulta")
      setLoading(false)
      return
    }

    setLoading(false)
    onClose()
    router.push(`/patient/consultations/${json.data.consultation.id}`)
  }

  function canAdvance(): boolean {
    if (step === 0) return reason.trim().length >= 10
    if (step === 1) return specialty !== ""
    if (step === 2) return severity !== ""
    return true
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full md:max-w-lg bg-surface-container-lowest rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90dvh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-surface-container-lowest z-10 px-6 pt-6 pb-4 border-b border-outline-variant/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-xl font-bold text-on-surface">Nueva consulta</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
          </div>

          {/* Progress */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-surface-container-high"
                }`}
              />
            ))}
          </div>
          <p className="font-label text-xs text-on-surface-variant mt-2">
            Paso {step + 1} de 4
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-error-container/50 px-4 py-3 text-sm font-medium text-error">
              {error}
            </div>
          )}

          {/* Step 0: Reason */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">
                  ¿Cuál es tu motivo de consulta?
                </h3>
                <p className="font-body text-sm text-on-surface-variant mt-1">
                  Describí tus síntomas o el motivo por el que querés consultar.
                </p>
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ej: Hace 3 días que tengo dolor de cabeza persistente y fiebre..."
                rows={5}
                className="w-full bg-surface-container-low border-none rounded-2xl p-5 text-base text-on-surface outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant/50 resize-none"
              />
              <p className="font-label text-xs text-on-surface-variant text-right">
                {reason.length} caracteres (mín. 10)
              </p>
            </div>
          )}

          {/* Step 1: Specialty */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">
                  ¿Qué especialidad necesitás?
                </h3>
                <p className="font-body text-sm text-on-surface-variant mt-1">
                  Seleccioná el tipo de médico que mejor se ajuste a tu consulta.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {specialties.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSpecialty(s.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                      specialty === s.id
                        ? "border-primary bg-primary-fixed/20 text-primary"
                        : "border-outline-variant/20 bg-surface-container-low text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                    <span className="font-headline font-semibold">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Severity */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">
                  ¿Qué tan urgente es?
                </h3>
                <p className="font-body text-sm text-on-surface-variant mt-1">
                  Esto ayuda a priorizar tu consulta.
                </p>
              </div>
              <div className="space-y-3">
                {severityLevels.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeverity(s.id)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${
                      severity === s.id ? s.activeColor : s.color
                    }`}
                  >
                    <p className="font-headline font-bold text-lg">{s.label}</p>
                    <p className="font-body text-sm mt-0.5 opacity-80">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Summary & Confirm */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-headline text-lg font-semibold text-on-surface">
                  Revisá tu consulta
                </h3>
                <p className="font-body text-sm text-on-surface-variant mt-1">
                  Confirmá los datos antes de enviar.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-surface-container-low rounded-2xl p-5 space-y-1">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Motivo</p>
                  <p className="font-body text-sm text-on-surface">{reason}</p>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-5 space-y-1">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Especialidad</p>
                  <p className="font-headline font-semibold text-on-surface">
                    {specialties.find((s) => s.id === specialty)?.label}
                  </p>
                </div>
                <div className="bg-surface-container-low rounded-2xl p-5 space-y-1">
                  <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Urgencia</p>
                  <p className="font-headline font-semibold text-on-surface">
                    {severityLevels.find((s) => s.id === severity)?.label}
                  </p>
                </div>
              </div>

              <div className="bg-primary-fixed/20 rounded-2xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">info</span>
                <p className="font-body text-xs text-on-surface-variant">
                  Al enviar, se descontará 1 token de tu cuenta. Podés cancelar en cualquier momento.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-3.5 rounded-2xl border border-outline-variant/30 font-headline font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                Atrás
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl border border-outline-variant/30 font-headline font-semibold text-on-surface hover:bg-surface-container-low transition-all"
              >
                Cancelar
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className="flex-1 py-3.5 rounded-2xl primary-gradient font-headline font-semibold text-on-primary shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3.5 rounded-2xl primary-gradient font-headline font-semibold text-on-primary shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Confirmar y enviar"
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (min-width: 768px) {
          .animate-slide-up {
            animation: slide-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
        }
      `}</style>
    </div>
  )
}
