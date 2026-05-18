"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { store } from "@/lib/mock-store"

export default function PatientProfilePage() {
  const router = useRouter()
  const pathname = usePathname()
  const patient = store.getPatientProfile()
  const user = store.getPatientUser()

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: pathname.startsWith("/patient/consultations") },
    { label: "Mensajes", icon: "chat", href: "/patient/messages", active: pathname === "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/profile", active: pathname === "/patient/profile" },
  ]

  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
  })
  const [recordatorios, setRecordatorios] = useState(true)
  const [language, setLanguage] = useState<"es" | "en">("es")

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopAppBar showProfile role="patient" />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-fixed text-2xl font-bold text-on-primary-fixed-variant">
            {patient.initials}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-headline text-2xl font-bold text-on-surface">
              {patient.name}
            </h1>
            <p className="font-body text-sm text-on-surface-variant">
              {user.email}
            </p>
            <span className="mt-1 inline-block rounded-full bg-surface-container-high px-3 py-1 font-label text-xs text-on-surface-variant">
              Miembro desde Oct 2024
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="mb-4 font-headline text-lg font-semibold text-on-surface">
                Información Personal
              </h2>
              <div className="space-y-4">
                <Field label="Nombre" value={patient.name} />
                <Field label="Email" value={user.email} />
                <Field label="Teléfono" value="+54 11 5555-0123" />
                <Field label="Fecha de Nacimiento" value="15 Mar 1996" />
                <Field label="Género" value={patient.gender} />
              </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lg text-error">warning</span>
                <h2 className="font-headline text-lg font-semibold text-on-surface">
                  Contacto de Emergencia
                </h2>
              </div>
              <div className="space-y-4">
                <Field label="Nombre" value={patient.emergencyContact.name} />
                <Field label="Teléfono" value={patient.emergencyContact.phone} />
                <Field label="Relación" value={patient.emergencyContact.relation} />
              </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="mb-4 font-headline text-lg font-semibold text-on-surface">
                Dirección
              </h2>
              <div className="space-y-4">
                <Field label="Calle" value="Av. Corrientes 1234" />
                <Field label="Ciudad" value="Buenos Aires" />
                <Field label="Código Postal" value="C1043AAZ" />
                <Field label="País" value="Argentina" />
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6">
            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm ring-2 ring-primary/10">
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">stethoscope</span>
                <h2 className="font-headline text-lg font-semibold text-on-surface">
                  Información Médica
                </h2>
              </div>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Grupo Sanguíneo</p>
                <div className="inline-flex items-center gap-2 rounded-xl bg-error-container px-4 py-2">
                  <span className="font-headline text-xl font-bold text-error">{patient.bloodType}</span>
                </div>
              </div>

              <div className="mb-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 font-label text-xs text-on-surface-variant">Altura</p>
                  <p className="font-body text-sm font-semibold text-on-surface">{patient.height}</p>
                </div>
                <div>
                  <p className="mb-1 font-label text-xs text-on-surface-variant">Peso</p>
                  <p className="font-body text-sm font-semibold text-on-surface">{patient.weight}</p>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Alergias</p>
                {patient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((a) => (
                      <span
                        key={a}
                        className="inline-flex items-center gap-1.5 rounded-full bg-error-container px-3 py-1 font-label text-sm text-error"
                      >
                        <span className="material-symbols-outlined text-[16px]">error_outline</span>
                        {a}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm italic text-on-surface-variant">Sin alergias registradas</p>
                )}
              </div>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Medicamentos actuales</p>
                {patient.medications.length > 0 ? (
                  <div className="space-y-2">
                    {patient.medications.map((m) => (
                      <div key={m} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-primary">medication</span>
                        <span className="font-body text-sm text-on-surface">{m}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm italic text-on-surface-variant">Sin medicamentos actuales</p>
                )}
              </div>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Condiciones crónicas</p>
                {patient.chronicConditions.length > 0 ? (
                  <div className="space-y-2">
                    {patient.chronicConditions.map((c) => (
                      <div key={c} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-tertiary">info</span>
                        <span className="font-body text-sm text-on-surface">{c}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm italic text-on-surface-variant">Sin condiciones crónicas</p>
                )}
              </div>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Cirugías previas</p>
                {patient.surgeries.length > 0 ? (
                  <div className="space-y-2">
                    {patient.surgeries.map((s) => (
                      <div key={s.name} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-secondary">biotech</span>
                        <span className="font-body text-sm text-on-surface">
                          {s.name} — <span className="text-on-surface-variant">{s.year}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm italic text-on-surface-variant">Sin cirugías previas</p>
                )}
              </div>

              <div>
                <p className="mb-2 font-label text-sm text-on-surface-variant">Antecedentes familiares</p>
                {patient.familyHistory.length > 0 ? (
                  <div className="space-y-2">
                    {patient.familyHistory.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base text-secondary">group</span>
                        <span className="font-body text-sm text-on-surface">{f}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-body text-sm italic text-on-surface-variant">Sin antecedentes registrados</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="mb-4 font-headline text-lg font-semibold text-on-surface">
                Vacunas
              </h2>
              <div className="space-y-3">
                {patient.vaccines.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3"
                  >
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    <div className="flex-1">
                      <p className="font-body text-sm font-medium text-on-surface">{v.name}</p>
                      <p className="font-label text-xs text-on-surface-variant">{v.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="mb-4 font-headline text-lg font-semibold text-on-surface">
                Preferencias
              </h2>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Idioma</p>
                <div className="flex rounded-xl bg-surface-container p-1">
                  <button
                    onClick={() => setLanguage("es")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      language === "es"
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Español
                  </button>
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      language === "en"
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    Inglés
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">Notificaciones</p>
                <div className="space-y-3">
                  <ToggleRow
                    label="Email"
                    checked={notifications.email}
                    onChange={(v) => setNotifications((p) => ({ ...p, email: v }))}
                  />
                  <ToggleRow
                    label="SMS"
                    checked={notifications.sms}
                    onChange={(v) => setNotifications((p) => ({ ...p, sms: v }))}
                  />
                  <ToggleRow
                    label="Push"
                    checked={notifications.push}
                    onChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
                  />
                </div>
              </div>

              <ToggleRow
                label="Recordatorios de consultas"
                checked={recordatorios}
                onChange={setRecordatorios}
              />
            </section>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" })
                router.push("/login")
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-error px-6 py-3 font-label text-sm font-semibold text-error transition-colors hover:bg-error-container active:bg-error/10"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </main>

      <BottomNavBar items={navItems} />
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block font-label text-xs text-on-surface-variant">
        {label}
      </label>
      <input
        type="text"
        value={value}
        readOnly
        className="w-full border-b border-outline-variant bg-transparent pb-2 font-body text-sm text-on-surface outline-none read-only:cursor-default"
      />
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-body text-sm text-on-surface">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        type="button"
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-outline-variant"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  )
}
