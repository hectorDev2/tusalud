"use client"

import { use } from "react"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { store } from "@/lib/mock-store"

export default function ConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pathname = usePathname()

  const consultation = store.getConsultation(id)
  const patient = consultation?.patient ?? store.getPatientProfile()

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="doctor" />

      <div className="max-w-lg mx-auto px-4 pt-28 pb-4">
        <nav className="flex items-center gap-4 border-b border-outline-variant/40 mb-6">
          <button className="pb-3 border-b-2 border-primary text-primary text-sm font-semibold">
            Sesión activa
          </button>
          <button className="pb-3 text-on-surface-variant text-sm font-medium hover:text-primary transition-colors">
            Registros
          </button>
        </nav>

        <div className="flex lg:flex-row flex-col gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
              <span className="text-sm font-semibold text-on-surface">
                Consulta en vivo
              </span>
              <span className="text-xs font-mono text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full ml-auto">
                00:14:22
              </span>
            </div>

            <div className="bg-white rounded-xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-outline-variant/30">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface-variant">
                  SM
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Sarah Mitchell
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    Escribiendo historial médico...
                  </p>
                </div>
              </div>

              <div className="h-[400px] overflow-y-auto p-5 space-y-4 no-scrollbar">
                <div className="flex justify-start">
                  <div className="bg-surface-container-low rounded-2xl rounded-bl-sm max-w-[80%] px-4 py-3">
                    <p className="text-sm text-on-surface">
                      Doctor, vengo sintiendo esta opresión en el pecho desde
                      hace varios días. Empeora cuando me acuesto.
                    </p>
                    <p className="text-[10px] text-on-surface-variant/60 text-right mt-1">
                      09:31 AM
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="bg-primary text-white rounded-2xl rounded-br-sm max-w-[80%] px-4 py-3">
                    <p className="text-sm">
                      Entiendo. ¿El dolor se irradia hacia tu brazo izquierdo o
                      mandíbula? ¿Y notaste falta de aire al hacer actividad?
                    </p>
                    <p className="text-[10px] text-white/60 text-right mt-1">
                      09:32 AM
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-surface-container-low rounded-2xl rounded-bl-sm max-w-[80%] px-4 py-3">
                    <p className="text-sm text-on-surface">
                      Sí, especialmente cuando subo las escaleras a mi departamento.
                      Tengo que parar a la mitad para recuperar el aliento.
                    </p>
                    <p className="text-[10px] text-on-surface-variant/60 text-right mt-1">
                      09:33 AM
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 px-5 py-4 border-t border-outline-variant/30 bg-white">
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">attach_file</span>
                </button>
                <input
                  type="text"
                  placeholder="Escribí tu mensaje..."
                  className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50"
                />
                <button className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    send
                  </span>
                </button>
              </div>
            </div>
          </div>

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
                  <p className="text-sm font-semibold text-on-surface">
                    {patient.name}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {patient.age} años &middot; {patient.gender}
                  </p>
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Alergias
                </p>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((a) => (
                      <span
                        key={a}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-error-container text-error"
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant/70">
                      Sin alergias registradas
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Medicación activa
                </p>
                <div className="space-y-2">
                  {patient.medications.length > 0 ? (
                    patient.medications.map((m) => (
                      <div key={m} className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-primary">
                          medication
                        </span>
                        <span className="text-xs text-on-surface">{m}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-on-surface-variant/70">
                      Sin medicación activa
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                  Signos vitales
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container-low rounded-xl p-3 text-center">
                    <p className="text-xs text-on-surface-variant">
                      Presión arterial
                    </p>
                    <p className="text-lg font-bold font-headline text-on-surface">
                      {patient.bloodPressure}
                    </p>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-3 text-center">
                    <p className="text-xs text-on-surface-variant">
                      Frecuencia cardíaca
                    </p>
                    <p className="text-lg font-bold font-headline text-on-surface">
                      {patient.heartRate}{" "}
                      <span className="text-xs font-normal text-on-surface-variant">
                        lpm
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-outline-variant/20 my-5" />

              <details className="group mb-3">
                <summary className="flex items-center justify-between cursor-pointer list-none py-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  <span>Historial Clínico</span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-error shrink-0">
                      water_drop
                    </span>
                    <span className="text-xs text-on-surface">
                      <span className="font-semibold">Grupo Sanguíneo:</span>{" "}
                      {patient.bloodType}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary shrink-0">
                      straighten
                    </span>
                    <span className="text-xs text-on-surface">
                      <span className="font-semibold">Altura / Peso:</span>{" "}
                      {patient.height} / {patient.weight}
                    </span>
                  </div>

                  {patient.chronicConditions.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">
                        Condiciones Crónicas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {patient.chronicConditions.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface"
                          >
                            <span className="material-symbols-outlined text-[14px] text-tertiary">
                              pill
                            </span>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.surgeries.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">
                        Cirugías Previas
                      </p>
                      <div className="space-y-1.5">
                        {patient.surgeries.map((s) => (
                          <div
                            key={s.name}
                            className="flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">
                              surgery
                            </span>
                            <span className="text-xs text-on-surface">
                              {s.name}
                              <span className="text-on-surface-variant">
                                {" "}
                                &middot; {s.year}
                              </span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {patient.familyHistory.length > 0 && (
                    <div>
                      <p className="text-[11px] font-semibold text-on-surface-variant mb-1.5">
                        Antecedentes Familiares
                      </p>
                      <div className="space-y-1.5">
                        {patient.familyHistory.map((f) => (
                          <div
                            key={f}
                            className="flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant shrink-0">
                              diversity_3
                            </span>
                            <span className="text-xs text-on-surface">{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </details>

              <div className="border-t border-outline-variant/20 my-5" />

              <details className="group mb-3">
                <summary className="flex items-center justify-between cursor-pointer list-none py-1 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                  <span>Vacunas</span>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-200 group-open:rotate-180">
                    expand_more
                  </span>
                </summary>
                <div className="mt-3 space-y-2">
                  {patient.vaccines.map((v) => (
                    <div
                      key={v.name}
                      className="flex items-center justify-between bg-surface-container-low rounded-lg px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="material-symbols-outlined text-[16px] text-tertiary shrink-0">
                          vaccines
                        </span>
                        <span className="text-xs text-on-surface truncate">
                          {v.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant shrink-0 ml-2">
                        {v.date}
                      </span>
                    </div>
                  ))}
                </div>
              </details>

              <div className="border-t border-outline-variant/20 my-5" />

              <div className="flex flex-col gap-3">
                <button className="w-full text-sm font-semibold text-on-surface-variant px-5 py-3 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-all">
                  Solicitar análisis
                </button>
                <button className="w-full text-sm font-semibold text-white px-5 py-3 rounded-xl primary-gradient shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Finalizar consulta
                </button>
              </div>
            </div>

            {patient.emergencyContact && (
              <div className="bg-white rounded-xl p-4 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                <p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
                  Contacto de emergencia
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px] text-tertiary">
                      emergency
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {patient.emergencyContact.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {patient.emergencyContact.phone}
                    </p>
                    <p className="text-[11px] text-on-surface-variant/70">
                      {patient.emergencyContact.relation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="hidden">
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold font-headline text-on-surface mb-5">
              Resumen post-consulta
            </h3>

            <div className="mb-4">
              <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">
                Diagnóstico
              </label>
              <input
                type="text"
                placeholder="Ingresa el diagnóstico..."
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50"
              />
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">
                Acciones recetadas
              </label>
              <textarea
                rows={4}
                placeholder="Describe las acciones recetadas o deriva a un especialista..."
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50 resize-none"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button className="text-sm font-semibold text-on-surface-variant px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-all">
                Descartar
              </button>
              <button className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl primary-gradient shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Completar
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/doctor", active: false },
          {
            label: "Consultas",
            icon: "group",
            href: "/doctor/consultations",
            active: pathname.startsWith("/doctor/consultations"),
          },
          {
            label: "Agenda",
            icon: "calendar_month",
            href: "/doctor",
            active: false,
          },
          {
            label: "Perfil",
            icon: "person",
            href: "/doctor",
            active: false,
          },
        ]}
      />
    </div>
  )
}
