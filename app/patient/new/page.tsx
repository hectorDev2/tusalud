"use client"

import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { usePathname } from "next/navigation"

export default function NewConsultation() {
  const pathname = usePathname()

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient" },
    {
      label: "Consultas",
      icon: "monitoring",
      href: "/patient/consultations",
      active: pathname.startsWith("/patient/consultations") || pathname === "/patient/new",
    },
    { label: "Mensajes", icon: "chat", href: "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens" },
  ]

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        {/* Headline */}
        <div>
          <h1 className="font-headline text-2xl font-bold text-on-surface">Nueva consulta</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Contanos qué te está pasando para conectarte con el especialista indicado.
          </p>
        </div>

        {/* Reason for visit */}
        <div>
          <label className="font-label text-sm font-semibold text-on-surface block mb-2">
            Motivo de la consulta
          </label>
          <textarea
            placeholder="Describe tus síntomas, inquietudes o el motivo de la consulta..."
            className="w-full bg-transparent border-b-2 border-outline-variant pb-3 pt-1 font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors resize-none"
            rows={3}
          />
        </div>

        {/* Symptom Severity */}
        <div>
          <label className="font-label text-sm font-semibold text-on-surface block mb-3">
            Gravedad de síntomas
          </label>
          <div className="flex gap-2">
            {["Baja", "Media", "Alta"].map((level) => (
              <button
                key={level}
                className={`flex-1 font-label text-sm font-semibold py-2.5 rounded-xl border transition-all ${
                  level === "Medium"
                    ? "bg-primary-fixed text-primary border-primary"
                    : "bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Reference Upload */}
        <div>
          <label className="font-label text-sm font-semibold text-on-surface block mb-2">
            Referencia visual (opcional)
          </label>
          <div className="border-2 border-dashed border-outline-variant rounded-2xl p-8 flex flex-col items-center gap-3 text-center hover:border-primary transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">
              add_a_photo
            </span>
            <div>
              <p className="font-label text-sm font-medium text-on-surface">Tocá para subir una imagen</p>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">PNG, JPG hasta 10MB</p>
            </div>
          </div>
        </div>

        {/* Bento Info Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-container-low rounded-2xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl">lock</span>
            <div>
              <p className="font-label text-xs font-semibold text-on-surface">Datos seguros</p>
              <p className="font-body text-[11px] text-on-surface-variant mt-0.5">
                Encriptado de extremo a extremo
              </p>
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

      {/* Floating Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 px-4 pb-8 pt-3">
        <div className="bg-white/85 backdrop-blur-2xl rounded-2xl p-4 flex items-center justify-between shadow-[0_-4px_32px_rgba(25,28,30,0.08)] max-w-lg mx-auto">
          <div>
            <p className="font-label text-xs font-semibold text-on-surface-variant">Costo</p>
            <p className="font-headline text-xl font-bold text-on-surface">1 Token</p>
          </div>
          <button className="primary-gradient text-white font-label text-sm font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            Empezar consulta
          </button>
        </div>
      </div>
    </div>
  )
}
