"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useSession } from "@/lib/use-session"
import { useToast } from "@/components/toast"

const priorities = [
  { value: "low", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
  { value: "critical", label: "Crítica" },
]

type CapturedError = {
  message: string
  stack?: string
  source?: string
}

export function BugReportWidget() {
  const { user, loading: sessionLoading } = useSession()
  const { toast } = useToast()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("normal")
  const [attachment, setAttachment] = useState<File | null>(null)
  const [capturedError, setCapturedError] = useState<CapturedError | null>(null)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    function handleError(event: ErrorEvent) {
      setCapturedError({
        message: event.message || "Error no controlado",
        stack: event.error instanceof Error ? event.error.stack : undefined,
        source: event.filename ? `${event.filename}:${event.lineno}:${event.colno}` : undefined,
      })
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      setCapturedError({ message: reason.message, stack: reason.stack, source: "unhandledrejection" })
    }

    window.addEventListener("error", handleError)
    window.addEventListener("unhandledrejection", handleRejection)
    return () => {
      window.removeEventListener("error", handleError)
      window.removeEventListener("unhandledrejection", handleRejection)
    }
  }, [])

  if (sessionLoading || !user) return null

  function openReport() {
    setOpen(true)
  }

  function closeReport() {
    if (sending) return
    setOpen(false)
  }

  async function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)

    const form = new FormData()
    form.set("title", title)
    form.set("description", description)
    form.set("priority", priority)
    form.set("pageUrl", window.location.href)
    form.set("userAgent", navigator.userAgent)

    if (capturedError) {
      form.set("errorContext", JSON.stringify({
        message: capturedError.message,
        stack: capturedError.stack,
        source: capturedError.source,
      }))
    }

    if (attachment) form.set("attachment", attachment)

    try {
      const response = await fetch("/api/bug-reports", { method: "POST", body: form })
      const json = await response.json()
      if (!response.ok || !json.ok) throw new Error(json.error || "No se pudo enviar el reporte")

      toast("Reporte enviado. Gracias por ayudarnos a mejorar TuSalud.", "success")
      setTitle("")
      setDescription("")
      setPriority("normal")
      setAttachment(null)
      setCapturedError(null)
      setOpen(false)
    } catch (error) {
      toast(error instanceof Error ? error.message : "No se pudo enviar el reporte", "error")
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openReport}
        aria-label="Reportar un problema"
        title="Reportar un problema"
        className="fixed bottom-24 right-4 z-[70] flex items-center gap-2 rounded-full bg-secondary px-4 py-3 text-sm font-semibold text-on-secondary shadow-xl transition hover:scale-[1.02] md:bottom-6"
      >
        <span className="material-symbols-outlined text-lg">bug_report</span>
        <span className="hidden sm:inline">Reportar un problema</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/35 p-4 backdrop-blur-sm sm:items-center">
          <div role="dialog" aria-modal="true" aria-labelledby="bug-report-title" className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-surface-container-lowest p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-secondary">Ayuda y soporte</p>
                <h2 id="bug-report-title" className="font-headline text-2xl font-bold text-on-surface">Reportar un problema</h2>
                <p className="mt-1 text-sm text-on-surface-variant">Contanos qué pasó y adjuntá una captura si podés.</p>
              </div>
              <button type="button" onClick={closeReport} aria-label="Cerrar" className="rounded-xl p-2 text-on-surface-variant hover:bg-surface-container-low">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={submitReport} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-on-surface">Título</span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  minLength={3}
                  maxLength={160}
                  placeholder="Ej.: No puedo enviar una consulta"
                  className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-on-surface">¿Qué ocurrió?</span>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  minLength={10}
                  maxLength={10000}
                  rows={5}
                  placeholder="Describí los pasos para reproducir el problema..."
                  className="w-full resize-y rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface">Prioridad</span>
                  <select value={priority} onChange={(event) => setPriority(event.target.value)} className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10">
                    {priorities.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-on-surface">Captura o foto <span className="font-normal text-on-surface-variant">(opcional)</span></span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setAttachment(event.target.files?.[0] ?? null)}
                    className="block w-full rounded-2xl border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-xs text-on-surface-variant file:mr-3 file:rounded-xl file:border-0 file:bg-primary-fixed file:px-3 file:py-2 file:font-semibold file:text-primary"
                  />
                </label>
              </div>

              <div className="rounded-2xl bg-surface-container-low px-4 py-3 text-xs text-on-surface-variant">
                <span className="font-semibold text-on-surface">Pantalla:</span> {pathname}
                {capturedError && <p className="mt-1 text-error">Detectamos un error técnico y lo adjuntaremos al reporte.</p>}
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeReport} disabled={sending} className="rounded-2xl px-5 py-3 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={sending} className="rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-lg shadow-primary/15 transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60">
                  {sending ? "Enviando..." : "Enviar reporte"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
