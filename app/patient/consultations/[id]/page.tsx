"use client"

import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { usePathname } from "next/navigation"

interface Message {
  id: string
  type: "received" | "sent" | "system" | "file-request"
  sender?: string
  text: string
  time: string
}

const mockMessages: Message[] = [
  {
    id: "m1",
    type: "received",
    sender: "Dr. Smith",
    text: "¡Buen día! Revisé tu caso. ¿Podés contarme más sobre cuándo empezaron los síntomas?",
    time: "10:32 AM",
  },
  {
    id: "m2",
    type: "sent",
    text: "Hola Doctor, empezaron hace unos tres días. Noté un dolor de cabeza persistente y algo de fatiga.",
    time: "10:33 AM",
  },
  {
    id: "m3",
    type: "file-request",
    sender: "Dr. Smith",
    text: "¿Podrías subir una foto del área afectada? Me va a ayudar a evaluar mejor tu condición.",
    time: "10:34 AM",
  },
  {
    id: "m4",
    type: "system",
    text: "Dr. Smith está revisando tus archivos subidos...",
    time: "10:36 AM",
  },
]

export default function ConsultationChat() {
  const pathname = usePathname()

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: true },
    { label: "Mensajes", icon: "chat", href: "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens" },
  ]

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar showProfile role="patient" />

      {/* Status Banner */}
      <div className="primary-gradient px-4 py-3 mt-16">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-label text-[11px] font-semibold text-white/80 uppercase tracking-wider">
              En vivo
            </span>
          </div>
          <p className="font-label text-sm font-semibold text-white mt-1">
            Estado de la consulta: Doctor asignado: Dr. Smith
          </p>
          <p className="font-body text-xs text-white/70 mt-0.5">Respuesta estimada &lt; 2 min</p>
        </div>
      </div>

      <main className="px-4 pt-4 space-y-4 max-w-lg mx-auto">
        {/* Case Summary Collapsible */}
        <details className="bg-surface-container-low rounded-2xl p-4 open:pb-6 group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <span className="font-label text-sm font-semibold text-on-surface">Resumen del caso</span>
            <span className="material-symbols-outlined text-on-surface-variant text-xl transition-transform group-open:rotate-180">
              expand_more
            </span>
          </summary>
          <div className="mt-3 space-y-2 pt-3 border-t border-outline-variant/50">
            <div>
              <p className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Síntomas
              </p>
              <p className="font-body text-sm text-on-surface mt-0.5">
                Dolor de cabeza persistente, fatiga, fiebre leve
              </p>
            </div>
            <div>
              <p className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">
                Historial médico
              </p>
              <p className="font-body text-sm text-on-surface mt-0.5">
                Sin enfermedades crónicas. Alergias: Penicilina
              </p>
            </div>
          </div>
        </details>

        {/* Chat Messages */}
        <div className="space-y-4 pb-4">
          {mockMessages.map((msg) => {
            if (msg.type === "system") {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-surface-container rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-pulse" />
                    <span className="font-body text-xs text-on-surface-variant italic">
                      {msg.text}
                    </span>
                  </div>
                </div>
              )
            }

            if (msg.type === "file-request") {
              return (
                <div key={msg.id} className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-label font-bold text-xs text-primary flex-shrink-0">
                    S
                  </div>
                  <div>
                    <div className="bg-surface-container-high rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="font-label text-xs font-semibold text-on-surface-variant mb-1">
                        {msg.sender}
                      </p>
                      <p className="font-body text-sm text-on-surface">{msg.text}</p>
                      <button className="mt-2 flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-2.5 hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-primary text-lg">
                          upload_file
                        </span>
                        <span className="font-label text-xs font-semibold text-primary">
                          Subir archivo
                        </span>
                      </button>
                    </div>
                    <p className="font-body text-[11px] text-on-surface-variant mt-1 ml-1">
                      {msg.time}
                    </p>
                  </div>
                </div>
              )
            }

            if (msg.type === "received") {
              return (
                <div key={msg.id} className="flex items-start gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-label font-bold text-xs text-primary flex-shrink-0">
                    S
                  </div>
                  <div>
                    <div className="bg-surface-container-high rounded-2xl rounded-tl-sm px-4 py-3">
                      <p className="font-label text-xs font-semibold text-on-surface-variant mb-1">
                        {msg.sender}
                      </p>
                      <p className="font-body text-sm text-on-surface">{msg.text}</p>
                    </div>
                    <p className="font-body text-[11px] text-on-surface-variant mt-1 ml-1">
                      {msg.time}
                    </p>
                  </div>
                </div>
              )
            }

            return (
              <div key={msg.id} className="flex justify-end max-w-[85%] ml-auto">
                <div>
                  <div className="primary-gradient rounded-2xl rounded-br-sm px-4 py-3">
                    <p className="font-body text-sm text-white">{msg.text}</p>
                  </div>
                  <p className="font-body text-[11px] text-on-surface-variant mt-1 mr-1 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* Chat Input */}
      <div className="fixed bottom-24 left-0 w-full z-50 px-4">
        <div className="bg-white/85 backdrop-blur-2xl rounded-2xl px-4 py-2 flex items-center gap-3 shadow-[0_4px_32px_rgba(25,28,30,0.08)] max-w-lg mx-auto">
          <button className="flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              add_circle
            </span>
          </button>
          <button className="flex-shrink-0">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">
              attach_file
            </span>
          </button>
          <input
            type="text"
            placeholder="Escribí tu mensaje..."
            className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none py-2"
          />
          <button className="flex-shrink-0 w-10 h-10 rounded-full primary-gradient flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-lg">send</span>
          </button>
        </div>
      </div>

      <BottomNavBar items={navItems} />
    </div>
  )
}
