"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { useToast } from "@/components/toast"

export default function NewConsultation() {
  const router = useRouter()
  const [reason, setReason] = useState("")
  const [severity, setSeverity] = useState<string>("low")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  async function handleSubmit() {
    if (!reason.trim()) {
      setError("Contanos el motivo de la consulta")
      return
    }
    setSending(true)
    setError("")

    const res = await fetch("/api/patient/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason.trim(), severity }),
    })

    const json = await res.json()
    if (json.ok && json.data?.consultation?.id) {
      toast("Consulta creada correctamente", "success")
      router.push(`/patient/consultations/${json.data.consultation.id}`)
    } else {
      setError(json.error || "Error al crear la consulta")
      toast(json.error || "Error al crear la consulta", "error")
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Nueva consulta</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Contanos qué te está pasando para conectarte con el especialista indicado.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-error-container/50 px-4 py-3 text-sm font-medium text-error">
            {error}
          </div>
        )}

        <div>
          <label className="font-label text-sm font-semibold text-on-surface block mb-2">
            Motivo de la consulta
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe tus síntomas, inquietudes o el motivo de la consulta..."
            className="w-full bg-transparent border-b-2 border-outline-variant pb-3 pt-1 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors resize-none"
            rows={3}
            disabled={sending}
          />
        </div>

        <div>
          <label className="font-label text-sm font-semibold text-on-surface block mb-3">
            Gravedad de síntomas
          </label>
          <div className="flex gap-2">
            {[
              { id: "low", label: "Leve" },
              { id: "medium", label: "Moderado" },
              { id: "high", label: "Grave" },
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setSeverity(level.id)}
                disabled={sending}
                className={`flex-1 font-label text-sm font-semibold py-2.5 rounded-xl border transition-all ${
                  severity === level.id
                    ? "bg-primary-fixed text-primary border-primary"
                    : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-label text-sm font-semibold text-on-surface block mb-2">
            Referencia visual (opcional)
          </label>
          <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center gap-3 text-center hover:border-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">add_a_photo</span>
            <div>
              <p className="font-label text-sm font-medium text-on-surface">Tocá para subir una imagen</p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">PNG, JPG hasta 10MB</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl">lock</span>
            <div>
              <p className="font-label text-xs font-semibold text-on-surface">Datos seguros</p>
              <p className="font-body text-[11px] text-on-surface-variant mt-0.5">Encriptado de extremo a extremo</p>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl">timer</span>
            <div>
              <p className="font-label text-xs font-semibold text-on-surface">Espera típica</p>
              <p className="font-body text-[11px] text-on-surface-variant mt-0.5">&lt; 15 min</p>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-8 pt-3">
        <div className="bg-surface-container-lowest/85 backdrop-blur-2xl rounded-2xl p-4 flex items-center justify-between shadow-[0_-4px_32px_rgba(25,28,30,0.08)] max-w-lg mx-auto">
          <div>
            <p className="font-label text-xs font-semibold text-on-surface-variant">Costo</p>
            <p className="font-headline text-xl font-bold text-on-surface">1 Token</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={sending}
            className="primary-gradient text-white font-label text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            {sending ? "Enviando..." : "Empezar consulta"}
          </button>
        </div>
      </div>
    </div>
  )
}
