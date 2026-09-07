"use client"

import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { useToast } from "@/components/toast"

interface Medication {
  name: string
  dose: string
  frequency: string
}

interface ClinicalHistory {
  allergies: string[]
  medications: Medication[]
  chronic_conditions: string[]
}

// ── Inline tag-list editor ────────────────────────────────────────────────────
function TagList({
  label,
  icon,
  items,
  color,
  placeholder,
  onAdd,
  onRemove,
  saving,
}: {
  label: string
  icon: string
  items: string[]
  color: "error" | "primary" | "tertiary"
  placeholder: string
  onAdd: (v: string) => void
  onRemove: (i: number) => void
  saving: boolean
}) {
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const colorMap = {
    error: {
      badge: "bg-error-container text-error",
      ring: "focus:ring-error/30",
      btn: "bg-error text-on-error hover:bg-error/90",
    },
    primary: {
      badge: "bg-primary-fixed/20 text-primary",
      ring: "focus:ring-primary/30",
      btn: "bg-primary text-on-primary hover:bg-primary/90",
    },
    tertiary: {
      badge: "bg-tertiary-fixed/20 text-tertiary",
      ring: "focus:ring-tertiary/30",
      btn: "bg-tertiary text-white hover:bg-tertiary/90",
    },
  }[color]

  function submit() {
    const v = input.trim()
    if (!v) return
    onAdd(v)
    setInput("")
    inputRef.current?.focus()
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-on-surface-variant">{icon}</span>
        <h3 className="font-headline font-semibold text-on-surface">{label}</h3>
        <span className="ml-auto text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4 min-h-[28px]">
        {items.length === 0 ? (
          <span className="text-xs text-on-surface-variant/60">Sin registros</span>
        ) : (
          items.map((item, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${colorMap.badge}`}>
              {item}
              <button
                onClick={() => onRemove(i)}
                disabled={saving}
                className="hover:opacity-70 transition-opacity disabled:opacity-40"
                aria-label={`Eliminar ${item}`}
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </span>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), submit())}
          placeholder={placeholder}
          disabled={saving}
          className={`flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 ${colorMap.ring} placeholder:text-on-surface-variant/50 disabled:opacity-50`}
        />
        <button
          onClick={submit}
          disabled={!input.trim() || saving}
          className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${colorMap.btn}`}
        >
          Agregar
        </button>
      </div>
    </div>
  )
}

// ── Medication list editor ────────────────────────────────────────────────────
function MedicationList({
  items,
  onAdd,
  onRemove,
  saving,
}: {
  items: Medication[]
  onAdd: (m: Medication) => void
  onRemove: (i: number) => void
  saving: boolean
}) {
  const blank: Medication = { name: "", dose: "", frequency: "" }
  const [draft, setDraft] = useState<Medication>(blank)
  const [showForm, setShowForm] = useState(false)

  function submit() {
    if (!draft.name.trim()) return
    onAdd({ name: draft.name.trim(), dose: draft.dose.trim(), frequency: draft.frequency.trim() })
    setDraft(blank)
    setShowForm(false)
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-on-surface-variant">medication</span>
        <h3 className="font-headline font-semibold text-on-surface">Medicamentos activos</h3>
        <span className="ml-auto text-xs font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {items.length === 0 ? (
          <p className="text-xs text-on-surface-variant/60">Sin medicamentos registrados</p>
        ) : (
          items.map((m, i) => (
            <div key={i} className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3">
              <span className="material-symbols-outlined text-primary text-[18px]">medication</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{m.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {[m.dose, m.frequency].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => onRemove(i)}
                disabled={saving}
                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-40"
                aria-label={`Eliminar ${m.name}`}
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          ))
        )}
      </div>

      {showForm ? (
        <div className="border border-outline-variant/20 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Nuevo medicamento</p>
          <input
            type="text"
            placeholder="Nombre *"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="w-full bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Dosis (ej: 500mg)"
              value={draft.dose}
              onChange={(e) => setDraft((d) => ({ ...d, dose: e.target.value }))}
              className="bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50"
            />
            <input
              type="text"
              placeholder="Frecuencia (ej: 2x día)"
              value={draft.frequency}
              onChange={(e) => setDraft((d) => ({ ...d, frequency: e.target.value }))}
              className="bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowForm(false); setDraft(blank) }}
              className="flex-1 py-2.5 rounded-xl border border-outline-variant/30 text-sm font-semibold text-on-surface hover:bg-surface-container-low transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={!draft.name.trim() || saving}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Agregar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          disabled={saving}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-outline-variant/40 text-sm font-semibold text-on-surface-variant hover:border-primary hover:text-primary transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Agregar medicamento
        </button>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function PatientHistoryPage() {
  const pathname = usePathname()
  const { toast } = useToast()

  const [history, setHistory] = useState<ClinicalHistory>({
    allergies: [],
    medications: [],
    chronic_conditions: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/patient/clinical-history")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data.clinicalHistory) {
          const h = json.data.clinicalHistory
          setHistory({
            allergies: (h.allergies as string[]) ?? [],
            medications: (h.medications as Medication[]) ?? [],
            chronic_conditions: (h.chronic_conditions as string[]) ?? [],
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(patch: Partial<ClinicalHistory>) {
    setSaving(true)
    try {
      const res = await fetch("/api/patient/clinical-history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      })
      const json = await res.json()
      if (!json.ok) {
        toast(json.error || "No se pudo guardar", "error")
        return false
      }
      return true
    } finally {
      setSaving(false)
    }
  }

  async function addAllergy(v: string) {
    const next = [...history.allergies, v]
    const ok = await save({ allergies: next })
    if (ok) { setHistory((h) => ({ ...h, allergies: next })); toast("Alergia agregada", "success") }
  }
  async function removeAllergy(i: number) {
    const next = history.allergies.filter((_, idx) => idx !== i)
    const ok = await save({ allergies: next })
    if (ok) setHistory((h) => ({ ...h, allergies: next }))
  }

  async function addMedication(m: Medication) {
    const next = [...history.medications, m]
    const ok = await save({ medications: next })
    if (ok) { setHistory((h) => ({ ...h, medications: next })); toast("Medicamento agregado", "success") }
  }
  async function removeMedication(i: number) {
    const next = history.medications.filter((_, idx) => idx !== i)
    const ok = await save({ medications: next })
    if (ok) setHistory((h) => ({ ...h, medications: next }))
  }

  async function addCondition(v: string) {
    const next = [...history.chronic_conditions, v]
    const ok = await save({ chronic_conditions: next })
    if (ok) { setHistory((h) => ({ ...h, chronic_conditions: next })); toast("Condición agregada", "success") }
  }
  async function removeCondition(i: number) {
    const next = history.chronic_conditions.filter((_, idx) => idx !== i)
    const ok = await save({ chronic_conditions: next })
    if (ok) setHistory((h) => ({ ...h, chronic_conditions: next }))
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="patient" />

      <div className="max-w-lg mx-auto px-4 pt-28">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-headline text-on-surface tracking-tight">Historial médico</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Esta información es visible para los médicos durante tus consultas.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 shadow-[0_12px_48px_rgba(25,28,30,0.06)] animate-pulse">
                <div className="h-4 bg-surface-container-high rounded w-1/3 mb-4" />
                <div className="h-8 bg-surface-container-low rounded-full w-24" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <TagList
              label="Alergias"
              icon="warning"
              items={history.allergies}
              color="error"
              placeholder="Ej: Penicilina, mariscos, látex..."
              onAdd={addAllergy}
              onRemove={removeAllergy}
              saving={saving}
            />

            <MedicationList
              items={history.medications}
              onAdd={addMedication}
              onRemove={removeMedication}
              saving={saving}
            />

            <TagList
              label="Condiciones crónicas"
              icon="monitor_heart"
              items={history.chronic_conditions}
              color="primary"
              placeholder="Ej: Diabetes tipo 2, hipertensión..."
              onAdd={addCondition}
              onRemove={removeCondition}
              saving={saving}
            />

            {saving && (
              <div className="flex items-center justify-center gap-2 py-2">
                <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-on-surface-variant">Guardando...</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
          { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: false },
          { label: "Historial", icon: "health_and_safety", href: "/patient/history", active: true },
          { label: "Cuenta", icon: "account_circle", href: "/patient/profile", active: false },
        ]}
      />
    </div>
  )
}
