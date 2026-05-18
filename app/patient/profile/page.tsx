"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

export default function PatientProfilePage() {
  const router = useRouter()
  const pathname = usePathname()

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
            SM
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-headline text-2xl font-bold text-on-surface">
              Sarah Mitchell
            </h1>
            <p className="font-body text-sm text-on-surface-variant">
              s.mitchell@sanctuary.health
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
                <Field label="Nombre" value="Sarah Mitchell" />
                <Field
                  label="Email"
                  value="s.mitchell@sanctuary.health"
                />
                <Field label="Teléfono" value="+54 11 5555-0123" />
                <Field label="Fecha de Nacimiento" value="15 Mar 1996" />
                <Field label="Género" value="Femenino" />
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
            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="mb-4 font-headline text-lg font-semibold text-on-surface">
                Preferencias
              </h2>

              <div className="mb-5">
                <p className="mb-2 font-label text-sm text-on-surface-variant">
                  Idioma
                </p>
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
                <p className="mb-2 font-label text-sm text-on-surface-variant">
                  Notificaciones
                </p>
                <div className="space-y-3">
                  <ToggleRow
                    label="Email"
                    checked={notifications.email}
                    onChange={(v) =>
                      setNotifications((p) => ({ ...p, email: v }))
                    }
                  />
                  <ToggleRow
                    label="SMS"
                    checked={notifications.sms}
                    onChange={(v) =>
                      setNotifications((p) => ({ ...p, sms: v }))
                    }
                  />
                  <ToggleRow
                    label="Push"
                    checked={notifications.push}
                    onChange={(v) =>
                      setNotifications((p) => ({ ...p, push: v }))
                    }
                  />
                </div>
              </div>

              <div>
                <ToggleRow
                  label="Recordatorios de consultas"
                  checked={recordatorios}
                  onChange={setRecordatorios}
                />
              </div>
            </section>

            <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
              <h2 className="mb-4 font-headline text-lg font-semibold text-on-surface">
                Información Médica
              </h2>

              <div className="mb-4">
                <p className="mb-2 font-label text-sm text-on-surface-variant">
                  Alergias
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-error-container px-3 py-1 font-label text-sm text-error">
                    Penicilina
                  </span>
                  <span className="rounded-full bg-error-container px-3 py-1 font-label text-sm text-error">
                    Látex
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 font-label text-sm text-on-surface-variant">
                  Medicamentos
                </p>
                <p className="font-body text-sm text-on-surface">
                  Albuterol, Multivitamínico
                </p>
              </div>

              <div>
                <p className="mb-2 font-label text-sm text-on-surface-variant">
                  Grupo Sanguíneo
                </p>
                <p className="font-body text-sm font-semibold text-on-surface">
                  A+
                </p>
              </div>
            </section>

            <button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" })
                router.push("/login")
              }}
              className="w-full rounded-xl border-2 border-error px-6 py-3 font-label text-sm font-semibold text-error transition-colors hover:bg-error-container active:bg-error/10"
            >
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
